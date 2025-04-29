import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap = new Map<string, boolean>();
  private messageSubject = new BehaviorSubject<string>('');

  constructor() { }

  // Get loading state as observable
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  // Get loading message as observable
  get message$(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  // Show loading with an optional task identifier and message
  show(taskId: string = 'global', message: string = ''): void {
    this.loadingMap.set(taskId, true);
    this.updateLoadingState();
    
    if (message) {
      this.messageSubject.next(message);
    }
  }

  // Hide loading for a specific task
  hide(taskId: string = 'global'): void {
    this.loadingMap.delete(taskId);
    this.updateLoadingState();
    
    // Clear message if no more loading tasks
    if (this.loadingMap.size === 0) {
      this.messageSubject.next('');
    }
  }

  // Check if a specific task is loading
  isLoading(taskId: string = 'global'): boolean {
    return this.loadingMap.has(taskId);
  }

  // Private method to update the loading state based on the map
  private updateLoadingState(): void {
    this.loadingSubject.next(this.loadingMap.size > 0);
  }
} 