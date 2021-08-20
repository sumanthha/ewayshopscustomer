import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule, AuthenticationService } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { ContactUsModule } from './contact_us/contact_us.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { MyordersModule } from './myorders/myorders.module';
import { MycartModule } from './mycart/mycart.module';
import { PaymentSuccessModule } from './payment_success/payment_success.module';
import { PaymentFailureModule } from './payment_failure/payment_failure.module';
import { ProductListModule } from './product_list/product_list.module';
import { CheckoutModule } from './checkout/checkout.module';
import { NotificationModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';
import { AgmCoreModule } from '@agm/core';
import { CommonService } from '../../src/app/common/common.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { FaqModule } from './faq/faq.module';
import { ToastrModule } from 'ngx-toastr';
import { AvatarModule } from 'ngx-avatar';
import { HttpInterceptorBaseAuthService } from './auth/token.interceptor';
import { AuthGuardService as AuthGuard } from '../app/auth/authentication.guard';
@NgModule({
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    NgxSpinnerModule,
    ShellModule,
    HomeModule,
    ContactUsModule,
    WishlistModule,
    PaymentSuccessModule,
    PaymentFailureModule,
    FaqModule,
    MyordersModule,
    MycartModule,
    NotificationModule,
    ProductListModule,
    CheckoutModule,
    ProfileModule,
    AuthModule,
    AppRoutingModule,
    MatDatepickerModule,
    AvatarModule,
    AgmCoreModule.forRoot({
      // apiKey: 'GOOGLE API KEY',
      // libraries: ['places']
    }),
    MatInputModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [
    AuthenticationService,
    CommonService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorBaseAuthService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
