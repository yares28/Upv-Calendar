import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface SavedCalendar {
  id: number;
  user_id: number;
  name: string;
  degrees: string[];
  semesters: string[];
  subjects: string[];
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'http://localhost:3000/api/calendars';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all saved calendars for the current user
  getUserCalendars(): Observable<SavedCalendar[]> {
    const userId = this.authService.currentUserId;
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<SavedCalendar[]>(`${this.apiUrl}?userId=${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching calendars:', error);
          return throwError(() => new Error('Failed to load calendars. Please try again.'));
        })
      );
  }

  // Get a specific calendar by ID
  getCalendar(id: number): Observable<SavedCalendar> {
    const userId = this.authService.currentUserId;
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<SavedCalendar>(`${this.apiUrl}/${id}?userId=${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching calendar ${id}:`, error);
          return throwError(() => new Error('Failed to load calendar. Please try again.'));
        })
      );
  }

  // Save a new calendar
  saveCalendar(name: string, degrees: string[], semesters: string[], subjects: string[]): Observable<SavedCalendar> {
    const userId = this.authService.currentUserId;
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.post<SavedCalendar>(this.apiUrl, {
      userId,
      name,
      degrees,
      semesters,
      subjects
    }).pipe(
      catchError(error => {
        console.error('Error saving calendar:', error);
        return throwError(() => new Error('Failed to save calendar. Please try again.'));
      })
    );
  }

  // Delete a calendar
  deleteCalendar(id: number): Observable<any> {
    const userId = this.authService.currentUserId;
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.delete(`${this.apiUrl}/${id}?userId=${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting calendar ${id}:`, error);
          return throwError(() => new Error('Failed to delete calendar. Please try again.'));
        })
      );
  }
} 