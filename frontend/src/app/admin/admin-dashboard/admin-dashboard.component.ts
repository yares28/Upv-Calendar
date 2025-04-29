import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, ExamStats } from '../../services/admin.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { LoadingSpinnerComponent } from '../../components/index';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Admin Dashboard</h1>
        <nav class="admin-nav">
          <a routerLink="/admin" class="active">Dashboard</a>
          <a routerLink="/admin/exams">Manage Exams</a>
          <a routerLink="/admin/import">Import Data</a>
          <a routerLink="/">Back to Calendar</a>
        </nav>
      </header>
      
      <main class="admin-content">
        <section class="dashboard-stats">
          <h2>Exam Statistics</h2>
          
          <div *ngIf="loading" class="stats-loading">
            <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
          </div>
          
          <div *ngIf="!loading" class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ stats?.totalExams || 0 }}</div>
              <div class="stat-label">Total Exams</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats?.totalSubjects || 0 }}</div>
              <div class="stat-label">Total Subjects</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats?.totalDegrees || 0 }}</div>
              <div class="stat-label">Total Degrees</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">
                {{ stats && stats.lastUpdated ? (stats.lastUpdated | date:'mediumDate') : 'Never' }}
              </div>
              <div class="stat-label">Last Updated</div>
            </div>
          </div>
        </section>
        
        <section class="dashboard-actions">
          <h2>Quick Actions</h2>
          
          <div class="actions-grid">
            <button 
              (click)="importExamData()" 
              [disabled]="importLoading" 
              class="action-btn import-btn"
            >
              <span *ngIf="!importLoading">Import Exam Data</span>
              <span *ngIf="importLoading">Importing...</span>
            </button>
            
            <a routerLink="/admin/exams/new" class="action-btn create-btn">
              Create New Exam
            </a>
            
            <a routerLink="/admin/exams" class="action-btn manage-btn">
              Manage Existing Exams
            </a>
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
    
    .dashboard-stats,
    .dashboard-actions {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .dashboard-stats h2,
    .dashboard-actions h2 {
      margin-top: 0;
      color: #333;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.5rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background-color: #f9f9f9;
      padding: 1.5rem;
      border-radius: 6px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #758f76;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .action-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      border: none;
      padding: 1rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      color: #333;
      text-decoration: none;
      text-align: center;
    }
    
    .action-btn:hover {
      background-color: #e0e0e0;
    }
    
    .action-btn:disabled {
      background-color: #f0f0f0;
      color: #999;
      cursor: not-allowed;
    }
    
    .import-btn {
      background-color: #e8f5e9;
    }
    
    .import-btn:hover {
      background-color: #c8e6c9;
    }
    
    .create-btn {
      background-color: #e1f5fe;
    }
    
    .create-btn:hover {
      background-color: #b3e5fc;
    }
    
    .manage-btn {
      background-color: #fff3e0;
    }
    
    .manage-btn:hover {
      background-color: #ffe0b2;
    }
    
    .stats-loading {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .admin-container {
        padding: 1rem;
      }
      
      .stats-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: ExamStats | null = null;
  loading = true;
  importLoading = false;

  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    
    this.adminService.getExamStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastService.error(error.message || 'Failed to load exam statistics');
      }
    });
  }

  importExamData(): void {
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
        
        // Refresh statistics
        this.loadStats();
      },
      error: (error) => {
        this.importLoading = false;
        this.loadingService.hide('importExams');
        
        this.toastService.error(error.message || 'Failed to import exam data');
      }
    });
  }
} 