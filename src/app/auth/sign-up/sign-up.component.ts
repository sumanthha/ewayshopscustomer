import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from './sign-up.service';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  public signup_form: FormGroup;
  latitude: any;
  longitude: any;
  address: any;
  geoCoder: google.maps.Geocoder;
  zoom: number;
  accesstoken: string;
  constructor(
    private Spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private SignupService: SignupService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  isLoading = false;
  submitted = false;
  ngOnInit(): void {
    this.accesstoken = this.route.snapshot.paramMap.get('id');
    console.log(this.accesstoken, 'accesstoken');
    this.signup_form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      terms: [false, Validators.requiredTrue],
    });
  }
  home() {
    this.router.navigate(['/home']);
  }
  termandconditions() {
    this.router.navigate(['termandconditions']);
  }
  privacy() {
    this.router.navigate(['privacy']);
  }
  signup() {
    // this.submitted = true;
    let country_code="+1"
    if (this.signup_form.valid) {
      let data = {
        email: this.signup_form.value.email,
        phone_number: country_code + this.signup_form.value.phoneno,
      };
      this.Spinner.show();
      this.SignupService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          Swal.fire(
            'Successfully Verified',
            'We have sent on link to your email address, please click on that link and continue your registration',
            'success'
          );
          this.router.navigate(['login']);
          return;
        } else {
          this.snackBar.open(response['data'], 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      });
    }
    this.submitted = true;
  }
  get f() {
    return this.signup_form.controls;
  }
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }
  OnlyNumbers(event:any) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight','ArrowLeft'];
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    } else {
      if (regex.test(event.key)) {
        return true;
      } else {
        return false;
      }
    }
    }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}
