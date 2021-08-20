import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactUsService } from './contact_us.service';
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
  templateUrl: './contact_us.component.html',
  styleUrls: ['./contact_us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
  GetProduct: any;
  ProdTable: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  files: any[];
  submitted = false;
  //Form Fields
  Getproduct_resp: any[];
  branch_address: any;
  branch_id: any;
  branch_name: any;
  //Form Validation objects
  MycartTable: MatTableDataSource<unknown>;
  constructor(
    private FaqService: ContactUsService,
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
