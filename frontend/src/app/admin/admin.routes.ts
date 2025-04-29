import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard'
  },
  {
    path: 'exams',
    loadComponent: () => 
      import('./manage-exams/manage-exams.component').then(c => c.ManageExamsComponent),
    title: 'Manage Exams'
  },
  {
    path: 'exams/new',
    loadComponent: () => 
      import('./exam-form/exam-form.component').then(c => c.ExamFormComponent),
    title: 'Create Exam'
  },
  {
    path: 'exams/:id',
    loadComponent: () => 
      import('./exam-form/exam-form.component').then(c => c.ExamFormComponent),
    title: 'Edit Exam'
  },
  {
    path: 'import',
    loadComponent: () => 
      import('./import-data/import-data.component').then(c => c.ImportDataComponent),
    title: 'Import Data'
  }
]; 