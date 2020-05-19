import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { PopupConfirmComponent } from './popup-confirm/popup-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage, PopupConfirmComponent],
  entryComponents: [PopupConfirmComponent]
})
export class AuthPageModule {}
