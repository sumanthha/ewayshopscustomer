import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { PaymentFailureComponent } from './payment_failure.component';

// const routes: Routes = [
//   // Module is lazy loaded, see app-routing.module.ts
//   { path: 'manage-branch', component: ManageBranchComponent, data: { title: marker('Abouts') } },
// ];

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/payment_failure', pathMatch: 'full' },
    { path: 'payment_failure', component: PaymentFailureComponent, data: { title: marker('product') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PaymentSuccessRoutingModule {}
