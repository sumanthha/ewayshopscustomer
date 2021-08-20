import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { AuthenticationService } from './authentication.service';
const log = new Logger('Login');
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../common/common.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  isLoading = false;
  // version: string | null = environment.version;
  error: string | undefined;
  validusername: boolean;
  validpassword: boolean;
  submitted = false;
  password: string;
  show: boolean = false;

  show_button: Boolean = false;
  constructor(
    private router: Router,
    private Spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private CommonService: CommonService,
    private apiService: AuthenticationService
  ) {}

  ngOnInit() {
    this.password = 'password';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  login() {
    if (this.loginForm.valid) {
      // let formObj = {
      //   email: dataForAPI.username,
      //   password: dataForAPI.password,

      // };
      const formData = new FormData();
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);
      this.error = '';
      this.Spinner.show();

      this.apiService.login(formData).subscribe((data: any) => {
        this.Spinner.hide();
        if (data.status == 'ok' && data.responseCode == '200' && data.role == 'customer') {
          localStorage.setItem('profileName', data.fname);
          localStorage.setItem('profilePic', data.photo);
          this.CommonService.updateIdentity(data.photo, data.fname);
          localStorage.setItem('access', data['access']);
          localStorage.setItem('refresh', data['refresh']);
          this.router.navigate(['/home'], { replaceUrl: true });
        } else if (data.responseCode == 404) {
          this.snackBar.open(data.message, 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        } else if (data.role != 'customer') {
          this.snackBar.open("User does't exist", 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        } else {
          this.zone.run(() => {
            this.error = '';
            console.log(data.data);

            log.debug(`Login error: ${data.data}`);
            this.error = data.data;
          });
          this.snackBar.open(data.message, 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      });
    }
    this.submitted = true;
  }
  get f() {
    return this.loginForm.controls;
  }
  showPass() {
    this.show_button = !this.show_button;
    this.show = !this.show;
  }
  home() {
    this.router.navigate(['/home']);
  }
}
