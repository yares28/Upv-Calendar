import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SavedCalendar, CalendarFilters } from './calendar.service';

export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  calendars?: SavedCalendar[];
  savedCalendars?: SavedCalendar[];
}

export interface TokenResponse {
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }
  
  // Get current user ID
  get currentUserId(): number | null {
    return this.userSubject.value?.id || null;
  }
  
  // Load user from localStorage on service initialization
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }
  
  // Register new user
  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(user => {
          this.storeUserData(user);
        }),
        catchError(error => {
          console.error('Registration failed:', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }
  
  // Login user
  login(loginData: LoginData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(user => {
          this.storeUserData(user);
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }
  
  // Store user data in localStorage and update BehaviorSubject
  private storeUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
  
  // Logout user
  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  // Get current user
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
  
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
  
  // Get token
  getToken(): string | null {
    return this.userSubject.value?.token || null;
  }
  
  // Get user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          // Update user data with latest from server but keep the token
          if (this.userSubject.value) {
            const token = this.userSubject.value.token;
            const updatedUser = { ...user, token };
            this.storeUserData(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Failed to get user profile:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to get user profile'));
        })
      );
  }
  
  // Refresh token
  refreshToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh-token`, {})
      .pipe(
        tap(response => {
          // Update token in stored user
          const currentUser = this.userSubject.value;
          if (currentUser) {
            const updatedUser = { ...currentUser, token: response.token };
            this.storeUserData(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Token refresh failed:', error);
          return throwError(() => new Error(error.error?.message || 'Token refresh failed'));
        })
      );
  }
  
  // Save calendar
  saveCalendar(calendar: { name: string, filters: any }): Observable<SavedCalendar[]> {
    return this.http.post<SavedCalendar[]>(`${this.apiUrl}/calendar`, calendar)
      .pipe(
        tap(calendars => {
          // Update the user's saved calendars in local storage
          const user = this.userSubject.value;
          if (user) {
            user.calendars = calendars;
            user.savedCalendars = calendars;
            this.storeUserData(user);
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to save calendar'));
        })
      );
  }
  
  // Delete calendar
  deleteCalendar(calendarId: string): Observable<SavedCalendar[]> {
    return this.http.delete<SavedCalendar[]>(`${this.apiUrl}/calendar/${calendarId}`)
      .pipe(
        tap(calendars => {
          // Update the user's saved calendars in local storage
          const user = this.userSubject.value;
          if (user) {
            user.savedCalendars = calendars;
            user.calendars = calendars;
            this.storeUserData(user);
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to delete calendar'));
        })
      );
  }
} 