import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { NotificationRoutingModule } from './notifications-routing.module';
import { NotificationComponent } from './notifications.component';

@NgModule({
  imports: [FormsModule, CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, NotificationRoutingModule],
  declarations: [NotificationComponent],
})
export class NotificationModule {}
