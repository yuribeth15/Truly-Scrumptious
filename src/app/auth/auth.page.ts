
import { AuthService } from '../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, PopoverController } from '@ionic/angular';
import { SegmentChangeEventDetail} from '@ionic/core';
import { NgForm } from '@angular/forms';
import { PopupConfirmComponent } from './popup-confirm/popup-confirm.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // getting access to elements of the html template form
  @ViewChild ('form', { static: false }) form: NgForm;
  // variables
  confirmUser = false;
  didFail = false;
  isLoading = false;
  isLonginOpen = true;

  constructor( // injecting services and components need it to work with functions that this services has
              private authService: AuthService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private popoverController: PopoverController,
              ) {}

  // ngOnInit will be always executed once the page is loaded showing the latest information on the array object
  ngOnInit() {
    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = this.isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );

  }

  // chaging the toolbar name to sing up or log in
  onChange(event: CustomEvent<SegmentChangeEventDetail>) {
    this.isLonginOpen = !this.isLonginOpen;
    console.log(event.detail);
  }

  // function that acheck the value of the form and if correct it will sign up a new user
  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const userName = this.form.value.user;
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.signUp(userName, email, password);
    this.form.reset();
  }

  // openning the pop up confirmation step
  openPopUp() {
    if (!this.confirmUser) {
      this.popoverController.create({
        component: PopupConfirmComponent
      }).then ( popEl => {
        popEl.present();
      }).catch(err => {
        console.log(err);
        return false;
      });
    }
  }

  // checking for the right user details to log in
  // adding a loading event for any slow time sign in
  // to let the user know it is taking a minutw to process
  onLogin() {
    this.isLoading = true;
    const userName = this.form.value.username;
    const password = this.form.value.password;
    if (!this.confirmUser ) {
      this.loadingCtrl.create({
        keyboardClose: true, message: 'logging in...'})
        .then(loadingEl => {
          loadingEl.present();
          this.authService.login(userName, password);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/home/tabs/home');
        }).catch(err => {
          console.log(err);
          return false;
        });
    }
  }


}
