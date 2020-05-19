import { Subscription, BehaviorSubject } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipes.service';
import { CategoriesService } from '../services/Categories.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../models/category.model';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {
  // variables holding the models
  categories: Category[];
  loadedRecipes: Recipe[];
  dataEdited = new BehaviorSubject<boolean>(false);
  dataIsLoading = new BehaviorSubject<boolean>(false);
  // allow me to clear the subscription whenever the page is distroy
  recipeSub: Subscription;

  constructor(private categoryService: CategoriesService,
              private recipeService: RecipesService) { }

  // first method that will be shown once the page loads
  // subscribing to the recipes obserbable
  ngOnInit() {
    this.categories = this.categoryService.allCategories;
    this.recipeSub = this.recipeService.allRecipes.subscribe(recipes => {
    this.loadedRecipes = recipes;
  });

  }
// here once the view becomes active it will show the fetched recipes from the API
  ionViewWillEnter() {
    this.dataIsLoading.next(true);
    this.recipeService.fetchRecipes().subscribe(() => {
      this.dataIsLoading.next(false);
    });
  }

  // whenever the component gets distroy run this methdod
  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }
}
