import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { ShellComponent } from '@app/shell/shell.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    //{ path: '', component: HomeComponent, data: { title: marker('KFC') } },
  ]),
  {
    path: '',
    component: ShellComponent,
    children: [{ path: 'home', component: HomeComponent, data: { title: marker('Home') } }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
