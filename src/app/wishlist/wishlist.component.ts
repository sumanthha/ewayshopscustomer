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
export interface ManageCustoData {
  sno: any;
  product_name: any;
  product_id: any;
  category: string;
  sku: any;
}
let ELEMENT_DATA: ManageCustoData[] = [];

@Component({
  selector: 'app-manage-orders',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
  displayedColumns: string[] = [
    'sno',
    'imageUrl',
    'product_code',
    'product_name',
    'Product_category',
    'Product_sku',
    'action',
  ];
  dataSource = new MatTableDataSource<ManageCustoData>(ELEMENT_DATA);
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
  getWishlist: any = [];
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
    this.authenticationService.getWishlList().subscribe((response) => {
      if (response['status'] == 'ok') {
        this.getWishlist = [];
        response['data'].forEach((store: any, index: any) => {
          let obj = {
            sno: index + 1,
            id: store['store']['id'],
            branch_code: store['store'].branch_code,
            branch_name: store['store'].branch_name,
            branch_email: store['store'].branch_email,
            zipcode: store['store'].zipcode,
            branch_phone: store['store'].branch_phone,
            branch_description: store['store'].branch_description,
            branch_address: store['store'].branch_address,
            wishlist: store['store'].wishlist,
            photo: store['store'].photo,
          };
          this.getWishlist.push(obj);
        });
      }
    });
  }
 

  wishlist(wish_flag: any, store_id: any) {
    if (this.authenticationService.isAuthenticated()) {
      // let temp_ids: any;
      // temp_ids = this.CredentialsService.getCustomerId();
      if (wish_flag == 'add') {
        let wishlist_req = {
          store_id: store_id,
        };

        this.authenticationService.addToWishlist(wishlist_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.ngOnInit();
          }
        });
      } else {
        let wishlist_req = {
          store_id,
       };
        this.authenticationService.deleteToWhishlist(wishlist_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.ngOnInit();
          }
        });
      }
    } else {
      this.router.navigate(['login']);
    }
  }
  logout() {
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }
  myAccount() {
    this.router.navigate(['/profile']);
  }
  shop_now(branch_id: any, branch_address: any, branch_name: any) {
    localStorage.setItem('branch_name', branch_name);
    localStorage.setItem('branch_address', branch_address);
    const navigationExtras = {
      queryParams: {
        branchid: branch_id,
        branch_address: branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
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
