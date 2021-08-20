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
import { MatExpansionModule } from '@angular/material/expansion';
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
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
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
  }
  myAccount() {
    this.router.navigate(['/profile']);
  }
  logout() {
    localStorage.clear();
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }
}
