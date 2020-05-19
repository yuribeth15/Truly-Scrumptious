import { ReviewsService } from '../../services/reviews.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController, IonItemSliding } from '@ionic/angular';
import { RecipesService } from '../../services/recipes.service';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { Reviews } from '../../models/review.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit, OnDestroy {
  recipes: Recipe;
  loadedReviews: Reviews[];
  // allow me to clear the subscription whenever the page is distroy
  private reviewSub: Subscription;

  constructor(
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private recipeService: RecipesService,
              private reviewService: ReviewsService,
              private modalCtrl: ModalController,
              private loadinCrtl: LoadingController
              ) { }

  ngOnInit() { // if the route cannot find a recipe it will render back to the main page
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recipeId')) {
        this.navCtrl.navigateBack('/home/tabs/home');
        return;
      }
      this.reviewSub = this.recipeService.getRecipes(paramMap.get('recipeId')).subscribe( recipe => {
        this.recipes = recipe;
      });
    });

    this.reviewSub = this.reviewService.allreviews.subscribe(reviews => {
      this.loadedReviews = reviews;
    });

  }
 // opening the modal to show the recipes details
  onCheckRecipe() {
    this.modalCtrl
    .create({
      component: RecipeModalComponent,
      componentProps: {selectedRecipe: this.recipes}})
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  // getting the reviews  to list them on reviews section
  onCheckReviews() {
    this.reviewService.onRetrieveReviews();
  }

  // deliting the reviews from the user interface
 onDelete(reviewId: string, slidingEl: IonItemSliding ) {
   this.loadinCrtl.create({message: 'Deleting...'})
   .then(loadinEl => {
     loadinEl.present();
     slidingEl.close();
     this.reviewService.deleteReview(reviewId);
     loadinEl.dismiss();
     console.log('deleting', reviewId);
       });
  }

  // unsubcribe to the object once the component is distroy
  ngOnDestroy() {
    if (this.reviewSub) {
      this.reviewSub.unsubscribe();
    }
  }
}
