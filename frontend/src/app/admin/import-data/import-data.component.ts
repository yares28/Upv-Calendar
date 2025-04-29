import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../components/index';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Import Exam Data</h1>
        <nav class="admin-nav">
          <a routerLink="/admin">Dashboard</a>
          <a routerLink="/admin/exams">Manage Exams</a>
          <a routerLink="/admin/import" class="active">Import Data</a>
          <a routerLink="/">Back to Calendar</a>
        </nav>
      </header>
      
      <main class="admin-content">
        <section class="import-section">
          <h2>Data Import Options</h2>
          
          <div class="import-card">
            <h3>Import from ETSINFexams.txt</h3>
            <p>
              Import exam data from the ETSINFexams.txt file. This will parse the file and
              add new exams to the database or update existing ones.
            </p>
            <button 
              class="import-btn" 
              [disabled]="importLoading" 
              (click)="importFromFile()"
            >
              <span *ngIf="!importLoading">Start Import</span>
              <span *ngIf="importLoading">Importing...</span>
            </button>
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
    
    .admin-nav a.active {
      background-color: #758f76;
      color: white;
    }
    
    .admin-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .import-section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .import-section h2 {
      margin-top: 0;
      color: #333;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.5rem;
    }
    
    .import-card {
      background-color: #f9f9f9;
      border-radius: 6px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .import-card h3 {
      margin-top: 0;
      color: #555;
      margin-bottom: 0.75rem;
    }
    
    .import-card p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .import-btn {
      background-color: #758f76;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 1rem;
    }
    
    .import-btn:hover {
      background-color: #657a66;
    }
    
    .import-btn:disabled {
      background-color: #a5b5a6;
      cursor: not-allowed;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .admin-container {
        padding: 1rem;
      }
    }
  `]
})
export class ImportDataComponent {
  importLoading = false;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) { }

  importFromFile(): void {
    if (this.importLoading) {
      return;
    }
    
    this.importLoading = true;
    this.loadingService.show('importExams', 'Importing exam data...');
    
    this.adminService.importExamData().subscribe({
      next: (result) => {
        this.importLoading = false;
        this.loadingService.hide('importExams');
        
        this.toastService.success(
          `Successfully imported ${result.importedExams} new exams and updated ${result.updatedExams} existing exams.`
        );
      },
      error: (error) => {
        this.importLoading = false;
        this.loadingService.hide('importExams');
        
        this.toastService.error(error.message || 'Failed to import exam data');
      }
    });
  }
} 