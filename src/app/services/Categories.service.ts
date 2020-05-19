import { Category } from '../models/category.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
 private categories: Category[] = [
   // dummy categories list
    {
      id: 'C1',
      cateTitle: 'brekkie',
      imageUrl:  'assets/categories_img/brekkie.png'
    },
    {
      id: 'C2',
      cateTitle: 'cakes',
      imageUrl:  'assets/categories_img/cakes.png'
    },
    {
      id: 'C3',
      cateTitle: 'cupcakes',
      imageUrl:  'assets/categories_img/cupcake.png'
    },
    {
      id: 'C4',
      cateTitle: 'coockies',
      imageUrl:  'assets/categories_img/cookies.png'
    },
    {
      id: 'C5',
      cateTitle: 'ice cream',
      imageUrl:  'assets/categories_img/ice-cream.png'
    }
  ];

  constructor() { }

  // gets a copy of the categories list
  get allCategories() {
    return [...this.categories];
  }

  // finds the category id to be able to this play its name in different places
  getCategories(id: string) {
     return {...this.categories.find(p => p.id === id)};
  }
}
