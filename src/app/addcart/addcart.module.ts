import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AddcartComponent } from './../addcart/addcart.component';
// import { NouisliderModule } from 'ng2-nouislider';
// import { NgxStarsModule } from 'ngx-stars';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    // NouisliderModule,
    // NgxStarsModule,
    TranslateModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,
  ],
  declarations: [AddcartComponent],
  exports: [AddcartComponent],
})
export class AddcartModule {}
