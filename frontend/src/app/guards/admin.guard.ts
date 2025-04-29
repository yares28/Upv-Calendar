import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('You must be logged in to access the admin area');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url }
      });
      return false;
    }

    // Get the current user
    const user = this.authService.getCurrentUser();
    
    // For now, implement a simple role check. This should be enhanced later
    // with proper role-based access control from the backend
    if (user && user.email && (
        user.email.endsWith('@upv.es') || 
        user.email.endsWith('@admin.upv.es') ||
        user.email === 'admin@example.com'
      )) {
      return true;
    }
    
    // If not an admin, redirect to home page
    this.toastService.error('You do not have admin privileges');
    this.router.navigate(['/']);
    
    return false;
  }
} 