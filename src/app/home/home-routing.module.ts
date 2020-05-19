import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from '../home/home.page';

// main navigation between tabs are here
const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
        {
          path: 'home',
          children: [
            {
              path: '',
              loadChildren: () => import('../recipes/recipes.module')
              .then( m => m.RecipesPageModule)
            },
           {
              path: 'categories/:categoryId',
              loadChildren: () => import('../recipes/Categories/categories-detail/categories-detail.module')
              .then( m => m.CategoriesDetailPageModule)
          },
          {
              path: ':recipeId',
              loadChildren: () => import('../recipes/recipe-details/recipe-details.module')
              .then( m => m.RecipeDetailsPageModule)
          }
          ]
        },
        {
          path: 'favorites',
          children: [
            {
              path: '',
              loadChildren: () =>
                import('../favorites/favorites.module').then(m => m.FavoritesPageModule)
            },
            {
              path: 'recipes/:recipeId',
              loadChildren: () => import('../recipes/recipe-details/recipe-details.module')
              .then( m => m.RecipeDetailsPageModule)
          }
          ]
        },
        {
          path: 'info',
          children: [
            {
              path: '',
              loadChildren: () =>
                import('../information/information.module').then(m => m.InformationPageModule)
            }
          ]

        },
        {
          path: 'profile',
          children: [
            {
              path: '',
              loadChildren: () =>
                import('../profile/profile.module').then(m => m.ProfilePageModule)
            }
          ]
        },
        {
          path: '',
          redirectTo: '/home/tabs/home',
          pathMatch: 'full'
        }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
