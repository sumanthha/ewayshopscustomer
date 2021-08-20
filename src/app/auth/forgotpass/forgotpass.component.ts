import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetService } from './forgot-rest.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss'],
})
export class ForgotpassComponent implements OnInit {
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
  validemail: any;

  constructor(
    private Spinner: NgxSpinnerService,
    private ForgetPasswordService: ForgetService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiserveice: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,UsernameValidator.cannotContainSpace]],
    });
  }
  get f() {
    return this.forgotForm.controls;
  }
  cancel() {
    this.router.navigate(['/login']);
  }
  home() {
    this.router.navigate(['/home']);
  }
  forgotPassword() {
    if (this.forgotForm.valid) {
      this.Spinner.show();
      this.validemail = this.forgotForm.value.email.trim();
      this.apiserveice.forgot_Password(this.validemail).subscribe(
        (response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok' && response['data'] == 'Email_Sent') {
            this.snackBar.open('Reset Link sent to your e-mail', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
            this.router.navigateByUrl('login');
          } else if (response['status'] == 'ok' && response['data'] == 'No_User_Found') {
            this.snackBar.open('Please enter registered mail address', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
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
export class UsernameValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    var value = control.value?.trim();
    if (value == 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
}