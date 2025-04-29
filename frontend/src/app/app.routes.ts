import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component'; // Import the new component
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Set the landing page as the default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    component: AdminDashboardComponent,
    title: 'Admin Dashboard'
  },
  {
    path: 'admin/exams',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./admin/manage-exams/manage-exams.component').then(c => c.ManageExamsComponent),
    title: 'Manage Exams'
  },
  {
    path: 'admin/exams/new',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./admin/exam-form/exam-form.component').then(c => c.ExamFormComponent),
    title: 'Create Exam'
  },
  {
    path: 'admin/exams/:id',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./admin/exam-form/exam-form.component').then(c => c.ExamFormComponent),
    title: 'Edit Exam'
  },
  {
    path: 'admin/import',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./admin/import-data/import-data.component').then(c => c.ImportDataComponent),
    title: 'Import Data'
  },
  // Redirect all other paths to the landing page
  { path: '**', redirectTo: '' }
];