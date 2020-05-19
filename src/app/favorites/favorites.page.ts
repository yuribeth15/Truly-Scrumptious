import { Subscription } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  loadedRecipes: Recipe[];

  // allow me to clear the subscription whenever the page is distroy
  private recipeSub: Subscription;

  constructor(
              private recipeService: RecipesService
              ) {}

  // subscribing to my own subject created in the recipe service to get the current list of recipes
  ngOnInit() {
   this.recipeSub = this.recipeService.allRecipes.subscribe( recipes => {
      this.loadedRecipes = recipes;
    });
  }

  // deliting a recipe from the list
  onCancel(recipeId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.recipeService.deleteFavRecipe(recipeId).subscribe(() => {

    });
    console.log('Deleting item', recipeId);
  }

  // whenever the component gets distroy run this methdod
  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }

  }

}
