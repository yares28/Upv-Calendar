import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../components/index';

@Component({
  selector: 'app-manage-exams',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Manage Exams</h1>
        <nav class="admin-nav">
          <a routerLink="/admin">Dashboard</a>
          <a routerLink="/admin/exams" class="active">Manage Exams</a>
          <a routerLink="/admin/import">Import Data</a>
          <a routerLink="/">Back to Calendar</a>
        </nav>
      </header>
      
      <main class="admin-content">
        <section class="exams-list">
          <div class="list-header">
            <h2>Exam List</h2>
            <a routerLink="/admin/exams/new" class="create-btn">Add New Exam</a>
          </div>
          
          <div class="loading-placeholder">
            <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
            <p>Exam management functionality is currently being implemented.</p>
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
    
    .exams-list {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.5rem;
    }
    
    .list-header h2 {
      margin: 0;
      color: #333;
    }
    
    .create-btn {
      background-color: #758f76;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .create-btn:hover {
      background-color: #657a66;
    }
    
    .loading-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
      color: #666;
    }
  `]
})
export class ManageExamsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // This component will be implemented in the future
  }
} 