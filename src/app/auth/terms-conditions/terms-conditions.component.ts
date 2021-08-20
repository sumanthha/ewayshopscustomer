import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TermsandConditionService } from './terms-conditions.service';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-sign-up',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsandConditionComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  public signup_form: FormGroup;
  latitude: any;
  longitude: any;
  address: any;
  geoCoder: google.maps.Geocoder;
  zoom: number;
  constructor(
    private Spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private TermsandConditionService: TermsandConditionService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  isLoading = false;
  submitted = false;
  ngOnInit(): void {
    this.signup_form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

      location: ['', Validators.required],
      phoneno: ['', Validators.required],
      branch_name: ['', Validators.required],
    });
  }
  back() {
    this.router.navigate(['home']);
  }
  signup() {
    // this.submitted = true;
    if (this.signup_form.valid) {
      let data = {
        branch_name: this.signup_form.value.branch_name,
        email: this.signup_form.value.email,
        first_name: this.signup_form.value.name,
        phone_number: this.signup_form.value.phoneno,
        address: this.signup_form.value.location,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.Spinner.show();
      this.TermsandConditionService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.signup_form.reset();
          this.snackBar.open('Store Registered Successfully', 'Close', {
            duration: 5000,
            verticalPosition: 'top',
          });
        } else {
          this.snackBar.open(response['message'], 'Close', {
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
}
