import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on startup
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }
  
  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
  
  get currentUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
            this.tokenSubject.next(response.token);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ 
            success: false, 
            message: error.error?.message || 'Login failed',
            user: {} as User,
            token: ''
          });
        })
      );
  }

  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { 
      email, 
      password,
      firstName,
      lastName
    }).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Registration failed',
          user: {} as User,
          token: ''
        });
      })
    );
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Update subject values
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }
  
  // For now, we're using a mock implementation but in a real app,
  // this would verify the token with the server
  checkTokenValidity(): Observable<boolean> {
    const token = this.tokenSubject.value;
    // Just check if we have a token for now
    return of(!!token);
  }
} 