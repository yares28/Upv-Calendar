import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="visible"
      [@toastAnimation]="animationState" 
      class="toast-container" 
      [ngClass]="'toast-' + type"
      (click)="closeToast()"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <svg *ngIf="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg *ngIf="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg *ngIf="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <svg *ngIf="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="toast-message">{{ message }}</div>
        <div class="toast-close" (click)="closeToast($event)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
      <div class="toast-progress" [style.width.%]="progressWidth"></div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: relative;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      cursor: pointer;
      max-width: 350px;
      min-width: 250px;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .toast-icon {
      flex-shrink: 0;
    }
    
    .toast-message {
      flex-grow: 1;
    }
    
    .toast-close {
      flex-shrink: 0;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
    
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.5);
      transition: width 0.3s linear;
    }
    
    .toast-success {
      background-color: #4caf50;
      color: white;
    }
    
    .toast-error {
      background-color: #f44336;
      color: white;
    }
    
    .toast-info {
      background-color: #2196f3;
      color: white;
    }
    
    .toast-warning {
      background-color: #ff9800;
      color: white;
    }
  `],
  animations: [
    trigger('toastAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('removed', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition('hidden => visible', animate('200ms ease-out')),
      transition('visible => removed', animate('300ms ease-in'))
    ])
  ]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  @Input() id!: number;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() timeout: number = 5000; // Default 5 seconds

  visible = true;
  animationState: 'hidden' | 'visible' | 'removed' = 'hidden';
  progressWidth = 100;
  private intervalId: any;

  constructor() { }

  ngOnInit(): void {
    // Set animation state to visible
    setTimeout(() => {
      this.animationState = 'visible';
    }, 10);

    // Start progress bar countdown
    this.startTimeout();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  startTimeout(): void {
    if (this.timeout > 0) {
      const decrementAmount = 1000 / this.timeout * 100;
      this.intervalId = setInterval(() => {
        this.progressWidth -= decrementAmount;
        if (this.progressWidth <= 0) {
          this.closeToast();
        }
      }, 100);
    }
  }

  clearTimeout(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  closeToast(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    this.animationState = 'removed';
    this.clearTimeout();
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      this.visible = false;
    }, 300);
  }
} 