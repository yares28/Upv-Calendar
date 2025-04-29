import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="spinner-container" 
      [class.overlay]="overlay" 
      [class.inline]="!overlay"
      [style.--spinner-size]="size + 'px'"
      [style.--spinner-color]="color"
    >
      <div class="spinner"></div>
      <div *ngIf="message" class="spinner-message">{{ message }}</div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
    
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9998;
    }
    
    .inline {
      padding: 1rem;
    }
    
    .spinner {
      width: var(--spinner-size, 40px);
      height: var(--spinner-size, 40px);
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--spinner-color, #758f76);
      animation: spin 1s ease-in-out infinite;
    }
    
    .spinner-message {
      color: #333;
      font-size: 1rem;
      text-align: center;
      max-width: 80%;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Ensure accessibility - hide spinner from screen readers but keeps it visually */
    .spinner:not(:focus):not(:active) {
      position: relative;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      width: var(--spinner-size, 40px);
      height: var(--spinner-size, 40px);
      overflow: hidden;
      white-space: nowrap;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() overlay: boolean = true;
  @Input() size: number = 40;
  @Input() color: string = '#758f76'; // Primary color
  @Input() message: string = '';
} 