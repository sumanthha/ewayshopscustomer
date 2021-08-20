import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CommonService {
  profilePic = new BehaviorSubject('');
  pic = localStorage.getItem('profilePic');
  namei = localStorage.getItem('profileName');
  name = new BehaviorSubject('');
  count = new BehaviorSubject('');
  storelist = new BehaviorSubject('');
  addcart_items = new BehaviorSubject<string>('');
  current_lat = new BehaviorSubject('');
  current_long = new BehaviorSubject('');
  branch_name = new BehaviorSubject('');
  zipcode = new BehaviorSubject('');
  checkout_button = new BehaviorSubject('');
  cart_badge = new BehaviorSubject('');
  notify_badge = new BehaviorSubject('');
  public uploadOrderKey=new BehaviorSubject('');
  Notify_count = this.count.asObservable();
  Store_data = this.storelist.asObservable();
  viewcart_items = this.addcart_items.asObservable();
  branchname = this.branch_name.asObservable();
  zipcode_resp = this.zipcode.asObservable();
  isShow_checkout = this.checkout_button.asObservable();
  cart_count = this.cart_badge.asObservable();

  // getcurrent_location=this.currentlocation.asObservable();
  constructor() {
    this.updateIdentity(this.pic, this.namei);
  }
  updateIdentity(pic: any, name: any) {
    this.profilePic.next(pic);
    this.name.next(name);
    // also set the identity in localStorage;
  }
  notification_count(count: any) {
    this.count.next(count);
  }
  Store_list(storelist: any) {
    this.storelist.next(storelist);
  }
  addedcart_items() {
    this.addcart_items.next('0');
  }
  get_Currentlocation(lat: any, long: any) {
    this.current_long.next(long);
    this.current_lat.next(lat);
  }
  getbranchname(name: any) {
    this.branch_name.next(name);
  }
  getzipcode(zipcode: any) {
    this.zipcode.next(zipcode);
  }
  isShow_checkoutbtn(flag: any) {
    this.checkout_button.next(flag);
  }
  update_cartbadge(count: any) {
    this.cart_badge.next(count);
  }

  public setOrderkey_paypal(value:any)
  {
    this.uploadOrderKey.next(value);
  }
  public getOrderkey_paypal()
  {
    return this.uploadOrderKey.asObservable();
  }
}
