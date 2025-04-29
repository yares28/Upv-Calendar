import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable, of } from 'rxjs';
import { AuthService, TokenResponse } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// This flag helps prevent multiple refresh requests when multiple HTTP requests fail simultaneously
let isRefreshing = false;
let refreshSubscriber: Observable<any> | null = null;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token for authentication requests
  if (req.url.includes(`${environment.apiUrl}/auth/login`) || 
      req.url.includes(`${environment.apiUrl}/auth/register`)) {
    return next(req);
  }

  // Get token from auth service
  const token = authService.getToken();

  // If token exists, add it to the request headers
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pass the modified request to the next handler
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle token expiration (401 Unauthorized)
      if (error.status === 401 && token) {
        return handleTokenExpiration(req, next, authService, router);
      }
      
      // Handle 403 Forbidden responses
      if (error.status === 403) {
        // If the user doesn't have permission, redirect to home page
        router.navigate(['/']);
      }
      
      return throwError(() => error);
    })
  );
};

/**
 * Handle token expiration by refreshing the token if possible
 */
function handleTokenExpiration(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<any> {
  // If we're not already refreshing
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubscriber = null;
    
    // User object must still be in localStorage even if token expired
    const user = authService.getCurrentUser();
    
    if (!user) {
      // If no user info, just logout and redirect to login
      isRefreshing = false;
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Authentication required'));
    }
    
    // Try to refresh the token 
    return authService.refreshToken().pipe(
      switchMap((refreshResult: TokenResponse) => {
        isRefreshing = false;
        
        // Retry the failed request with the new token
        const newRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshResult.token}`
          }
        });
        
        return next(newRequest);
      }),
      catchError(error => {
        isRefreshing = false;
        
        // If refresh token fails, log the user out
        authService.logout();
        router.navigate(['/login']);
        
        return throwError(() => error);
      })
    );
  } else {
    // If we're already refreshing, wait for the refresh to complete and retry
    return refreshSubscriber || throwError(() => new Error('Authentication required'));
  }
} 