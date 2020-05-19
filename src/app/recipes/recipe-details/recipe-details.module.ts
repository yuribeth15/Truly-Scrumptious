import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailsPageRoutingModule } from './recipe-details-routing.module';

import { RecipeDetailsPage } from './recipe-details.page';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { ImgPickerComponent} from './img-picker/img-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecipeDetailsPageRoutingModule
  ],
  declarations: [RecipeDetailsPage, ImgPickerComponent, RecipeModalComponent],
  exports: [ImgPickerComponent],
  entryComponents: [RecipeModalComponent]
})
export class RecipeDetailsPageModule {}
