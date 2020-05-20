import { ReviewsService } from '../../../services/reviews.service';
import { Recipe } from '../../../models/recipe.model';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalController, LoadingController} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CognitoUser } from 'amazon-cognito-identity-js';


// an utility function that convert a dataurl string  to a file
function dataUrltoBlob(dataUrl, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(dataUrl);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent implements OnInit {
  // decorator that bound into a DOM property in the HTML template
 @Input() selectedRecipe: Recipe;
 // check for the validation of the parent template of the ng form
 @ViewChild('reviewForm', { static: false }) form: NgForm;

 // variables
 selectedImage: string;
 isLoading = false;
 couldNotLoadData = false;
 userAttribute: CognitoUser;

  constructor(
               private modalCtrl: ModalController,
               private reviewService: ReviewsService,
               private loaderController: LoadingController,
               ) { }

               // subscribing if data is loading show the loaded reviews
               // otherwise if isn't found show an error
  ngOnInit() {
    this.reviewService.dataIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.reviewService.dataLoadFailed.subscribe(
      (didFail: boolean) => {
        this.couldNotLoadData = didFail;
        this.isLoading = false;
      }
    );

  }

  // execute either the camera function or upload the image from file
  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile =
        dataUrltoBlob(imageData.replace('data:image/jpeg;dataUrl,', ''),
        'image/jpeg');

      } catch (error) {
        console.log(error);
        return;
      }

    } else {
      imageFile = imageData;
    }
    this.form.setValue({ image: imageFile});

  }

  onCreateReview() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);
    this.loaderController.create({
      message: 'Posting Review..'
    }). then(loadindEl => {
      loadindEl.present();
      this.reviewService.onAddReview(
        null,
        this.form.value.description,
        // this.form.value.img
        'assets/categories_img/cupcake.png'
      );
      loadindEl.dismiss();
      this.form.reset();
      this.modalCtrl.dismiss({
          Message: 'review saved'
        });
    });
  }

  // review modal to be cancel if desire
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }


}

