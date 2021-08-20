// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// export interface RandomQuoteContext {
//   // The quote's category: 'dev', 'explicit'...
//   category: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class WishlistService {
//   constructor(private httpClient: HttpClient, ) { }

//   getWishlList() {
//     let data = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
//     return this.httpClient.get('customer/get_wishlist', { headers }).pipe(
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
