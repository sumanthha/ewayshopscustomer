import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupNextService } from '../sign-next/sign-next.service';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-next.component.html',
  styleUrls: ['./sign-next.component.scss'],
})
export class SignupNextComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  public signup_form: FormGroup;
  latitude: any;
  longitude: any;
  address: any;
  geoCoder: google.maps.Geocoder;
  zoom: number;
  showpswdmatch: boolean = true;
  show_button: Boolean = false;
  show_button1: Boolean = false;
  show: boolean = false;
  showConfirm: boolean = false;
  phonenumber: string;
  email: string;
  accesstoken: string;
  form: FormGroup;
  constructor(
    private Spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private SignupnextService: SignupNextService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  isLoading = false;
  submitted = false;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.accesstoken = params['token'];
      this.phonenumber = params['phone_number'];
    });
    this.form = this.formBuilder.group({
      email: this.email,
      phone_no: this.phonenumber,
    });
    this.signup_form = this.formBuilder.group({
      // email: ['',[ Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      // phone_no: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
    this.ngZone.run(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();
        this.zoom = 12;
        this.ngZone.run(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchAddElementRef.nativeElement, {});

          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.address = place.formatted_address;
              let tempcity: any;
              let temppostal_code: any;
              let tempcountry: any;
              let tempstate: any;
              place.address_components.forEach(function (element2: any) {
                element2.types.forEach(function (element3: any) {
                  switch (element3) {
                    case 'postal_code':
                      temppostal_code = element2.long_name;
                      break;
                    case 'administrative_area_level_1':
                      tempstate = element2.long_name;
                      break;
                    case 'locality':
                      tempcity = element2.long_name;
                      break;
                    case 'country':
                      tempcountry = element2.short_name;
                      break;
                  }
                });
              });
            });
          });
        });
      });
    });
  }
  termandconditions() {
    this.router.navigate(['termandconditions']);
  }
  showPass() {
    this.show_button = !this.show_button;
    this.show = !this.show;
  }
  showConfpass() {
    this.showConfirm = !this.showConfirm;
    this.show_button1 = !this.show_button1;
  }
  privacy() {
    this.router.navigate(['privacy']);
  }
  signup() {
    if (this.signup_form.valid) {
      if (this.signup_form.value.password != this.signup_form.value.confirm_password) {
        this.showpswdmatch = false;
        return true;
      }
      let data = {
        jwt_token: this.accesstoken,
        first_name: this.signup_form.value.first_name,
        last_name: this.signup_form.value.last_name,
        email: this.email,
        phone_number: this.phonenumber,
        address: this.signup_form.value.address,
        city: this.signup_form.value.city,
        state: this.signup_form.value.state,
        zipcode: this.signup_form.value.zipcode,
        phone_no: this.signup_form.value.phone_no,
        password: this.signup_form.value.password,
        confirm_password: this.signup_form.value.confirm_password,
      };
      this.Spinner.show();
      this.SignupnextService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          Swal.fire('Customer created successfully', 'success');
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
  home() {
    this.router.navigate(['/home']);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}
