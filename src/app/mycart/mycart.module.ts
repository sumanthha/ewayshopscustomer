import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { MycartRoutingModule } from './mycart-routing.module';
import { MycartComponent } from './mycart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    MycartRoutingModule,
    MatPaginatorModule,
    NgxPaginationModule,
  ],
  declarations: [MycartComponent],
})
export class MycartModule {}
