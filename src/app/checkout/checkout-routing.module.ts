import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthGuardService } from '../auth/authentication.guard';
import { CheckoutComponent } from './checkout.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/checkout', pathMatch: 'full' },
    { path: 'checkout', component: CheckoutComponent,canActivate: [AuthGuardService], data: { title: marker('checkout') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CheckoutRoutingModule {}
