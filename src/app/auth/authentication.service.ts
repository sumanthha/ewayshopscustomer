import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, public router: Router) {}
  api_url = `${ENV.serverUrl}`;
  public getToken(): any {
    return localStorage.getItem('access');
  }
  public refreshToken(): any {
    localStorage.getItem('refresh');
  }
  public isAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  login(payload: any) {
    let url = this.api_url + 'login/';
    return this.http.post<Response[]>(`${url}`, payload);
  }
  getStoreList(payload: any) {
    let url = this.api_url + 'customer/storelist';
    return this.http.post<Response[]>(`${url}`, payload);
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/home');
  }
  GetProfile() {
    let url = this.api_url + 'customer/customer_profile';
    return this.http.get<Response[]>(`${url}`);
  }

  UpdateProfile(req: any) {
    let url = this.api_url + 'customer/customer_profile/update';
    return this.http.put<Response[]>(`${url}`, req);
  }
  reset_Password(reset_req: any) {
    let url = this.api_url + 'customer/reset_password';
    return this.http.post<Response[]>(`${url}`, reset_req);
  }
  forgot_Password(email: any) {
    let data = {
      email: email,
    };
    let url = this.api_url + 'customer/forget_password/';
    return this.http.post<Response[]>(`${url}`, data);
  }
  getItemList(item_req: any) {
    if (this.isAuthenticated()) {
      let url = this.api_url + 'customer/itemlist';
      return this.http.post<Response[]>(`${url}`, item_req);
    } else {
      let url = this.api_url + 'customer/itemlist';
      return this.http.post<Response[]>(`${url}`, item_req);
    }
  }
  get_branch_item_list(category_list:any)
  {
    let url = this.api_url + 'customer/get_branch_item_list';
    return this.http.post<Response[]>(`${url}`, category_list);
  }
  addToCart(cart_req: any) {
    let url = this.api_url + 'customer/add_cart';
    return this.http.post<Response[]>(`${url}`, cart_req);
  }
  addToWishlist(wishlist_req: any) {
    let url = this.api_url + 'customer/add_wishlist';
    return this.http.post<Response[]>(`${url}`, wishlist_req);
  }
  deleteToWhishlist(store_id: any) {
    let url = this.api_url + 'customer/remove_wishlist';
    //return this.http.delete<Response[]>(`${url}`, store_id);
    return this.http.request('delete', url, { body: store_id });
  }
  getStoreListcart(id: any) {
    let url = this.api_url + 'customer/single_storelist/'+id;
    return this.http.get<Response[]>(`${url}`);
  }
  checkout(cart_req: any) {
    let url = this.api_url + 'customer/checkout';
    return this.http.post<Response[]>(`${url}`, cart_req);
  }
  PayonDelivery_payment(payment_req: any,) {
    let url = this.api_url + 'customer/payment_option';
    return this.http.put<Response[]>(`${url}`, payment_req);
  }
  getMyCartList() {
    let url = this.api_url + 'customer/view_cart';
    return this.http.get<Response[]>(`${url}`);
  }
  
  getMyOrdersList() {
    let url = this.api_url + 'customer/order_status_history';
    return this.http.get<Response[]>(`${url}`);
  }
  getSingleOrderList(payload: any) {
    
    let url = this.api_url + 'customer/order/';
    // return this.http.request('get', url, { body: payload });
    return this.http.post<Response[]>(`${url}`, payload);
  }
  UpdateorderFeedback(payload: any) {
    let url = this.api_url + 'customer/report-order/';
    return this.http.post<Response[]>(`${url}`, payload);
  }

  viewCartItems() {
    let url = this.api_url + 'customer/view_cart';
    return this.http.get<Response[]>(`${url}`);
  }
  clearCartItems() {
    let url = this.api_url + 'customer/delete_cart';
    return this.http.delete<Response[]>(`${url}`);
  }
  updateCartItems(cart_req: any) {
    let url = this.api_url + 'customer/update_cart';
    return this.http.put<Response[]>(`${url}`, cart_req);
  }

  GetNotification() {
    let url = this.api_url + 'store/notification_get/';
    return this.http.get<Response[]>(`${url}`);
  }
  GetNotificationCount() {
    let url = this.api_url + 'customer/notification_count';
    return this.http.get<Response[]>(`${url}`);
  }

  DeleteNotification(data: any) {
    let token = this.getToken();
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      body: {
        data,
      },
    };
    return this.http.delete('store/notification_delete/', options).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }
  paypalCaptureOrder(paypalCaputure_response: any) {
    let url = this.api_url + 'customer/payment_capture';
    return this.http.post<Response[]>(`${url}`, paypalCaputure_response);
  }
  getWishlList() {
    let url = this.api_url + 'customer/get_wishlist';
    return this.http.get<Response[]>(`${url}`);
  }
  getNotificationList() {
    let url = this.api_url + 'customer/get_notification';
    return this.http.get<Response[]>(`${url}`);
  }
}
