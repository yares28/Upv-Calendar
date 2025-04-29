import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Exam {
  id: number;
  subject: string;
  degree: string;
  semester: number;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  professor?: string;
  notes?: string;
  createdAt: Date;
}

export interface FilterOptions {
  degrees: string[];
  semesters: number[];
  subjects: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = environment.apiUrl + '/exams';
  
  constructor(private http: HttpClient) {}
  
  // Get all exams (with optional filters)
  getExams(filters?: {
    degree?: string;
    semester?: number;
    subject?: string;
    startDate?: Date;
    endDate?: Date;
  }): Observable<Exam[]> {
    let params = new HttpParams();
    
    // Add filters to params if they exist
    if (filters) {
      if (filters.degree) params = params.append('degree', filters.degree);
      if (filters.semester) params = params.append('semester', filters.semester.toString());
      if (filters.subject) params = params.append('subject', filters.subject);
      if (filters.startDate) params = params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.append('endDate', filters.endDate.toISOString());
    }
    
    return this.http.get<Exam[]>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Failed to fetch exams:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch exams'));
        })
      );
  }
  
  // Get exam by ID
  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to fetch exam ${id}:`, error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch exam'));
        })
      );
  }
  
  // Get filter options (degrees, semesters, subjects)
  getFilterOptions(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(`${this.apiUrl}/filters`)
      .pipe(
        catchError(error => {
          console.error('Failed to fetch filter options:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch filter options'));
        })
      );
  }
  
  // Admin functions (these would be protected by auth guard in a real app)
  
  // Create exam
  createExam(examData: Omit<Exam, 'id' | 'createdAt'>): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, examData)
      .pipe(
        catchError(error => {
          console.error('Failed to create exam:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to create exam'));
        })
      );
  }
  
  // Update exam
  updateExam(id: number, examData: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData)
      .pipe(
        catchError(error => {
          console.error(`Failed to update exam ${id}:`, error);
          return throwError(() => new Error(error.error?.message || 'Failed to update exam'));
        })
      );
  }
  
  // Delete exam
  deleteExam(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to delete exam ${id}:`, error);
          return throwError(() => new Error(error.error?.message || 'Failed to delete exam'));
        })
      );
  }
} 