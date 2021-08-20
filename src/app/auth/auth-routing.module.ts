import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { LoginComponent } from './login.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { SignupNextComponent } from '../auth/sign-next/sign-next.component';
import { ForgetResetComponent } from './forget-reset/forget-reset.component';
import { TermsandConditionComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { from } from 'rxjs';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: marker('Login') } },
  { path: 'signup', component: SignUpComponent, data: { title: marker('Signup') } },
  { path: 'auth/signup-next', component: SignupNextComponent, data: { title: marker('Signup') } },
  { path: 'termandconditions', component: TermsandConditionComponent, data: { title: marker('Terms and Conditions') } },
  { path: 'privacy', component: PrivacyComponent, data: { title: marker('Privacy') } },
  { path: 'forgot', component: ForgotpassComponent },
  { path: 'auth/reset-password/:id', component: ForgetResetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
