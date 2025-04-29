import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, LoginData } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" (keydown.enter)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="loginData.email" 
              required 
              autocomplete="email"
              [attr.aria-invalid]="!isValidEmail && loginData.email ? true : null"
            >
            <small *ngIf="!isValidEmail && loginData.email" class="validation-error">
              Please enter a valid email address
            </small>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="loginData.password" 
              required 
              autocomplete="current-password"
            >
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              [disabled]="isLoading || !loginData.email || !loginData.password || !isValidEmail"
              aria-live="polite"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
        
        <p class="auth-switch">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .auth-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      margin-top: 0;
      color: #758f76;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    input[aria-invalid="true"] {
      border-color: #f44336;
    }
    
    .validation-error {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .form-actions {
      margin-top: 1.5rem;
    }
    
    button {
      background-color: #758f76;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
    }
    
    button:hover {
      background-color: #657a66;
    }
    
    button:disabled {
      background-color: #a5b5a6;
      cursor: not-allowed;
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .auth-switch {
      text-align: center;
      margin-top: 1.5rem;
      margin-bottom: 0;
    }
    
    a {
      color: #758f76;
      text-decoration: none;
      font-weight: 500;
    }
    
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';
  isValidEmail = true;
  
  // Email validation regex
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}
  
  ngOnInit(): void {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // If already logged in, redirect to return URL
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
  
  onSubmit(): void {
    // Validate form
    if (!this.validateForm()) {
      return;
    }
    
    // Set loading state
    this.isLoading = true;
    this.errorMessage = '';
    this.loadingService.show('login', 'Logging in...');
    
    // Attempt to log in
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loadingService.hide('login');
        this.isLoading = false;
        
        // Show success toast
        this.toastService.success('Successfully logged in!');
        
        // Navigate to return URL on success
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.loadingService.hide('login');
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to log in. Please check your credentials and try again.';
        
        // Show error toast
        this.toastService.error(this.errorMessage);
      }
    });
  }
  
  validateForm(): boolean {
    // Reset error message
    this.errorMessage = '';
    
    // Check if fields are filled
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return false;
    }
    
    // Validate email format
    this.isValidEmail = this.emailRegex.test(this.loginData.email);
    if (!this.isValidEmail) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }
    
    return true;
  }
} 