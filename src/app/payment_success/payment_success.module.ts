import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { PaymentSuccessRoutingModule } from './payment_success-routing.module';
import { PaymentSuccessComponent } from './payment_success.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    PaymentSuccessRoutingModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatExpansionModule,
  ],
  declarations: [PaymentSuccessComponent],
})
export class PaymentSuccessModule {}
