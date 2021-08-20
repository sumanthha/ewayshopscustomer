import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignupNextComponent } from './sign-next/sign-next.component';
import { ForgetResetComponent } from './forget-reset/forget-reset.component';
import { TermsandConditionComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    I18nModule,
    AuthRoutingModule,
  ],
  declarations: [
    LoginComponent,
    SignUpComponent,
    SignupNextComponent,
    ForgetResetComponent,
    TermsandConditionComponent,
    PrivacyComponent,
    ForgotpassComponent,
  ],
})
export class AuthModule {}
