import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { Injectable } from '@angular/core';
import { take, tap, map, delay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

interface RecipeData {
  category: string;
  description: string;
  title: string;
  utencils: string[];
  ingridients: string[];
  method: string[];
  imageUrl: string;
  prepTime: number;
  bakingTime: number;
  restTime: number;
  level: string;

}


@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  // doesnt necessarily hold any value
  dataLoaded = new Subject<Recipe[]>();

  dataLoadFailed = new Subject<boolean>();

  // acts as special subject so that when I subscribe to this array it will always give me the latest value
  private recipes = new BehaviorSubject<Recipe []>([]);


  constructor(  // injecting the auth services and the http to acces the api
              private authService: AuthService,
              private http: HttpClient
              ) {}

// give my a subscribable object, letiing me subscribe to it from the outside
  get allRecipes() {
    return this.recipes.asObservable();
  }

  // accessing to the api and fetching data
  fetchRecipes(all = true) {
    this.dataLoaded.next(null);
    this.dataLoadFailed.next(false);
    return this.authService.getAuthenticatedUser().getSession((err, session) => {
    const queryParam = '?accessToken=' + session.getAccessToken().getJwtToken();
    const urlParam = 'all';
    return this.http.get <{[key: number]: RecipeData}>(
      'https://k036q5c5a5.execute-api.us-east-1.amazonaws.com/dev2/' + urlParam + queryParam, {
        headers: new HttpHeaders({Authorization: session.getIdToken().getJwtToken()})
      }) // allows me to get only one current objet which is the latest and using map operator to wrap th object which I can then subscribe
      .pipe(
        take(1),
        map(resData => {
          console.log(resData);
          const allrecipes = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              allrecipes.push(
                new Recipe(
                  key,
                  resData[key].category,
                  resData[key].description,
                  resData[key].title,
                  resData[key].utencils,
                  resData[key].ingridients,
                  resData[key].method,
                  resData[key].imageUrl = '../../assets/categories_img/colorCookie.png',
                  resData[key].prepTime,
                  resData[key].bakingTime,
                  resData[key].restTime,
                  resData[key].level
                )
              );
            }
          }
          return allrecipes;
        }),
        // a new event with the recipes I generated in the map
        // operator making sure that all the recipes that subscribed get the latets object
        tap(fetchedRecipes => {
          this.recipes.next(fetchedRecipes);
        })
      );
   });
  }

  // accessing a single recipe
  getRecipes(id: string) {
    return  this.allRecipes.pipe(
      take(1),
      map( allRecipes => {
        return  {...allRecipes.find(p => p.id === id)};
      })
    );
 }


 // removing a favorite recipe from the list
 deleteFavRecipe(recipeId: string) {
  return this.allRecipes.pipe(
    take(1),
    delay(1000),
    tap(favrecipe => {
      this.recipes.next(favrecipe.filter(f => f.id !== recipeId));
    })
  );

 }



}
