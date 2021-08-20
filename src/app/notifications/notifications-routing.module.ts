import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { NotificationComponent } from './notifications.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/notification', pathMatch: 'full' },
    { path: 'notification', component: NotificationComponent, data: { title: marker('discount') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class NotificationRoutingModule {}
