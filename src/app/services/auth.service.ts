import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AlertController } from '@ionic/angular';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js';


// conecting to cognito user pool
const POOL_DATA = {
  UserPoolId: 'us-east-1_9weagYekk',
  ClientId: '4ors18cub5kt8t5mtsc2dmcit9'
};
// holding the cognito user pool into a variable
const userPool = new CognitoUserPool(POOL_DATA);

export interface AuthResponse {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // variables
  userIsAuthenticated = false;
  // acts as special subject so that when I subscribe to this array it will always give me the latest value
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);

  // dont give any value back
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;
  userName: CognitoUserAttribute;

  constructor( // components injected into this page
              private router: Router,
              private alertCtrl: AlertController
              ) {}

  // getting the autenticated user
  get userIsAutenticated() {
    return this.userIsAuthenticated;
  }

  // extracting the user name from cognito
  getUserName() {
    this.userName.getName();
   }

   // sign up proccess passing data to cognito
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username,
      email,
      password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username, user.password, attrList, null, (err, result) => {
      if (err) {
        console.log(err);
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        this.showAlert(err.message || JSON.stringify(err));
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registeredUser = result.user;
    });
    return;
  }

// confirming the user name and the confirmation code
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitUser = new CognitoUser(userData);
    cognitUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }

      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });
  }

login(username: string, password: string) {
  this.authIsLoading.next(true);
  const authData = {
    Username: username,
    Password: password
  };
  const authDetails = new AuthenticationDetails(authData);
  const userData = {
    Username: username,
    Pool: userPool
  };
  const cognitoUser = new CognitoUser(userData);
  // binding this to another const so I can use it onSuccess method
  const that = this;
  // autenticating users having two method onSucces and onFailure
  cognitoUser.authenticateUser(authDetails, {
    onSuccess(result: CognitoUserSession) {
      that.authStatusChanged.next(true);
      that.authDidFail.next(false);
      that.authIsLoading.next(false);
      console.log(result);
    },
    onFailure(err) {
      that.authDidFail.next(true);
      that.authIsLoading.next(false);
      that.showAlert(err.message || JSON.stringify(err));
      console.log(err);
    }
  });
  this.authStatusChanged.next(true); // if the session status change it will navigate the user to the main page
  return;
}

// getting the current user from cognito pool
getAuthenticatedUser() {
  return userPool.getCurrentUser();
}

// loging out changing the current user status
logout() {
  this.getAuthenticatedUser().signOut();
  this.authStatusChanged.next(false);
}

// creating an observable for the autenticated user emiting next events if there is a user session or not
isAuthenticated(): Observable<boolean> {
  const user = this.getAuthenticatedUser();
  // tslint:disable-next-line: deprecation
  const obs = Observable.create((observer) => {
    if (!user) {
      observer.next(false);
    } else {
      user.getSession((err, session) => {
        if (err) {
          observer.next(false);
        } else {
          if (session.isValid()) {
            observer.next(true);
          } else {
            observer.next(false);
          }
        }
      });
    }
    observer.complete();
  });
  return obs;
}

// subscribing to the observable and getting the latest session
initAuth() {
  this.isAuthenticated().subscribe(
    (auth) => this.authStatusChanged.next(auth)
  );
}

// Error alert

 showAlert(message: string) {
  this.alertCtrl
  .create({
    header: 'Athentication failed',
    message,
    buttons: ['Okay']
  })
  .then(alertEl => alertEl.present());
}
}
