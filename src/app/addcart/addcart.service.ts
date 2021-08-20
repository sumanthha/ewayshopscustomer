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
// export class AddcartService {
//   constructor(private httpClient: HttpClient, ) { }

//   viewCartItems() {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.get('customer/view_cart', { headers }).pipe(
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
//   clearCartItems() {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.delete('customer/delete_cart', { headers }).pipe(
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
//   updateCartItems(cart_req: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.put('customer/update_cart', cart_req, { headers }).pipe(
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
