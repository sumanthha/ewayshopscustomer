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
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightSpanKind } from 'typescript';
import { map, catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { AuthenticationService } from '@app/auth';
import { animate, state, style, transition, trigger } from '@angular/animations';
export interface MycartData {
  sno: any;
  product_name: any;
  product_id: any;
  category: string;
  sku: any;
}
export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let CUSTOMER_DATA: MycartData[] = [];

@Component({
  selector: 'app-manage-orders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyordersComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
  displayedColumns = ['sno', 'order', 'order_date', 'shop_name', 'price', 'pickup_time', 'status','action'];
  dataSource: MatTableDataSource<Element>;
  // displayedColumns: string[] = ['sno','item_desc','quantity','price','total'];
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
  feedback:any;
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
  MycartTable: MatTableDataSource<unknown>;
  getmyOrdersList: any = [];
  expandedElement: any;
  itemname: any = [];
  display: any = 'none';
  display1: any = 'none';
  seperate_orderStatus: any;
  seperate_orderId: any;
  singleorder_resp: any;
  showfeedback: boolean=true;
  order_id: any;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private Spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private CommonService: CommonService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.branch_address = localStorage.getItem('branch_address');
    this.branch_name = localStorage.getItem('branch_name');
    this.branch_id = localStorage.getItem('branch_id');
    this.Spinner.show();
    this.authenticationService.getMyOrdersList().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.itemname = [];

        response['data'].forEach((order: any, index: any) => {
          order['orderlist'].forEach((element: any) => {
            this.itemname.push(element.item.item_name);
          });
          let obj = {
            sno: index + 1,
            order_id: order['order_id'],
            order_date: order['order_date'],
            price: order['amount'],
            order_status: order['order_status'],
            prefer_pickuptime: order['customer_from_date'],
            prefer_start_time: order['customer_start_time'],
            prefer_end_time: order['customer_end_time'],
            order_name: this.itemname,
            customer_name: order['customerlist'][0]['first_name'],
            shop_name:order['shop_name'],
            // feedback:order['order_report_feedback'][0]['feedback']
          };

          this.getmyOrdersList.push(obj);
        });
        console.log(this.getmyOrdersList, 'getmyOrdersList');
      }
      CUSTOMER_DATA = this.getmyOrdersList;
      this.MycartTable = new MatTableDataSource(this.getmyOrdersList);
      setTimeout(() => (this.MycartTable.paginator = this.paginator));
      setTimeout(() => (this.MycartTable.sort = this.sort));
    });
  }

  logout() {
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
  }
  myAccount() {
    this.router.navigate(['/profile']);
  }
  modalOpen(order_status: any, order_id: any) {
    this.seperate_orderStatus = order_status;
    this.seperate_orderId = order_id;
    this.Spinner.show();
    let data = {
      order_id: order_id,
    };
    this.authenticationService.getSingleOrderList(data).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.singleorder_resp = response['data'];
      }
    });
    this.display = 'block';
  }

  modalOpen_feedback(order_id:any) {
    this.order_id=order_id
    this.display1 = 'block';
  }
  order_feedback()
  {
    if(this.feedback ==undefined)
    {
        this.showfeedback=false;
        return false;
    }
    else
    {
      this.showfeedback=true;
    }
    let feedback=
    {
        "order_id":this.order_id,
        "feedback":this.feedback
    }
    this.authenticationService.UpdateorderFeedback(feedback).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.display1='none';
        this.toastr.info('Order feedback updated successfully');
        this.feedback=""
        this.ngOnInit();
       // this.singleorder_resp = response['data'];
      }
    });
  }
  modalClose() {
    this.display = 'none';
    this.display1 = 'none';
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
