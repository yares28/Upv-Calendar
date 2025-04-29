import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../components/toast-notification/toast-notification.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  private lastId = 0;

  constructor() { }

  // Get all active toasts as an observable
  get toasts$(): Observable<Toast[]> {
    return this.toastSubject.asObservable();
  }

  // Show a success toast
  success(message: string, timeout: number = 5000): void {
    this.add({
      id: ++this.lastId,
      message,
      type: 'success',
      timeout
    });
  }

  // Show an error toast
  error(message: string, timeout: number = 8000): void {
    this.add({
      id: ++this.lastId,
      message,
      type: 'error',
      timeout
    });
  }

  // Show an info toast
  info(message: string, timeout: number = 5000): void {
    this.add({
      id: ++this.lastId,
      message,
      type: 'info',
      timeout
    });
  }

  // Show a warning toast
  warning(message: string, timeout: number = 6000): void {
    this.add({
      id: ++this.lastId,
      message,
      type: 'warning',
      timeout
    });
  }

  // Add a toast to the list
  private add(toast: Toast): void {
    // Add new toast to the array
    this.toasts = [...this.toasts, toast];
    
    // Update the subject
    this.toastSubject.next(this.toasts);
    
    // Remove the toast after it closes
    if (toast.timeout !== undefined && toast.timeout !== 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.timeout + 1000); // Add 1 second buffer for animation
    }
  }

  // Remove a toast by id
  remove(id: number): void {
    // Remove the toast from array
    this.toasts = this.toasts.filter(t => t.id !== id);
    
    // Update the subject
    this.toastSubject.next(this.toasts);
  }

  // Clear all toasts
  clear(): void {
    this.toasts = [];
    this.toastSubject.next(this.toasts);
  }
} 