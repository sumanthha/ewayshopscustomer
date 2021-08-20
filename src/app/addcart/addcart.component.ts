import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '.././common/common.service';
import { AuthenticationService } from '@app/auth';
@Component({
  selector: 'app-addcart',
  templateUrl: './addcart.component.html',
  styleUrls: ['./addcart.component.scss'],
})
export class AddcartComponent implements OnInit {
  View_items: any;
  cartshow: boolean = false;
  store_pickup: any;
  storepickup: any = 'yes';
  quantity: any;
  total_cal: any;
  isShow_checkbtn: any;
  branch_list: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private AddcartService: AuthenticationService,
    private CommonService: CommonService,
    private toastr: ToastrService
  ) {
    this.CommonService.isShow_checkout.subscribe((resp) => (this.isShow_checkbtn = resp));
    this.CommonService.viewcart_items.subscribe(() => {
      this.spinner.show();
      if (this.AddcartService.isAuthenticated()) {
        this.AddcartService.viewCartItems().subscribe((response) => {
          this.spinner.hide();
          if (response['status'] == 'ok') {
            if (response['data']['data'].length == 0) {
              this.cartshow = false;
            } else {
              this.View_items = response['data']['data'];
              this.branch_list = response['data']['branchlist'][0];
              this.total_cal = response['data'];
              this.cartshow = true;
              this.ngOnInit();
            }
          }
        });
      }
    });
  }

  checkout() {
    this.router.navigate(['checkout']);
    this.CommonService.isShow_checkoutbtn(false);
  }
  continue_shopping() {
    let branch_name = localStorage.getItem('branch_name');
    let branchaddress = localStorage.getItem('branch_address');
    let branchid = localStorage.getItem('branch_id');
    const navigationExtras = {
      queryParams: {
        branchid: this.branch_list.id,
        branch_address: this.branch_list.branch_address,
      },
    };
    this.router.navigate(['/product-list'], navigationExtras);
  }
  ngOnInit() {
    this.spinner.show();
    if (this.AddcartService.isAuthenticated()) {
      this.AddcartService.viewCartItems().subscribe((response) => {
        this.spinner.hide();
        if (response['status'] == 'ok') {
          if (response['data']['data'].length == 0) {
            this.cartshow = false;
          } else {
            this.View_items = response['data']['data'];
            this.total_cal = response['data'];
            this.cartshow = true;
          }
        }
      });
    }
  }
  clearCart_items() {
    this.spinner.show();
    this.AddcartService.clearCartItems().subscribe((response) => {
      this.spinner.hide();
      if (response['status'] == 'ok') {
        this.CommonService.update_cartbadge(0);
        this.View_items = response['data'];
        this.CommonService.addedcart_items();
        this.toastr.info('All Item removed from cart');
        this.ngOnInit();
      }
    });
  }
  home() {
    this.router.navigate(['/home']);
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
      this.quantity = quan - 1;
      data = {
        quantity: quan - 1,
        item_id: li,
      };
    }
    if (this.AddcartService.isAuthenticated()) {
      // let temp_ids: any;
      // temp_ids = this.CredentialsService.getCustomerId();
      this.spinner.show();
      this.AddcartService.updateCartItems(data).subscribe((response) => {
        this.spinner.hide();
        if (response['status'] == 'ok') {
          if (this.quantity > 0) {
            this.toastr.info(this.quantity + '+' + name, 'Item updated to cart');
          } else {
            this.toastr.info(name, 'Item removed from cart');
          }
          this.CommonService.update_cartbadge(0);
          this.CommonService.addedcart_items();
          this.ngOnInit();
        }
      });
    } else {
      this.router.navigate(['login']);
    }
  }
  delete_item(item_id: any, name: any) {
    let delete_item = {
      quantity: 0,
      item_id: item_id,
    };
    this.spinner.show();
    this.AddcartService.updateCartItems(delete_item).subscribe((response) => {
      this.spinner.hide();
      if (response['status'] == 'ok') {
        this.CommonService.update_cartbadge(0);
        this.toastr.info(name, ' Item removed from cart');
        this.CommonService.addedcart_items();
        this.ngOnInit();
      }
    });
  }
}
