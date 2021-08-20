import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { QuoteService } from './quote.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ValidationErrors,AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/auth';
import { Logger, UntilDestroy, untilDestroyed } from '@core';

const log = new Logger('Login');
export interface PeriodicElement {
  orderid: any;
  date: any;
  customername: any;
  mail: string;
  amount: any;
  status: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['order_id', 'order_date', 'customer', 'email', 'amount', 'order_status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  slides = [
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
  ];
  quote: string | undefined;
  isLoading = false;
  profilePic: any;
  profileName: any;
  Neworder_count: any;
  Completedorder_count: any;
  Inprocessingorder_count: any;
  new_list: any = [];
  OrdersTable: MatTableDataSource<unknown>;
  notifyBadge: any;
  inventory_list: any = [];
  showShortDesciption = true;
  display: any = 'none';
  show: boolean = false;
  p: number = 1;
  private geoCoder: any;
  latitude: any;
  longitude: any;
  zoom: number;
  address: any;
  branchname: string;
  zipcode: string;
  password: string;
  show_button: Boolean = false;
  validusername: boolean;
  validpassword: boolean;
  submitted = false;
  error: string;
  public loginForm: FormGroup;
  longi: any;
  lati: string;
  page = 1;
  itemsPerPage = 12;
  totalItems: any;
  constructor(
    private quoteService: QuoteService,
    private CommonService: CommonService,
    private Spinner: NgxSpinnerService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private apiService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.CommonService.current_lat.subscribe((latitude: any) => {
      this.latitude = latitude;
    });
    this.CommonService.current_long.subscribe((longitude: any) => {
      this.longitude = longitude;
    });
    this.CommonService.branch_name.subscribe((name: any) => {
      this.branchname = name;
      if (this.branchname != '' && this.branchname != undefined && this.zipcode != '' && this.zipcode != undefined) {
        this.getstoreList('', '', this.branchname, this.zipcode, this.page);
      } else if (
        this.branchname != '' &&
        this.branchname != undefined &&
        (this.zipcode == '' || this.zipcode == undefined)
      ) {
        this.getstoreList('', '', this.branchname, '', this.page);
      } else {
        this.api_call_validation_branch();
      }
    });
    this.CommonService.zipcode.subscribe((zipcode: any) => {
      this.zipcode = zipcode;

      if (this.zipcode != '' && this.zipcode != undefined && (this.branchname == '' || this.branchname == undefined)) {
        this.getstoreList('', '', '', this.zipcode, this.page);
      } else if (
        this.zipcode != '' &&
        this.zipcode != undefined &&
        (this.branchname != '' || this.branchname != undefined)
      ) {
        this.getstoreList('', '', this.branchname, this.zipcode, this.page);
      } else {
        this.api_call_validation_branch();
      }
    });
  }
  getStringValue(value: any): string {
    if (value != undefined) {
      return value.toString();
    }
  }
  gty(page: any) {
    this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, page);
  }
  getstoreList(lat: string, long: string, branch: any, zipcode: any, flag: any) {
    this.lati = this.getStringValue(lat);
    this.longi = this.getStringValue(long);
    let store_req;
    store_req = {
      zipcode: zipcode,
      branch_name: branch,
      page_number: flag,
      page_count: this.itemsPerPage,
      longitude: this.longi,
      latitude: this.lati,
    };
    this.Spinner.show();
    this.apiService.getStoreList(store_req).subscribe((response: any) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.new_list = [];
        this.totalItems = response.count;
        response['data'].forEach((store: any, index: any) => {
          let obj = {
            sno: index + 1,
            id: store['id'],
            branch_code: store['branch_code'],
            branch_name: store['branch_name'],
            branch_email: store['branch_email'],
            zipcode: store['zipcode'],
            branch_phone: store['branch_phone'],
            branch_description: store['branch_description'],
            branch_address: store['branch_address'],
            wishlist: store['wishlist'],
            photo: store['photo'],
          };
          this.new_list.push(obj);
        });
      }
      this.OrdersTable = new MatTableDataSource(this.new_list);
      setTimeout(() => (this.OrdersTable.paginator = this.paginator));
      setTimeout(() => (this.OrdersTable.sort = this.sort));
    });
  }
  public setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.CommonService.get_Currentlocation(this.latitude, this.longitude);
        this.getAddress(this.latitude, this.longitude);
        this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
      });
    }
  }
  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          localStorage.setItem('branch_address', this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
  }
  shop_now(branch_id: any, branch_address: any, branch_name: any) {
    localStorage.setItem('branch_name', branch_name);
    localStorage.setItem('branch_address', branch_address);
    localStorage.setItem('branch_id', branch_id);
    const navigationExtras = {
      queryParams: {
        branchid: branch_id,
        branch_address: branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  modalClose() {
    this.display = 'none';
  }
  get f() {
    return this.loginForm.controls;
  }
  login() {
    if (this.loginForm.valid) {
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
  showPass() {
    this.show_button = !this.show_button;
    this.show = !this.show;
  }
  wishlist(wish_flag: any, store_id: any) {
    if (this.apiService.isAuthenticated()) {
      // let temp_ids: any;
      // temp_ids = this.CredentialsService.getCustomerId();
      if (wish_flag == 'add') {
        let wishlist_req = {
          store_id: store_id,
        };
        this.Spinner.show();
        this.apiService.addToWishlist(wishlist_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.ngOnInit();
            // if (this.branchname != '') {
            //   // this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
            //   this.ngOnInit();
            // } else {
            //   this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
            // }
          }
        });
      } else {
        this.Spinner.show();
        let wishlist_req = {
          store_id,
        };
        this.apiService.deleteToWhishlist(wishlist_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            // if (this.branchname != '') {
            //   this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
            // } else {
            //   this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
            // }
            this.ngOnInit();
          }
        });
      }
    } else {
      Swal.fire({
        title:
          'The add to wishlist feature is only available to registered users, please login or signup for an account to use it.',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value) {
          this.display = 'block';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    }
  }

  api_call_validation_branch() {
    if (
      this.latitude != null &&
      this.latitude != undefined &&
      this.latitude != '' &&
      this.longitude != null &&
      this.longitude != undefined &&
      this.longitude != ''
    ) {
      if (this.branchname != '' && this.branchname != undefined && this.zipcode != '' && this.zipcode != undefined) {
        this.getstoreList('', '', this.branchname, this.zipcode, this.page);
      } else if (
        this.branchname != '' &&
        this.branchname != undefined &&
        (this.zipcode == '' || this.zipcode == undefined)
      ) {
        this.getstoreList('', '', this.branchname, '', this.page);
      } else if (
        this.zipcode != '' &&
        this.zipcode != undefined &&
        (this.branchname == '' || this.branchname == undefined)
      ) {
        this.getstoreList('', '', '', this.zipcode, this.page || (this.longitude != '' && this.longitude != undefined));
      } else if (this.latitude != '' && this.latitude != undefined) {
        this.getstoreList(this.latitude, this.longitude, this.branchname, this.zipcode, this.page);
      }
    } else {
      this.geoCoder = new google.maps.Geocoder();
      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
      });
    }
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