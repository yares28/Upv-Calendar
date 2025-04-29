import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CalendarFilters {
  degrees?: string[];
  semesters?: number[];
  subjects?: string[];
}

export interface SavedCalendar {
  id: number;
  userId: number;
  name: string;
  description?: string;
  filters: CalendarFilters;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = environment.apiUrl + '/auth/calendars';

  constructor(
    private http: HttpClient
  ) {}

  // Get all saved calendars for the current user
  getUserCalendars(): Observable<SavedCalendar[]> {
    // The API will get the user from the authentication token
    return this.http.get<SavedCalendar[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching calendars:', error);
          return throwError(() => new Error('Failed to load calendars. Please try again.'));
        })
      );
  }

  // Get a specific calendar by ID
  getCalendar(id: number): Observable<SavedCalendar> {
    // The API will get the user from the authentication token
    return this.http.get<SavedCalendar>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching calendar ${id}:`, error);
          return throwError(() => new Error('Failed to load calendar. Please try again.'));
        })
      );
  }

  // Save a new calendar
  saveCalendar(name: string, description: string, filters: CalendarFilters): Observable<SavedCalendar> {
    return this.http.post<SavedCalendar>(this.apiUrl, {
      name,
      description,
      filters
    }).pipe(
      catchError(error => {
        console.error('Error saving calendar:', error);
        return throwError(() => new Error('Failed to save calendar. Please try again.'));
      })
    );
  }

  // Delete a calendar
  deleteCalendar(id: number): Observable<SavedCalendar[]> {
    return this.http.delete<SavedCalendar[]>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting calendar ${id}:`, error);
          return throwError(() => new Error('Failed to delete calendar. Please try again.'));
        })
      );
  }
} 