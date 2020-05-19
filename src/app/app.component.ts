import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
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
  // function that allows you to log out of the application
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
