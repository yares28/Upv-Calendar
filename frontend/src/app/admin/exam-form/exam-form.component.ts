import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../components/index';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LoadingSpinnerComponent],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>{{ isEditMode ? 'Edit Exam' : 'Create New Exam' }}</h1>
        <nav class="admin-nav">
          <a routerLink="/admin">Dashboard</a>
          <a routerLink="/admin/exams">Manage Exams</a>
          <a routerLink="/admin/import">Import Data</a>
          <a routerLink="/">Back to Calendar</a>
        </nav>
      </header>
      
      <main class="admin-content">
        <section class="exam-form-section">
          <div class="loading-placeholder">
            <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
            <p>Exam form functionality is currently being implemented.</p>
            <button class="back-button" (click)="goBack()">Go Back</button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .admin-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1rem;
    }
    
    .admin-header h1 {
      margin-top: 0;
      color: #758f76;
      margin-bottom: 1rem;
    }
    
    .admin-nav {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .admin-nav a {
      text-decoration: none;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .admin-nav a:hover {
      background-color: #f0f0f0;
    }
    
    .admin-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .exam-form-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .loading-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
      color: #666;
      gap: 1rem;
    }
    
    .back-button {
      background-color: #758f76;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .back-button:hover {
      background-color: #657a66;
    }
  `]
})
export class ExamFormComponent implements OnInit {
  isEditMode = false;
  examId?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.examId;
    
    // Show toast indicating functionality is not fully implemented
    this.toastService.info('Exam form functionality is coming soon!');
  }

  goBack(): void {
    this.router.navigate(['/admin/exams']);
  }
} 