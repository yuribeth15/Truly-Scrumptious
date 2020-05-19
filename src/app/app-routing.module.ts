import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module')
    .then( m => m.AuthPageModule)
  },
  { path: 'home', loadChildren: () => import('./home/home.module')
    .then( m => m.HomePageModule),
  canLoad: [AuthGuard]
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module')
    .then( m => m.RecipesPageModule),
   canLoad: [AuthGuard]
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module')
    .then( m => m.FavoritesPageModule),
   canLoad: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module')
    .then( m => m.ProfilePageModule),
   canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
