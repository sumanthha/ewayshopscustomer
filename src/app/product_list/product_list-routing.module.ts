import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthGuardService } from '../auth/authentication.guard';
import { ProductListComponent } from './product_list.component';
import { Shell } from '@app/shell/shell.service';
import { ShellComponent } from '@app/shell/shell.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/product-list', pathMatch: 'full' },
    //{ path: 'product-list', component: ProductListComponent, data: { title: marker('productlist') } },
  ]),
  {
    path: '',
    component: ShellComponent,
    children: [{ path: 'product-list', component: ProductListComponent, data: { title: marker('productlist') } }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ProductListRoutingModule {}
