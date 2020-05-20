import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss'],
})
export class PopupConfirmComponent implements OnInit {
  confirmUser = false;
  constructor(
              public popoverController: PopoverController,
              private authService: AuthService
              ) {}

  ngOnInit() {}

  // confirming the value of the form checking to confirm the email of the user
  onConfirm(formValue: { username: string, validation: string}) {
    this.authService.confirmUser(formValue.username, formValue.validation);
    this.popoverController.dismiss();
  }

}
