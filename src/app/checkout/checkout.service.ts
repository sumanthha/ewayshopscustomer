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
// export class CheckoutService {
//   constructor(private httpClient: HttpClient, ) { }

//   getStoreList(id: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.get('customer/single_storelist/' + id, { headers }).pipe(
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
//   checkout(cart_req: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.post('/customer/checkout', cart_req, { headers }).pipe(
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
//   PayonDelivery_payment(payment_req: any, id: string) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.put('customer/payment_option/' + id, payment_req, { headers }).pipe(
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
