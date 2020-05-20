import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Reviews } from '../models/review.model';

import { BehaviorSubject, Subject, concat } from 'rxjs';
import { map, take, tap, switchMap} from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { CognitoUser } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  // getting access to the elements type on the html template
  @ViewChild('reviewForm', { static: false }) form: NgForm;

  // acts as special subject so that when I subscribe to it always give back the latest  emitted value
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  // it does return a value checking for failure
  dataLoaded = new Subject<Reviews[]>();
  dataLoadFailed = new Subject<boolean>();
  userData: Reviews;
  userAttribute: CognitoUser;

  // dummy user review as default
private review = new BehaviorSubject< Reviews[]>(
  [
    new Reviews(
      'user name',
      'this is my first review',
      'https://img-truly-scrumptious.s3.amazonaws.com/frutyCookie.png'
    )
  ]
);

// injecting the auth services and the http client to access to the api
constructor( private authService: AuthService,
             private http: HttpClient
             ) {}

// returns a subscribable oject to be accessible form the outsite
get allreviews() {
return this.review.asObservable();
}

// returns the user name
get userName() {
return this.userAttribute.getUsername();
}

//  adding  a new review to the recipes details page with this attributes
  onAddReview(userId = this.userName, description: string, img: string ) {
    const newReview = new Reviews(
      userId,
      description,
      img
    );
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);
    // posting new revie to the database
    this.authService.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        return;
      }
      this.http.post('https://k036q5c5a5.execute-api.us-east-1.amazonaws.com/dev2/recipes/reviews', newReview, {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()})
      })
      // it looks over my review subject and subcribe to it
      // only with one object in mind and after cancel the subscription
      // so that it gets the current updated list of reviews
      .pipe(
        take(1),
        switchMap(resData => {
          console.log(resData);
          return this.allreviews;
        }),
        take(1),
        // here I used the local variable review to add a newReview to the list of reviews
        // and with the help of next it gives me a new updated array list
        tap(review => {
          this.review.next(review.concat(newReview));
        })
      )
        .subscribe(
          (result) => {
            this.dataLoadFailed.next(false);
            this.dataIsLoading.next(false);
            this.dataEdited.next(true);
            console.log(result);
          },
          (error) => {
            this.dataLoadFailed.next(true);
            this.dataIsLoading.next(true);
            this.dataEdited.next(false);
            console.log(error);
          },
        );
      });
  }

  // retriving the data from the database getting all reviews
  onRetrieveReviews(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    this.authService.getAuthenticatedUser().getSession((err, session) => {
    const queryParam = '?accessToken=' + session.getAccessToken().getJwtToken();
    let urlParam = 'all';
    if (!all) {
        urlParam = 'single';
      }
    this.http.get('https://k036q5c5a5.execute-api.us-east-1.amazonaws.com/dev2/recipes/reviews/' + urlParam + queryParam, {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()})
      })
      .pipe(
        take(1),
        map(
        (response: Response) => response.json()
      ))
        .subscribe( // after wrapping the object into an observable I can subscribe here to that object
          (data) => {
            if (all) {
              this.dataLoaded.next();
            } else {
              console.log(data);
              if (!data) {
                this.dataLoadFailed.next(true);
                return;
              }
              this.userData = data[0];
              this.dataEdited.next(true);
            }
          },
          (error) => {
            console.log(error);
            this.dataLoadFailed.next(true);
            this.dataLoaded.next(null);
          }
        );
    });
  }

// deleting the object from the database with the help of the operator pipe, taje, switmap,tap
  deleteReview(userId: string) {
    this.dataLoadFailed.next(false);
    return this.authService.getAuthenticatedUser().getSession((err, session) => {
      this.http.delete('https://k036q5c5a5.execute-api.us-east-1.amazonaws.com/dev2/recipes/reviews/', {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()})
      })
      .pipe(
        take(1),
        switchMap(resData => {
          console.log(resData);
          return this.allreviews;
        }),
        take(1),
        // here I emit a new event filtering the user id for a review to be deleted
        tap(delReview => {
          this.review.next(delReview.filter(f => f.userId !== userId));
        })
      )
      .subscribe(
        (result) => {
         this.dataLoadFailed.next(false);
         this.dataIsLoading.next(false);
         this.dataEdited.next(true);
         console.log(result);
       },
       (error) => {
         this.dataIsLoading.next(false);
         this.dataLoadFailed.next(true);
         this.dataEdited.next(false);
         console.log(error);
          }
        );
    });
  }
}
