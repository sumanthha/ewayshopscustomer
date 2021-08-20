import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import * as S3 from 'aws-sdk/clients/s3';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightSpanKind } from 'typescript';
import { map, catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { AuthenticationService } from '@app/auth';
import { Observable, combineLatest, of } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';
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
  templateUrl: './payment_success.component.html',
  styleUrls: ['./payment_success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {
  files: any[];
  submitted = false;
  //Form Fields
  Getproduct_resp: any[];
  branch_address: any;
  branch_id: any;
  branch_name: any;
  //Form Validation objects
  MycartTable: MatTableDataSource<unknown>;
  orderid: any;
  payerid: any;
  order_key: string;
  payment_status: any;
  payment_date: any;
  transaction_id: any;
  total_amount: any;
  payer_name: any;
  email_address: any;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private Spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private CommonService: CommonService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.CommonService.getOrderkey_paypal().subscribe(data=>
      {
        console.log(data,"orderkey")
          if(data !='')
          {
              console.log(data,"orderkeysss")
          }
      })
  }

  ngOnInit(): void {
    setTimeout(() => this.Spinner.show(), 5000);
    this.CommonService.update_cartbadge(0);
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map((results) => ({
          params: results[0],
          query: results[1],
        }))
      )
      .subscribe((results) => {
        this.orderid = results.query.token;
        this.payerid = results.query.PayerID;
      });
   
      
      
    // this.Payment_success(this.orderid, this.payerid);
    this.order_key = sessionStorage.getItem('order_id');

    let paypalCaputure_response = {
      order_token: this.orderid,
      payer_id: this.payerid,
      order_key: this.order_key,
    };
    setTimeout(() => this.Spinner.hide(), 5000);
    
    setTimeout(() => this.Spinner.show(), 2500);
    this.authenticationService.paypalCaptureOrder(paypalCaputure_response).subscribe((response) => {
    this.Spinner.hide();
    this.Spinner.show();
      if (response['status'] == 'ok') {
        setTimeout(() => this.Spinner.hide(), 2500);
       
        this.payment_status = response['data'].payment_status;
        this.payment_date = response['data'].payment_date;
        this.transaction_id = response['data'].payment_id;
        this.total_amount = response['data'].amount;
        this.payer_name = response['data'].payer_name;
        this.email_address = response['data'].email_address;
      }
      else
      {
        this.Spinner.hide();
      }
      this.CommonService.update_cartbadge(0);
    });
   
  }
  continue_shopping() {
    this.router.navigate(['/home']);
  }
  myorder() {
    this.router.navigate(['/myorders']);
  }
  Payment_success(orderid: any, payerid: any) {
    //this.order_key = localStorage.getItem('Order_id');
   
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
