import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { AddcartModule } from './../addcart/addcart.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    FormsModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    NgxPaginationModule,
    AddcartModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    CheckoutRoutingModule,
    MatCarouselModule.forRoot(),
  ],
  declarations: [CheckoutComponent],
})
export class CheckoutModule {}
