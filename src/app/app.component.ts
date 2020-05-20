import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  isAuthenticated = false;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      Plugins.SplashScreen.hide();
    }
    });
  }
  // I reached out to the auth services where I subscribe to the is authenticated field
  // so that whenever is false will return my back to the registration page
   ngOnInit() {
    this.authSub  =  this.authService.authStatusChanged.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
        if (authenticated) {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/');
      }
    }
    );
    this.authService.initAuth();

  }
  // function that allows you to log out of the application
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
