import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExamStats {
  totalExams: number;
  totalSubjects: number;
  totalDegrees: number;
  lastUpdated: string;
}

export interface ImportResult {
  importedExams: number;
  updatedExams: number;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  // Get exam statistics
  getExamStats(): Observable<ExamStats> {
    return this.http.get<ExamStats>(`${this.apiUrl}/stats`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to fetch exam statistics'));
        })
      );
  }

  // Manually trigger exam data import
  importExamData(): Observable<ImportResult> {
    return this.http.post<ImportResult>(`${this.apiUrl}/import-exams`, {})
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to import exam data'));
        })
      );
  }

  // Delete an exam by ID
  deleteExam(examId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/exams/${examId}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to delete exam'));
        })
      );
  }

  // Edit an exam
  updateExam(examId: string, examData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/exams/${examId}`, examData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to update exam'));
        })
      );
  }

  // Create a new exam
  createExam(examData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exams`, examData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Failed to create exam'));
        })
      );
  }
} 