import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileDragNDropDirective } from '../common/file-drag-n-drop.directive';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AvatarModule } from 'ngx-avatar';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    WishlistRoutingModule,
    MatPaginatorModule,
    NgxPaginationModule,
    AvatarModule,
  ],
  declarations: [WishlistComponent, FileDragNDropDirective],
})
export class WishlistModule {}
