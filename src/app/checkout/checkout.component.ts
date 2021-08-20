import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { Observable, combineLatest, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ProfileService } from '../profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '@app/auth';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
export interface PeriodicElement {
  orderid: any;
  p: any;
  date: any;
  customername: any;
  mail: string;
  amount: any;
  status: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  slides = [
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
    { image: 'assets/dashboard/banner.png' },
  ];
  displayedColumns: string[] = ['order_id', 'order_date', 'customer', 'email', 'amount', 'order_status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //dataSource = ELEMENT_DATA;
  minDate = new Date();

  
  quote: string | undefined;
  isLoading = false;
  profilePic: any;
  endtime: any;
  start_time: any;
  profileName: any;
  Neworder_count: any;
  Completedorder_count: any;
  Inprocessingorder_count: any;
  new_list: any = [];
  OrdersTable: MatTableDataSource<unknown>;
  notifyBadge: any;
  inventory_list: any = [];
  showShortDesciption = true;
  branchid: any;
  category: any = [];
  item_list: any = [];
  branchaddress: any;
  branch_name: string;
  quantity: number;
  p: number = 1;
  isPayment: boolean = false;
  payment_option: any;
  isShowCreditCard: boolean = false;
  branch_address: string;
  branchname: string;
  ispickup: boolean = true;
  branch_id: string;
  store_name: any;
  store_address: any;
  store_email: any;
  store_phoneno: any;
  customer_name: string;
  selection: number;
  person_name: any;
  person_phoneno: any;
  pickup_date: any;
  radio_option: any;
  showpickperson: boolean = false;
  validpickup_endtime: boolean = true;
  validpickup_starttime: boolean = true;
  valid_pickupdate: boolean = true;
  valid_personname: boolean = true;
  valid_phoneno: boolean = true;
  customer_phoneno: any;
  customer_id: any;
  Show_paymentissue: boolean = true;
  order_id: any;
  total_price: any;
  cartlength: any;
  showorderpickup: boolean = true;
  validpickup_time: boolean = true;
  paypal_url: any;
  trackingid: any;
  time: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private CommonService: CommonService,
    private Spinner: NgxSpinnerService,
    private apiservice: AuthenticationService,
    private ProfileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.CommonService.viewcart_items.subscribe(() => {
      this.getCartprice();
    });
  }

  ngOnInit() {
    this.formatAMPM(this.minDate);
    this.getCartprice();
    this.ispickup = true;
    // this.branch_address = localStorage.getItem('branch_address');
    // this.branch_name = localStorage.getItem('branch_name');
    this.branch_id = localStorage.getItem('branch_id');
    this.customer_name = localStorage.getItem('profileName');
    this.Spinner.show();
    let x = this.branch_id;
    let branchid: number = +x;
    this.apiservice.getStoreListcart(branchid).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.store_name = response['data'].branch_name;
        this.store_address = response['data'].branch_address;
        this.store_email = response['data'].branch_email;
        this.store_phoneno = response['data'].branch_phone;
      }
    });
    this.Spinner.show();
    this.apiservice.GetProfile().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.customer_phoneno = response['data'].phone_number;
        this.customer_id = response['data'].id;
      }
    });
  }
  formatAMPM(date: any) {
    this.timeSupport(date)
  }
  timeSupport(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    this.time = strTime;
    console.log(this.time)
  }
  
  EndDateChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.pickup_date = event.value
    let b = moment(this.pickup_date).format('YYYY-MM-DD');
    let b1 = moment(this.minDate).format('YYYY-MM-DD');
    if (b > b1) {
      this.timeSupport(this.pickup_date)
    } else {
      this.timeSupport(this.minDate)
    }
  }
  timeCheck(e:any){
    
        console.log('timetest',  this.start_time);
  }
  
  pickup() {
    this.isPayment = false;
    this.ispickup = true;
  }
  // EndDateChange(event: any) {
  //   this.pickup_date = event.target.value;
  // }
  radioChange(event: any) {
    let radio_resp = event.value;
    if (radio_resp == 1) {
      this.radio_option = radio_resp;
      this.showpickperson = false;
    } else {
      this.radio_option = radio_resp;
      this.showpickperson = true;
    }
  }
  changePayment(e: any) {
    this.payment_option = e.value;
    if (this.payment_option == '3') {
      this.isShowCreditCard = true;
    } else {
      this.isShowCreditCard = false;
    }
  }
  makepayment() {
    if (this.cartlength > 0) {
      if (this.payment_option == undefined) {
        this.Show_paymentissue = false;
        return true;
      }
      if (this.payment_option == '1') {
        let payment_req = {
          order_status: 'new',
          payment_type: 'Pay on Delivery',
          order_id: this.order_id,
        };
        this.Spinner.show();
        this.apiservice.PayonDelivery_payment(payment_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.CommonService.notification_count('');
            this.CommonService.update_cartbadge(0);
            this.toastr.info('Your order has been placed successfully, Please note your order id:' + this.order_id + 'for tracking your order');
            this.payment_option = '';
            this.CommonService.addedcart_items();
            this.router.navigate(['/myorders']);
          }
        });
      } else if (this.payment_option == '2') {
        let payment_req = {
          order_status: 'pending',
          payment_type: 'paypal',
          order_id: this.order_id,
        };
        this.Spinner.show();
        this.apiservice.PayonDelivery_payment(payment_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.paypal_url = response['data'].approve_url;
            this.trackingid = response['data'].tracking_id;
            this.toastr.info('Please wait while you are redirected to the payment page, Do not refresh the page')
            // localStorage.setItem('Order_id', response['data'].order_key);
            window.location.href = this.paypal_url + '&locale.x=en_US&country.x=US';
          }
        });
      }
    } else {
      this.toastr.info('You could not proceed to payment because your cart is empty');
    }
  }
  product_list() {
    const navigationExtras = {
      queryParams: {
        branchid: this.branch_id,
        branch_address: this.store_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  getCartprice() {
    this.Spinner.show();
    this.apiservice.viewCartItems().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.cartlength = response['data']['data'].length;
        this.total_price = response['data'].total_amount;
        this.branch_id = response['data']['branchlist'][0].id;
      }
    });
  }
  checkout() {
    if (this.cartlength > 0) {
      if (this.radio_option == undefined) {
        this.radio_option = 1;

        // this.showorderpickup = false;
        // return false;
      }

      if (this.radio_option == '2') {
        if (this.person_name == '' || this.person_name == undefined) {
          this.valid_personname = false;
          return true;
        } else {
          this.valid_personname = true;
        }
        if (this.person_phoneno == '' || this.person_phoneno == undefined) {
          this.valid_phoneno = false;
          return true;
        } else {
          this.valid_phoneno = true;
        }
      }
      if (this.pickup_date == '' || this.pickup_date == undefined) {
        this.valid_pickupdate = false;
        return true;
      } else {
        this.valid_pickupdate = true;
      }
      if (this.start_time == '' || this.start_time == undefined) {
        this.validpickup_starttime = false;
        return true;
      } else {
        this.validpickup_starttime = true;
      }
      if (this.endtime == '' || this.endtime == undefined) {
        this.validpickup_endtime = false;
        return true;
      } else {
        this.validpickup_endtime = true;
      }
      // if (this.start_time > this.endtime) {
      //   this.validpickup_time = false;
      //   return true;
      // } else {
      //   this.validpickup_time = true;
      // }

      var today = new Date();
      let current_date = today;
      let checkout_req;
      if (this.radio_option == '2') {
        checkout_req = {
          customer_id: this.customer_id,
          store_id: this.branch_id,
          customer_phone_no: this.customer_phoneno,
          total_amount: this.total_price,
          date: current_date,
          order_status: 'new',
          start_time: this.start_time,
          end_time: this.endtime,
          pickup_person_type: this.radio_option,
          pickup_person_name: this.person_name,
          pickup_person_phone: this.person_phoneno,
          pickup_address: this.store_address,
          pickup_email: this.store_email,
          pickup_phone: this.store_phoneno,
        };
      } else {
        checkout_req = {
          customer_id: this.customer_id,
          store_id: this.branch_id,
          customer_phone_no: this.customer_phoneno,
          total_amount: this.total_price,
          date: current_date,
          order_status: 'new',
          start_time: this.start_time,
          end_time: this.endtime,
          pickup_person_type: this.radio_option,
          pickup_person_name: this.customer_name,
          pickup_person_phone: this.store_phoneno,
          pickup_address: this.store_address,
          pickup_email: this.store_email,
          pickup_phone: this.store_phoneno,
        };
      }
      this.Spinner.show();
      this.apiservice.checkout(checkout_req).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'OK') {
          this.order_id = response['order_id'];
          this.CommonService.setOrderkey_paypal(this.order_id);
          localStorage.setItem('Order_id', this.order_id);
          sessionStorage.setItem("order_id", this.order_id);

          this.isPayment = true;

          this.ispickup = false;
        }
      });
    } else {
      this.toastr.info('You could not proceed to pickup details because your cart is empty');
    }
  }
}
