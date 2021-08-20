import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as S3 from 'aws-sdk/clients/s3';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightSpanKind } from 'typescript';
import { map, catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { AuthenticationService } from '@app/auth';

export interface MycartData {
  sno: any;
  product_name: any;
  product_id: any;
  category: string;
  sku: any;
}
let CUSTOMER_DATA: MycartData[] = [];

@Component({
  selector: 'app-manage-orders',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.scss'],
})
export class MycartComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
  displayedColumns: string[] = ['sno', 'item_desc', 'quantity', 'price', 'total'];
  GetProduct: any;
  ProdTable: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  files: any[];
  submitted = false;
  //Form Fields
  Getproduct_resp: any[];
  //Form Validation objects
  productid_req: boolean = true;
  selectedFile: File;
  Getcategory: any[];
  selectedCategory: any;
  selectedSubCategory: any;
  Getsubcategory: any[];
  showProduct_table: boolean = true;
  showEdit: boolean = false;
  form: FormGroup;
  imgType: boolean = true;
  imgUrl: string;
  profile_name: any;
  showBulkupload_product: boolean = true;
  showView: boolean = false;
  GetSingleProduct_list: any;
  product_code: any[];
  product_name: any;
  category: any;
  profile_pic: any;
  subcategory: any;
  price: any;
  tax: any;
  sku: any;
  count: any;
  description: any;
  tax_amt: any = '7.5';
  item_image: string;
  item_id: any;
  branch_address: string;
  branch_name: string;
  item_list: any[];
  branch_id: string;
  p: number = 1;
  quantity: any;
  getmycartList: any;
  GetMycartList: any = [];
  delivery: any;
  MycartTable: MatTableDataSource<unknown>;
  store_pickup: any;
  storepickup: any = 'yes';
  branch_list: any;
  isShowBranch_list: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private Spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private CommonService: CommonService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.branch_address = localStorage.getItem('branch_address');
    this.branch_name = localStorage.getItem('branch_name');
    this.branch_id = localStorage.getItem('branch_id');
    this.Spinner.show();
    this.authenticationService.getMyCartList().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.getmycartList = [];
        this.GetMycartList = [];
        this.getmycartList = response['data'];
        if (response['data']['branchlist'].length > 0) {
          this.branch_list = response['data']['branchlist'][0];
          this.isShowBranch_list = true;
        } else {
          this.isShowBranch_list = false;
        }
        response['data']['data'].forEach((item: any, index: any) => {
          let obj = {
            sno: index + 1,
            id: item['item']['id'],
            item_desc: item['item'].item_name,
            quantity: item['quantity'],
            price: item['price'],
            total_price: item['total_amount'],
          };
          this.GetMycartList.push(obj);
        });
      }
      console.log(this.GetMycartList);
      CUSTOMER_DATA = this.GetMycartList;
      this.MycartTable = new MatTableDataSource(this.GetMycartList);
      setTimeout(() => (this.MycartTable.paginator = this.paginator));
      setTimeout(() => (this.MycartTable.sort = this.sort));
    });
  }
  logout() {
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }
  home() {
    this.router.navigate(['/home']);
  }
  addtocart(item_id: any) {
    let cart_req = {
      item_id: item_id,
      quantity: 1,
    };
    this.Spinner.show();
    this.authenticationService.addToCart(cart_req).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.CommonService.addedcart_items();
        this.ngOnInit();
      }
    });
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
    this.Spinner.show();
    this.authenticationService.updateCartItems(data).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.ngOnInit();
        this.CommonService.addedcart_items();
      }
    });
  }
  product_list() {
    const navigationExtras = {
      queryParams: {
        branchid: this.branch_list.id,
        branch_address: this.branch_list.branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  myAccount() {
    this.router.navigate(['/profile']);
  }
  continue_shopping() {
    // let branch_name = localStorage.getItem('branch_name');
    // let branchaddress = localStorage.getItem('branch_address');
    // let branchid = localStorage.getItem('branch_id');
    const navigationExtras = {
      queryParams: {
        branchid: this.branch_list.id,
        branch_address: this.branch_list.branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  checkout() {
    localStorage.setItem("branch_id",this.branch_list.id)
    this.router.navigate(['checkout']);
    this.CommonService.isShow_checkoutbtn(false);
  }
  wishlist(wish_flag: any, item_id: any) {
    if (wish_flag == 'add') {
      let wishlist_req = {
        item_id: item_id,
      };
      this.Spinner.show();
      this.authenticationService.addToWishlist(wishlist_req).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.ngOnInit();
        }
      });
    } else {
      this.Spinner.show();
      this.authenticationService.deleteToWhishlist(item_id).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.ngOnInit();
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
