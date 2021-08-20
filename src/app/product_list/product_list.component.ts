import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators,ValidationErrors,AbstractControl  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/auth';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
const log = new Logger('Login');
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
  templateUrl: './product_list.component.html',
  styleUrls: ['./product_list.component.scss'],
})
export class ProductListComponent implements OnInit {
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
  public loginForm: FormGroup;
  //dataSource = ELEMENT_DATA;
  quote: string | undefined;
  show: boolean = false;
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
  branchid: any;
  category: any = [];
  item_list: any = [];
  branchaddress: any;
  branch_name: string;
  quantity: number;
  p: number = 1;
  display: any = 'none';
  password: string;
  show_button: Boolean = false;
  validusername: boolean;
  validpassword: boolean;
  submitted = false;
  error: string;
  page = 1;
  itemsPerPage = 12;
  totalItems: any;
  pages: any;
  branch_list: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private CommonService: CommonService,
    private Spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    this.CommonService.viewcart_items.subscribe(() => {
      this.Spinner.show();
      if (this.authenticationService.isAuthenticated()) {
        this.authenticationService.viewCartItems().subscribe((response) => {
          this.Spinner.hide();
          this.ngOnInit();
        });
      }
    });
  }

  ngOnInit() {
    this.CommonService.isShow_checkoutbtn(true);
    this.password = 'password';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map((results) => ({
          params: results[0],
          query: results[1],
        }))
      )
      .subscribe((results) => {
        this.branchid = results.query.branchid;
        this.branchaddress = results.query.branch_address;
      });
    localStorage.setItem('branch_id', this.branchid);

    this.branch_name = localStorage.getItem('branch_name');
    //this.CommonService.Notify_count.subscribe((count) => (this.notifyBadge = count));
    this.profilePic = localStorage.getItem('profilePic');
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
    });
    this.isLoading = true;

    this.Spinner.show();
    let item_req = {
      branch_id: this.branchid,
      page_count: this.itemsPerPage,
      page_number: this.page,
    };
    this.getProductlist(item_req);
  }
  get f() {
    return this.loginForm.controls;
  }
  scl(e:HTMLElement){
    e.scrollIntoView();
  }
  login() {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);
      this.error = '';
      this.Spinner.show();
      this.authenticationService.login(formData).subscribe((data: any) => {
        this.Spinner.hide();
        if (data.status == 'ok' && data.responseCode == '200' && data.role == 'customer') {
          localStorage.setItem('profileName', data.fname);
          localStorage.setItem('profilePic', data.photo);
          this.CommonService.updateIdentity(data.photo, data.fname);
          localStorage.setItem('access', data['access']);
          localStorage.setItem('refresh', data['refresh']);
          this.display = 'none';
          this.ngOnInit();
          this.CommonService.addedcart_items();
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
  product_list() {
    const navigationExtras = {
      queryParams: {
        branchid: this.branch_list.branch_name,
        branch_address: this.branch_list.branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  addtocart(item_id: any, name: any) {
    let cart_req = {
      item_id: item_id,
      quantity: 1,
    };
    if (this.authenticationService.isAuthenticated()) {
      // let temp_ids: any;
      // temp_ids = this.CredentialsService.getCustomerId();
      this.Spinner.show();
      this.authenticationService.addToCart(cart_req).subscribe((response) => {
        this.Spinner.hide();
        this.CommonService.isShow_checkoutbtn(true);
        this.CommonService.update_cartbadge(0);
        this.Spinner.hide();
        if (response['status'] == 'OK' && response['flag'] == 0) {
          this.toastr.info(1 + '+ ' + name, response['message']);
          this.CommonService.addedcart_items();
          this.ngOnInit();
        } else if (response['flag'] == 1) {
          Swal.fire({
            title: 'your cart contains products from another shop. Do you want remove the selection and add product',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.value) {
              this.Spinner.show();
              this.authenticationService.clearCartItems().subscribe((response) => {
                this.Spinner.hide();
                if (response['status'] == 'ok') {
                  let cart_req = {
                    item_id: item_id,
                    quantity: 1,
                  };
                  this.Spinner.show();
                  this.authenticationService.addToCart(cart_req).subscribe((response) => {
                    this.Spinner.hide();
                    if (response['status'] == 'OK' && response['flag'] == 0) {
                      this.toastr.info(1 + '+ ' + name, response['message']);
                      this.CommonService.addedcart_items();
                      this.ngOnInit();
                    }
                  });
                }
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: 'You would like to add the product in cart, please login or signup for an account',
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
  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
  }
  modalClose() {
    this.display = 'none';
  }
  getProductlist(item_req: any) {
    this.Spinner.show();
    this.authenticationService.getItemList(item_req).subscribe((response: any) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.category = [];
        this.item_list = [];
        this.totalItems = response.count;
        if (response['data'].length > 0) {
          this.category.push('All');
        }
        for (let i = 0; i < response['data'].length; i++) {
          if (this.category.includes(response['data'][i].item.category.category_name)) {
          } else {
            this.category.push(response['data'][i].item.category.category_name);
          }
        }
        this.item_list = response['data'];
        this.branch_list = response['branchlist'][0];
      }
    });
  }
  gty(page: any) {
    this.pages = page;
    let item_req = {
      branch_id: this.branchid,
      page_count: this.itemsPerPage,
      page_number: page,
    };
    this.getProductlist(item_req);
  }
  incfn1(pl: any, quan: any, li: any, name: any) {
    let data: any;
    this.quantity;
    if (pl == 'plus') {
      this.quantity = quan + 1;
      data = {
        quantity: quan + 1,
        item_id: li,
      };
    } else if (pl == 'minus') {
      let temp_ids: any;
      this.quantity = quan - 1;
      data = {
        quantity: quan - 1,
        item_id: li,
      };
    }
    if (this.authenticationService.isAuthenticated()) {
      // let temp_ids: any;
      // temp_ids = this.CredentialsService.getCustomerId();
      this.Spinner.show();
      this.authenticationService.updateCartItems(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          if (this.quantity > 0) {
            this.toastr.info(this.quantity + '+ ' + name, ' Item updated to cart');
          } else {
            this.toastr.info(name, 'Item removed to cart');
          }
          this.CommonService.addedcart_items();
          this.ngOnInit();
        }
      });
    } else {
      this.router.navigate(['login']);
    }
  }
  categoty_item(category_name: any) {
    if (this.pages == undefined) {
      this.pages = 1;
    }
    if (category_name == 'All') {
      let category_req = {
        branch_id: this.branchid,
        page_count: this.itemsPerPage,
        page_number: this.pages,
      };
      this.Spinner.show();
      this.authenticationService.getItemList(category_req).subscribe((response:any) => {
        this.Spinner.hide();
        this.totalItems = response.count;
        if (response['status'] == 'OK') {
          this.item_list = response['data'];
        }
      });
    } else {
      let category_req = {
        category_name: category_name,
        page_count: this.itemsPerPage,
        page_number: this.pages,
        branch_id: this.branchid,
      };
      this.Spinner.show();
      this.authenticationService.get_branch_item_list(category_req).subscribe((response:any) => {
        this.Spinner.hide();
        this.totalItems = response.count;
        if (response['status'] == 'OK') {
          this.item_list = response['data'];
        }
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