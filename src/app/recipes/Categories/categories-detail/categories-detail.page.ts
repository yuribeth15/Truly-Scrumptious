import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Category } from '../../../models/category.model';
import { CategoriesService } from '../../../services/Categories.service';
import { RecipesService } from '../../../services/recipes.service';
import { Recipe } from '../../../models/recipe.model';


@Component({
  selector: 'app-categories-detail',
  templateUrl: './categories-detail.page.html',
  styleUrls: ['./categories-detail.page.scss'],
})
export class CategoriesDetailPage implements OnInit, OnDestroy {
  category: Category;
  loadedRecipes: Recipe[];
  // allow me to clear the subscription whenever the page is distroy
  private recipeSub: Subscription;

  constructor(
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private categoryService: CategoriesService,
              private recipeService: RecipesService
              ) {}

  ngOnInit() {
    // if not the routhe dont have an category id to go to it will go back to the manin page
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('categoryId')) {
        this.navCtrl.navigateBack('/home/tabs/home');
        return;
      }
      this.category = this.categoryService.getCategories(paramMap.get('categoryId'));
    });
    // subscribing to my own subject to get the current list of recipes
    this.recipeSub = this.recipeService.allRecipes.subscribe( recipes => {
      this.loadedRecipes = recipes;
    });
  }

  // whenever the component gets distroy run this methdod
  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }

}
