import { NgModule } from '@angular/core';
import { Routes, RouterModule,  } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { ProfileComponent } from './profile.component';
import { AuthGuardService } from '../auth/authentication.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/profile', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], data: { title: marker('profile') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ProfileRoutingModule {}
