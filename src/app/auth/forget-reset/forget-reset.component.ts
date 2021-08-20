import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgetPasswordService } from './forget-rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-forget-reset',
  templateUrl: './forget-reset.component.html',
  styleUrls: ['./forget-reset.component.scss'],
})
export class ForgetResetComponent implements OnInit {
  public forgotForm: FormGroup;
  public resetForm: FormGroup;
  accesstoken: any;
  password: any;
  isLoading = false;
  //show forgot password form
  show_forget_form = true;
  //reset form show
  show_reset_form = false;
  //reset success mesasage div
  reset_success = false;
  //mail send mesage
  link_send_message = false;
  checkRoute: any;
  show_password_form: boolean;
  showConfim: boolean = true;
  show_button: Boolean = false;
  show_button1: Boolean = false;
  show: boolean = false;
  showConfirm: boolean = false;
  constructor(
    private Spinner: NgxSpinnerService,
    private ForgetPasswordService: ForgetPasswordService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiserveice: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.accesstoken = this.route.snapshot.paramMap.get('id');
    //forgot form
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
  }
  //return from values for validation
  get f() {
    return this.forgotForm.controls;
  }
  home() {
    this.router.navigate(['/home']);
  }
  cancel() {
    this.router.navigate(['/login']);
  }

  forgotPassword() {
    if (this.forgotForm.value.password != this.forgotForm.value.confirm_password) {
      this.showConfim = false;
      return false;
    }
    if (this.forgotForm.valid) {
      this.Spinner.show();
      let reset_req = {
        jwt_token: this.accesstoken,
        password: this.forgotForm.value.password,
      };
      this.apiserveice.reset_Password(reset_req).subscribe(
        (response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.snackBar.open('Password reset successfully', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
            this.router.navigateByUrl('login');
          } else {
            this.snackBar.open('Sorry,not able to send reset link', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
          }
        },
        (error) => {
          this.snackBar.open('Sorry,not able to send reset link', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      );
    }
    this.isLoading = true;
  }
  showPass() {
    this.show_button = !this.show_button;
    this.show = !this.show;
  }
  showConfpass() {
    this.showConfirm = !this.showConfirm;
    this.show_button1 = !this.show_button1;
  }
}

//CONFIRM PASSWORD CUSTOM VALIDATION
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('confirm_password');
  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }
  return { passwordsNotMatching: true };
};
