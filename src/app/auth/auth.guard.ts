import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
              private authService: AuthService,
              private router: Router
              ) {}

  // angular route guard to prevent unauthenticated users using the canLoad
  // for lazy loading routes
  canLoad(
    route: Route,
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
      const isAutenticated = this.authService.isAuthenticated();
      if (!isAutenticated) {
        this.router.navigateByUrl('/');
      } else {
        return isAutenticated;
      }
  }
}
