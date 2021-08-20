import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
//import { LoginService } from 'app/main/page/login/login.service';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorBaseAuthService implements HttpInterceptor {
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(private basicAuthenticationService: AuthenticationService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let basicAuthHeaderString = this.basicAuthenticationService.getToken();
    let username = this.basicAuthenticationService.isAuthenticated();
    let newReq = request.clone();
    if (basicAuthHeaderString) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + basicAuthHeaderString,
          'Content-Type': 'application/json',
          // 'Api-Token' : '3c58773cd224860cd286736fdf0eea952d83bcc1',
        },
      });
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.tokenSubject.next(null);
              return this.basicAuthenticationService.refreshToken().subscribe(
                (result: any) => {
                  let accessToken = result['access'];
                  if (accessToken) {
                    this.tokenSubject.next(accessToken);
                    localStorage.setItem('access', accessToken);
                    newReq.headers.set('Authorization', 'Bearer ' + accessToken);
                    return next.handle(newReq);
                  }
                },
                (error: any) => {
                  localStorage.clear();
                  //   this.router.navigate(['/auth/login'])
                }
              );

              // redirect to the login route
              // or show a modal
            }
          }
        }
      )
    );
  }
  addToken(request: any, accessToken: any) {
    console.log('req', request);
    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    });
  }
}
