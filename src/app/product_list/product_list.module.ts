import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { ProductListRoutingModule } from './product_list-routing.module';
import { ProductListComponent } from './product_list.component';
import { AddcartModule } from './../addcart/addcart.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    ReactiveFormsModule,
    NgxPaginationModule,
    AddcartModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ProductListRoutingModule,
    MatCarouselModule.forRoot(),
  ],
  declarations: [ProductListComponent],
})
export class ProductListModule {}
