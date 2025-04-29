import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // If not logged in, redirect to login page with return URL
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.router.url }
    });
    
    return false;
  }
} 