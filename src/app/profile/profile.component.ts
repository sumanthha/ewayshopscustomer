import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';
import { ProfileService } from '../../app/profile/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as S3 from 'aws-sdk/clients/s3';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../common/common.service';
import { threadId } from 'worker_threads';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profile_form: FormGroup;
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  Getprofile: any[];
  Name: any;
  Address: any;
  email: any;
  phone_no: any;
  profile_name: any;
  selectedFile: File;
  imgType: boolean = true;
  imgUrl: string;
  geoCoder: any;
  latitude: any;
  longitude: any;
  zoom: number = 5;
  address: string;
  profilePic: any;
  profileName: any;
  GetOrders: any[];
  branch_name: any;
  branch_address: any;
  branch_description: any;
  Getcustomer: any[];
  Getcustomer_count: any;
  GetOrders_count: any;
  device: boolean = false;
  isDisabled = true;
  GetNotification: any[];
  notifyBadge: string;
  isShowProfile: boolean = true;
  getprofilelist: any;
  submitted = false;
  firstname: any;
  profile_imagepath: any;
  isDisable = true;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private ProfileService: ProfileService,
    private Spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private CommonService: CommonService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isDisable = true;
    this.branch_address = localStorage.getItem('branch_address');
    this.branch_name = localStorage.getItem('branch_name');
    this.authenticationService.GetProfile().subscribe((response) => {
      if (response['status'] == 'ok') {
        this.getprofilelist = response['data'];
      }
    });
    this.profile_form = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', Validators.required],
      phone_no: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      profile_name: [''],
    });
  }
  get f() {
    return this.profile_form.controls;
  }
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  edit_profile(response: any) {
    this.isShowProfile = false;
    this.authenticationService.GetProfile().subscribe((response) => {
      if (response['status'] == 'ok') {
        console.log(response['data'].photo, "response['data']");
        this.getprofilelist = response['data'];
        this.profile_form.patchValue({
          first_name: response['data'].first_name,
          last_name: response['data'].last_name,
          email: response['data'].email,
          phone_no: response['data'].phone_number,
          address: response['data'].address,
          city: response['data'].city,
          state: response['data'].state,
          zipcode: response['data'].zipcode,
          profile_name: response['data'].photo,
        });
      }
    });
  }
  cancel() {
    this.isShowProfile = true;
  }
  logout() {
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }
  updateprofile() {
    if (this.imgUrl == undefined) {
      this.profile_imagepath = this.profile_name;
    } else {
      this.profile_imagepath = this.imgUrl;
    }
    if (this.profile_form.valid) {
      let send_update_value = {
        first_name: this.profile_form.value.first_name,
        last_name: this.profile_form.value.last_name,
        email: this.profile_form.value.email,
        phone_number: this.profile_form.value.phone_no,
        address: this.profile_form.value.address,
        city: this.profile_form.value.city,
        state: this.profile_form.value.state,
        zipcode: this.profile_form.value.zipcode,
        photo: this.profile_imagepath,
      };
      this.Spinner.show();
      this.authenticationService.UpdateProfile(send_update_value).subscribe((data) => {
        this.Spinner.hide();
        if (data['status'] == 'ok') {
          localStorage.setItem('profilePic', this.imgUrl);
          localStorage.setItem('profileName', this.profile_form.value.first_name);
          this.CommonService.updateIdentity(this.imgUrl, this.profile_form.value.first_name);
          //this.CommonService.profilePic(this.imgUrl)
          this.ngOnInit();
          this.isShowProfile = true;
        }
      });
    }
    this.submitted = true;
  }
  onFileSelect(event: any) {
    this.selectedFile = <File>event.target.files[0];
    if (
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpg'
    ) {
      this.imgType = true;
      this.ew_method(this.selectedFile);
    } else {
      this.imgType = false;
      this.toastr.info('Could you please upload image file');
      return true;
    }
    this.profile_form.patchValue({
      profile_name: this.selectedFile.name,
    });
  }

  ew_method(name: any) {
    // this.uiLoader.start();
    this.checkImage();
    var self = this;
    const bucket = new S3({
      accessKeyId: environment.S3_accessKeyId,
      secretAccessKey: environment.S3_secretAccessKey,
      region: environment.S3_region,
    });

    const contentType = name.type;
    const params = {
      Bucket: environment.S3_bucket,
      Key: name.name,
      Body: name,
      ACL: 'public-read',
      ContentType: contentType,
    };
    bucket.upload(params, function (err: any, data: any) {
      if (err) {
        return false;
      } else {
        self.imgUrl = data.Location;
        return true;
      }
    });
  }
  checkImage() {
    if (!this.imgUrl) {
      this.Spinner.show();
      setTimeout(() => {
        this.checkImage();
      }, 2000);
    } else
      setTimeout(() => {
        this.Spinner.hide();
      }, 100);
  }
}
export class UsernameValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    var value = control.value.trim();
    if (value == 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
}
