import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { FqaRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
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
    FqaRoutingModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatExpansionModule,
  ],
  declarations: [FaqComponent],
})
export class FaqModule {}
