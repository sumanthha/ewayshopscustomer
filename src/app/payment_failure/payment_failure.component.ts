import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentFailureService } from './payment_failure.service';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
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
  templateUrl: './payment_failure.component.html',
  styleUrls: ['./payment_failure.component.scss'],
})
export class PaymentFailureComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
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
  ) {}

  ngOnInit(): void {
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
    this.Payment_failure(this.orderid, this.payerid);
  }
  continue_shopping() {
    this.router.navigate(['/home']);
  }
  Payment_failure(orderid: any, payerid: any) {
    this.order_key = localStorage.getItem('Order_id');
    let paypalCaputure_response = {
      order_token: orderid,
      payer_id: payerid,
      order_key: this.order_key,
    };
    console.log(paypalCaputure_response, 'paypalCaputure_response');
    this.Spinner.show();
    this.authenticationService.paypalCaptureOrder(paypalCaputure_response).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.payment_status = response['data'].payment_status;
        this.payment_date = response['data'].payment_date;
        this.transaction_id = response['data'].payment_id;
        this.total_amount = response['data'].amount;
        this.payer_name = response['data'].payer_name;
        this.email_address = response['data'].email_address;
      }
      this.CommonService.update_cartbadge(0);
    });
  }
  logout() {
    localStorage.clear();
    localStorage.clear();
    this.CommonService.updateIdentity('', '');
    this.authenticationService.logout();
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
