// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// export interface RandomQuoteContext {
//   category: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {
//   constructor(private httpClient: HttpClient, ) { }

//   GetNotification() {
//     let token = this.CredentialsService.getToken();
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
//     return this.httpClient.get('store/notification_get/', { headers }).pipe(
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

//   DeleteNotification(data: any) {
//     let token = this.CredentialsService.getToken();
//     const options = {
//       headers: new HttpHeaders({
//         Authorization: 'Bearer ' + token,
//       }),
//       body: {
//         data,
//       },
//     };

//     //let token = this.CredentialsService.getToken();
//     // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
//     return this.httpClient.delete('store/notification_delete/', options).pipe(
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

//   // GetNotificationCount() {
//   //   let token = this.CredentialsService.getToken();
//   //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
//   //   return this.httpClient.get('store/notification_count/', { headers }).pipe(
//   //     map((body: any) => {
//   //       if (body) {
//   //         return body;
//   //       } else {
//   //         return {};
//   //       }
//   //     }),
//   //     catchError(() => of([]))
//   //   );
//   // }
// }
