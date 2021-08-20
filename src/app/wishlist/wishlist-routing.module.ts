import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { WishlistComponent } from './wishlist.component';
import { AuthGuardService } from '../auth/authentication.guard';
// const routes: Routes = [
//   // Module is lazy loaded, see app-routing.module.ts
//   { path: 'manage-branch', component: ManageBranchComponent, data: { title: marker('Abouts') } },
// ];

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/wishlist', pathMatch: 'full' },
    { path: 'wishlist', component: WishlistComponent,canActivate: [AuthGuardService], data: { title: marker('product') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class WishlistRoutingModule {}
