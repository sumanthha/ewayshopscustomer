import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  // GetProfile() {
  //   let data = this.CredentialsService.getToken();
  //   var header = {
  //     headers: new HttpHeaders().set('Authorization', 'Bearer ' + data),
  //   };
  //   //let myItem = this.CredentialsService.getCustomerId();
  //   return this.httpClient.get('customer/customer_profile', header).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }

  // UpdateProfile(req: any) {
  //   let data = this.CredentialsService.getToken();
  //   Headers;
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
  //   return this.httpClient.put('customer/customer_profile/update', req, { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
}
