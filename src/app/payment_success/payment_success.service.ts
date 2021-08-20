// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// import { AnyAaaaRecord } from 'dns';

// export interface RandomQuoteContext {
//   // The quote's category: 'dev', 'explicit'...
//   category: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class PaymentSuccessService {
//   constructor(private httpClient: HttpClient, ) { }

//   paypalCaptureOrder(paypalCaputure_response: any) {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.post('customer/payment_capture', paypalCaputure_response, { headers }).pipe(
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
