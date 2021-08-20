import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AuthenticationService } from '@app/auth';
export interface ManageCustomerData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
}
let CUSTOMER_DATA: ManageCustomerData[] = [];

@Component({
  selector: 'app-managebranch',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationComponent implements OnInit {
  displayedColumns = ['id', 'product_id', 'product_name', 'price', 'product_catey', 'sku', 'stock', 'discount'];
  dataSource = new MatTableDataSource<ManageCustomerData>(CUSTOMER_DATA);
  CustTable: MatTableDataSource<any>;
  GetNotification: any = [];
  display: any = 'none';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  NotificationTable: any;
  code: any;
  price: any;
  name: any;
  discount: any;
  showupdate: boolean = false;
  selected_orderid: any;
  constructor(
    private NotificationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private Spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.selected_orderid = [];
    this.Spinner.show();
    this.NotificationService.GetNotification().subscribe((response) => {
      this.Spinner.hide();
      this.GetNotification = [];
      if (response['status'] == 'ok') {
        response['data'].forEach((notify: any, index: any) => {
          let obj = {
            sno: index + 1,
            title: notify['title'],
            desc: notify['description'],
            order_id: notify['order_id'],
            created_on: notify['created_on'],
            id: notify['id'],
          };
          this.GetNotification.push(obj);
        });
      }
      CUSTOMER_DATA = this.GetNotification;
      this.NotificationTable = new MatTableDataSource(this.GetNotification);
      setTimeout(() => (this.NotificationTable.paginator = this.paginator));
      setTimeout(() => (this.NotificationTable.sort = this.sort));
    });
  }
  searchUser(filterValue: string) {
    this.NotificationTable.filter = filterValue.trim().toLowerCase();
    if (this.NotificationTable.paginator) {
      this.NotificationTable.paginator.firstPage();
    }
  }
  onCheckboxChange(event: any, order_id: any) {
    if (event.target.checked) {
      this.selected_orderid.push(order_id);
    } else {
      let index = this.selected_orderid.indexOf(order_id);
      this.selected_orderid.splice(index, 1);
    }
  }
  delete_btn() {
    let data = {
      delete_id: this.selected_orderid,
    };
    this.Spinner.show();
    this.NotificationService.DeleteNotification(data).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        Swal.fire('Success', ' Order Deleted Successfully', 'success');
        this.ngOnInit();
      }
    });
  }
}
