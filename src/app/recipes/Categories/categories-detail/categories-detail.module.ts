import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesDetailPageRoutingModule } from './categories-detail-routing.module';

import { CategoriesDetailPage } from './categories-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesDetailPageRoutingModule
  ],
  declarations: [CategoriesDetailPage]
})
export class CategoriesDetailPageModule {}
