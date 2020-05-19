import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesDetailPage } from './categories-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesDetailPageRoutingModule {}
