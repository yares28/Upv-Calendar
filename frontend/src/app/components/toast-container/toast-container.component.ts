import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Toast, ToastNotificationComponent } from '../toast-notification/toast-notification.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastNotificationComponent],
  template: `
    <div class="toast-notification-container">
      <app-toast-notification
        *ngFor="let toast of toasts"
        [id]="toast.id"
        [message]="toast.message"
        [type]="toast.type"
        [timeout]="toast.timeout || 5000"
        (click)="removeToast(toast.id)"
      ></app-toast-notification>
    </div>
  `,
  styles: [`
    .toast-notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .toast-notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        align-items: center;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    // Subscribe to toast notifications
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
} 