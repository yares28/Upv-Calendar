import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="registerData.name" 
              required
              autocomplete="name"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="registerData.email" 
              required
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="registerData.password" 
              required
              minlength="6"
              autocomplete="new-password"
            >
            <small>Password must be at least 6 characters long</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              [(ngModel)]="confirmPassword" 
              required
              autocomplete="new-password"
            >
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="isLoading">
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </div>
        </form>
        
        <p class="auth-switch">
          Already have an account? <a routerLink="/login">Login</a>
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
    
    small {
      display: block;
      margin-top: 0.25rem;
      color: #666;
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
export class RegisterComponent {
  registerData: RegisterData = {
    name: '',
    email: '',
    password: ''
  };
  
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';
    
    // Validate form
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    // Set loading state
    this.isLoading = true;
    
    // Attempt to register
    this.authService.register(this.registerData).subscribe({
      next: () => {
        // Navigate to home page on success
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again later.';
      }
    });
  }
} 