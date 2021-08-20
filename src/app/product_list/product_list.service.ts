// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// const routes = {
//   quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
// };

// export interface RandomQuoteContext {
//   // The quote's category: 'dev', 'explicit'...
//   category: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductListService {
//   constructor(private httpClient: HttpClient) {}

//   getItemList(item_req: any) {
//     if (this.CredentialsService.isAuthenticated()) {
//       let temp_ids: any;
//       temp_ids = this.CredentialsService.getCustomerId();
//       let data = this.CredentialsService.getToken();
//       const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//       return this.httpClient.post('customer/itemlist', item_req, { headers }).pipe(
//         map((body: any) => {
//           if (body) {
//             return body;
//           } else {
//             return {};
//           }
//         }),
//         catchError(() => of([]))
//       );
//     } else {
//       return this.httpClient.post('customer/itemlist', item_req).pipe(
//         map((body: any) => {
//           if (body) {
//             return body;
//           } else {
//             return {};
//           }
//         }),
//         catchError(() => of([]))
//       );
//     }
//   }
//   addToCart(cart_req: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.post('customer/add_cart', cart_req, { headers }).pipe(
//       map((body: any) => {
//         if (body) {
//           return body;
//         } else {
//           return {};
//         }
//       }),
//       catchError(() => of([]))
//     );
//   }
//   addToWishlist(wishlist_req: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.post('customer/add_wishlist', wishlist_req, { headers }).pipe(
//       map((body: any) => {
//         if (body) {
//           return body;
//         } else {
//           return {};
//         }
//       }),
//       catchError(() => of([]))
//     );
//   }
//   deleteToWhishlist(store_id: any) {
//     let token = this.CredentialsService.getToken();

//     const options = {
//       headers: new HttpHeaders({
//         Authorization: 'Bearer ' + token,
//       }),
//       body: {
//         store_id,
//       },
//     };
//     return this.httpClient.delete('customer/remove_wishlist', options).pipe(
//       map((body: any) => {
//         if (body) {
//           return body;
//         } else {
//           return {};
//         }
//       }),
//       catchError(() => of([]))
//     );
//   }
// }
