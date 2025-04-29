This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where line numbers have been added, content has been formatted for parsing in markdown style, security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: frontend
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Content has been formatted for parsing in markdown style
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
frontend/
  src/
    app/
      admin/
        admin-dashboard/
          admin-dashboard.component.ts
        exam-form/
          exam-form.component.ts
        import-data/
          import-data.component.ts
        manage-exams/
          manage-exams.component.ts
        admin.routes.ts
        index.ts
      components/
        exam-popup/
          exam-popup.component.html
          exam-popup.component.spec.ts
          exam-popup.component.ts
        loading-spinner/
          loading-spinner.component.spec.ts
          loading-spinner.component.ts
        toast-container/
          toast-container.component.ts
        toast-notification/
          toast-notification.component.spec.ts
          toast-notification.component.ts
        index.ts
      guards/
        admin.guard.ts
        auth.guard.ts
      interceptors/
        auth.interceptor.ts
      landing/
        landing.component.html
        landing.component.scss
        landing.component.spec.ts
        landing.component.ts
      login/
        login.component.ts
      register/
        register.component.ts
      services/
        admin.service.ts
        auth.service.ts
        calendar.service.ts
        exam.service.ts
        loading.service.ts
        theme.service.ts
        toast.service.spec.ts
        toast.service.ts
      app-routing.module.ts
      app.component.html
      app.component.spec.ts
      app.component.ts
      app.config.server.ts
      app.config.ts
      app.module.ts
      app.routes.ts
    assets/
      icons/
        dark-mode.svg
        light-mode.svg
        upv-logo.svg
      js/
        theme-init.js
    environments/
      environment.prod.ts
      environment.ts
    index.html
    main.server.ts
    main.ts
    server.ts
    styles.css
    styles.scss
  .editorconfig
  .gitignore
  angular.json
  package.json
  README.md
  tsconfig.app.json
  tsconfig.json
  tsconfig.spec.json
```

# Files

## File: frontend/src/app/admin/admin-dashboard/admin-dashboard.component.ts
````typescript
  1: import { Component, OnInit } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { RouterLink } from '@angular/router';
  4: import { AdminService, ExamStats } from '../../services/admin.service';
  5: import { LoadingService } from '../../services/loading.service';
  6: import { ToastService } from '../../services/toast.service';
  7: import { LoadingSpinnerComponent } from '../../components/index';
  8: 
  9: @Component({
 10:   selector: 'app-admin-dashboard',
 11:   standalone: true,
 12:   imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
 13:   template: `
 14:     <div class="admin-container">
 15:       <header class="admin-header">
 16:         <h1>Admin Dashboard</h1>
 17:         <nav class="admin-nav">
 18:           <a routerLink="/admin" class="active">Dashboard</a>
 19:           <a routerLink="/admin/exams">Manage Exams</a>
 20:           <a routerLink="/admin/import">Import Data</a>
 21:           <a routerLink="/">Back to Calendar</a>
 22:         </nav>
 23:       </header>
 24:       
 25:       <main class="admin-content">
 26:         <section class="dashboard-stats">
 27:           <h2>Exam Statistics</h2>
 28:           
 29:           <div *ngIf="loading" class="stats-loading">
 30:             <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
 31:           </div>
 32:           
 33:           <div *ngIf="!loading" class="stats-grid">
 34:             <div class="stat-card">
 35:               <div class="stat-value">{{ stats?.totalExams || 0 }}</div>
 36:               <div class="stat-label">Total Exams</div>
 37:             </div>
 38:             <div class="stat-card">
 39:               <div class="stat-value">{{ stats?.totalSubjects || 0 }}</div>
 40:               <div class="stat-label">Total Subjects</div>
 41:             </div>
 42:             <div class="stat-card">
 43:               <div class="stat-value">{{ stats?.totalDegrees || 0 }}</div>
 44:               <div class="stat-label">Total Degrees</div>
 45:             </div>
 46:             <div class="stat-card">
 47:               <div class="stat-value">
 48:                 {{ stats && stats.lastUpdated ? (stats.lastUpdated | date:'mediumDate') : 'Never' }}
 49:               </div>
 50:               <div class="stat-label">Last Updated</div>
 51:             </div>
 52:           </div>
 53:         </section>
 54:         
 55:         <section class="dashboard-actions">
 56:           <h2>Quick Actions</h2>
 57:           
 58:           <div class="actions-grid">
 59:             <button 
 60:               (click)="importExamData()" 
 61:               [disabled]="importLoading" 
 62:               class="action-btn import-btn"
 63:             >
 64:               <span *ngIf="!importLoading">Import Exam Data</span>
 65:               <span *ngIf="importLoading">Importing...</span>
 66:             </button>
 67:             
 68:             <a routerLink="/admin/exams/new" class="action-btn create-btn">
 69:               Create New Exam
 70:             </a>
 71:             
 72:             <a routerLink="/admin/exams" class="action-btn manage-btn">
 73:               Manage Existing Exams
 74:             </a>
 75:           </div>
 76:         </section>
 77:       </main>
 78:     </div>
 79:   `,
 80:   styles: [`
 81:     .admin-container {
 82:       max-width: 1200px;
 83:       margin: 0 auto;
 84:       padding: 2rem;
 85:     }
 86:     
 87:     .admin-header {
 88:       margin-bottom: 2rem;
 89:       border-bottom: 1px solid #e0e0e0;
 90:       padding-bottom: 1rem;
 91:     }
 92:     
 93:     .admin-header h1 {
 94:       margin-top: 0;
 95:       color: #758f76;
 96:       margin-bottom: 1rem;
 97:     }
 98:     
 99:     .admin-nav {
100:       display: flex;
101:       gap: 1rem;
102:       flex-wrap: wrap;
103:     }
104:     
105:     .admin-nav a {
106:       text-decoration: none;
107:       color: #333;
108:       padding: 0.5rem 1rem;
109:       border-radius: 4px;
110:       transition: background-color 0.2s;
111:     }
112:     
113:     .admin-nav a:hover {
114:       background-color: #f0f0f0;
115:     }
116:     
117:     .admin-nav a.active {
118:       background-color: #758f76;
119:       color: white;
120:     }
121:     
122:     .admin-content {
123:       display: flex;
124:       flex-direction: column;
125:       gap: 2rem;
126:     }
127:     
128:     .dashboard-stats,
129:     .dashboard-actions {
130:       background-color: white;
131:       border-radius: 8px;
132:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
133:       padding: 1.5rem;
134:     }
135:     
136:     .dashboard-stats h2,
137:     .dashboard-actions h2 {
138:       margin-top: 0;
139:       color: #333;
140:       margin-bottom: 1.5rem;
141:       border-bottom: 1px solid #f0f0f0;
142:       padding-bottom: 0.5rem;
143:     }
144:     
145:     .stats-grid {
146:       display: grid;
147:       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
148:       gap: 1.5rem;
149:     }
150:     
151:     .stat-card {
152:       background-color: #f9f9f9;
153:       padding: 1.5rem;
154:       border-radius: 6px;
155:       text-align: center;
156:     }
157:     
158:     .stat-value {
159:       font-size: 2rem;
160:       font-weight: bold;
161:       color: #758f76;
162:       margin-bottom: 0.5rem;
163:     }
164:     
165:     .stat-label {
166:       color: #666;
167:       font-size: 0.9rem;
168:     }
169:     
170:     .actions-grid {
171:       display: grid;
172:       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
173:       gap: 1rem;
174:     }
175:     
176:     .action-btn {
177:       display: flex;
178:       justify-content: center;
179:       align-items: center;
180:       background-color: #f5f5f5;
181:       border: none;
182:       padding: 1rem;
183:       border-radius: 6px;
184:       font-size: 1rem;
185:       cursor: pointer;
186:       transition: background-color 0.2s;
187:       color: #333;
188:       text-decoration: none;
189:       text-align: center;
190:     }
191:     
192:     .action-btn:hover {
193:       background-color: #e0e0e0;
194:     }
195:     
196:     .action-btn:disabled {
197:       background-color: #f0f0f0;
198:       color: #999;
199:       cursor: not-allowed;
200:     }
201:     
202:     .import-btn {
203:       background-color: #e8f5e9;
204:     }
205:     
206:     .import-btn:hover {
207:       background-color: #c8e6c9;
208:     }
209:     
210:     .create-btn {
211:       background-color: #e1f5fe;
212:     }
213:     
214:     .create-btn:hover {
215:       background-color: #b3e5fc;
216:     }
217:     
218:     .manage-btn {
219:       background-color: #fff3e0;
220:     }
221:     
222:     .manage-btn:hover {
223:       background-color: #ffe0b2;
224:     }
225:     
226:     .stats-loading {
227:       display: flex;
228:       justify-content: center;
229:       padding: 2rem;
230:     }
231:     
232:     /* Responsive adjustments */
233:     @media (max-width: 768px) {
234:       .admin-container {
235:         padding: 1rem;
236:       }
237:       
238:       .stats-grid,
239:       .actions-grid {
240:         grid-template-columns: 1fr;
241:       }
242:     }
243:   `]
244: })
245: export class AdminDashboardComponent implements OnInit {
246:   stats: ExamStats | null = null;
247:   loading = true;
248:   importLoading = false;
249: 
250:   constructor(
251:     private adminService: AdminService,
252:     private loadingService: LoadingService,
253:     private toastService: ToastService
254:   ) { }
255: 
256:   ngOnInit(): void {
257:     this.loadStats();
258:   }
259: 
260:   loadStats(): void {
261:     this.loading = true;
262:     
263:     this.adminService.getExamStats().subscribe({
264:       next: (stats) => {
265:         this.stats = stats;
266:         this.loading = false;
267:       },
268:       error: (error) => {
269:         this.loading = false;
270:         this.toastService.error(error.message || 'Failed to load exam statistics');
271:       }
272:     });
273:   }
274: 
275:   importExamData(): void {
276:     if (this.importLoading) {
277:       return;
278:     }
279:     
280:     this.importLoading = true;
281:     this.loadingService.show('importExams', 'Importing exam data...');
282:     
283:     this.adminService.importExamData().subscribe({
284:       next: (result) => {
285:         this.importLoading = false;
286:         this.loadingService.hide('importExams');
287:         
288:         this.toastService.success(
289:           `Successfully imported ${result.importedExams} new exams and updated ${result.updatedExams} existing exams.`
290:         );
291:         
292:         // Refresh statistics
293:         this.loadStats();
294:       },
295:       error: (error) => {
296:         this.importLoading = false;
297:         this.loadingService.hide('importExams');
298:         
299:         this.toastService.error(error.message || 'Failed to import exam data');
300:       }
301:     });
302:   }
303: }
````

## File: frontend/src/app/admin/exam-form/exam-form.component.ts
````typescript
  1: import { Component, OnInit } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { RouterLink, ActivatedRoute, Router } from '@angular/router';
  4: import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  5: import { LoadingSpinnerComponent } from '../../components/index';
  6: import { ToastService } from '../../services/toast.service';
  7: 
  8: @Component({
  9:   selector: 'app-exam-form',
 10:   standalone: true,
 11:   imports: [CommonModule, RouterLink, ReactiveFormsModule, LoadingSpinnerComponent],
 12:   template: `
 13:     <div class="admin-container">
 14:       <header class="admin-header">
 15:         <h1>{{ isEditMode ? 'Edit Exam' : 'Create New Exam' }}</h1>
 16:         <nav class="admin-nav">
 17:           <a routerLink="/admin">Dashboard</a>
 18:           <a routerLink="/admin/exams">Manage Exams</a>
 19:           <a routerLink="/admin/import">Import Data</a>
 20:           <a routerLink="/">Back to Calendar</a>
 21:         </nav>
 22:       </header>
 23:       
 24:       <main class="admin-content">
 25:         <section class="exam-form-section">
 26:           <div class="loading-placeholder">
 27:             <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
 28:             <p>Exam form functionality is currently being implemented.</p>
 29:             <button class="back-button" (click)="goBack()">Go Back</button>
 30:           </div>
 31:         </section>
 32:       </main>
 33:     </div>
 34:   `,
 35:   styles: [`
 36:     .admin-container {
 37:       max-width: 1200px;
 38:       margin: 0 auto;
 39:       padding: 2rem;
 40:     }
 41:     
 42:     .admin-header {
 43:       margin-bottom: 2rem;
 44:       border-bottom: 1px solid #e0e0e0;
 45:       padding-bottom: 1rem;
 46:     }
 47:     
 48:     .admin-header h1 {
 49:       margin-top: 0;
 50:       color: #758f76;
 51:       margin-bottom: 1rem;
 52:     }
 53:     
 54:     .admin-nav {
 55:       display: flex;
 56:       gap: 1rem;
 57:       flex-wrap: wrap;
 58:     }
 59:     
 60:     .admin-nav a {
 61:       text-decoration: none;
 62:       color: #333;
 63:       padding: 0.5rem 1rem;
 64:       border-radius: 4px;
 65:       transition: background-color 0.2s;
 66:     }
 67:     
 68:     .admin-nav a:hover {
 69:       background-color: #f0f0f0;
 70:     }
 71:     
 72:     .admin-content {
 73:       display: flex;
 74:       flex-direction: column;
 75:       gap: 2rem;
 76:     }
 77:     
 78:     .exam-form-section {
 79:       background-color: white;
 80:       border-radius: 8px;
 81:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 82:       padding: 1.5rem;
 83:     }
 84:     
 85:     .loading-placeholder {
 86:       display: flex;
 87:       flex-direction: column;
 88:       align-items: center;
 89:       padding: 3rem;
 90:       text-align: center;
 91:       color: #666;
 92:       gap: 1rem;
 93:     }
 94:     
 95:     .back-button {
 96:       background-color: #758f76;
 97:       color: white;
 98:       border: none;
 99:       padding: 0.5rem 1rem;
100:       border-radius: 4px;
101:       cursor: pointer;
102:       transition: background-color 0.2s;
103:     }
104:     
105:     .back-button:hover {
106:       background-color: #657a66;
107:     }
108:   `]
109: })
110: export class ExamFormComponent implements OnInit {
111:   isEditMode = false;
112:   examId?: string;
113: 
114:   constructor(
115:     private route: ActivatedRoute,
116:     private router: Router,
117:     private toastService: ToastService
118:   ) { }
119: 
120:   ngOnInit(): void {
121:     this.examId = this.route.snapshot.paramMap.get('id') || undefined;
122:     this.isEditMode = !!this.examId;
123:     
124:     // Show toast indicating functionality is not fully implemented
125:     this.toastService.info('Exam form functionality is coming soon!');
126:   }
127: 
128:   goBack(): void {
129:     this.router.navigate(['/admin/exams']);
130:   }
131: }
````

## File: frontend/src/app/admin/import-data/import-data.component.ts
````typescript
  1: import { Component } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { RouterLink } from '@angular/router';
  4: import { LoadingSpinnerComponent } from '../../components/index';
  5: import { AdminService } from '../../services/admin.service';
  6: import { ToastService } from '../../services/toast.service';
  7: import { LoadingService } from '../../services/loading.service';
  8: 
  9: @Component({
 10:   selector: 'app-import-data',
 11:   standalone: true,
 12:   imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
 13:   template: `
 14:     <div class="admin-container">
 15:       <header class="admin-header">
 16:         <h1>Import Exam Data</h1>
 17:         <nav class="admin-nav">
 18:           <a routerLink="/admin">Dashboard</a>
 19:           <a routerLink="/admin/exams">Manage Exams</a>
 20:           <a routerLink="/admin/import" class="active">Import Data</a>
 21:           <a routerLink="/">Back to Calendar</a>
 22:         </nav>
 23:       </header>
 24:       
 25:       <main class="admin-content">
 26:         <section class="import-section">
 27:           <h2>Data Import Options</h2>
 28:           
 29:           <div class="import-card">
 30:             <h3>Import from ETSINFexams.txt</h3>
 31:             <p>
 32:               Import exam data from the ETSINFexams.txt file. This will parse the file and
 33:               add new exams to the database or update existing ones.
 34:             </p>
 35:             <button 
 36:               class="import-btn" 
 37:               [disabled]="importLoading" 
 38:               (click)="importFromFile()"
 39:             >
 40:               <span *ngIf="!importLoading">Start Import</span>
 41:               <span *ngIf="importLoading">Importing...</span>
 42:             </button>
 43:           </div>
 44:         </section>
 45:       </main>
 46:     </div>
 47:   `,
 48:   styles: [`
 49:     .admin-container {
 50:       max-width: 1200px;
 51:       margin: 0 auto;
 52:       padding: 2rem;
 53:     }
 54:     
 55:     .admin-header {
 56:       margin-bottom: 2rem;
 57:       border-bottom: 1px solid #e0e0e0;
 58:       padding-bottom: 1rem;
 59:     }
 60:     
 61:     .admin-header h1 {
 62:       margin-top: 0;
 63:       color: #758f76;
 64:       margin-bottom: 1rem;
 65:     }
 66:     
 67:     .admin-nav {
 68:       display: flex;
 69:       gap: 1rem;
 70:       flex-wrap: wrap;
 71:     }
 72:     
 73:     .admin-nav a {
 74:       text-decoration: none;
 75:       color: #333;
 76:       padding: 0.5rem 1rem;
 77:       border-radius: 4px;
 78:       transition: background-color 0.2s;
 79:     }
 80:     
 81:     .admin-nav a:hover {
 82:       background-color: #f0f0f0;
 83:     }
 84:     
 85:     .admin-nav a.active {
 86:       background-color: #758f76;
 87:       color: white;
 88:     }
 89:     
 90:     .admin-content {
 91:       display: flex;
 92:       flex-direction: column;
 93:       gap: 2rem;
 94:     }
 95:     
 96:     .import-section {
 97:       background-color: white;
 98:       border-radius: 8px;
 99:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
100:       padding: 1.5rem;
101:     }
102:     
103:     .import-section h2 {
104:       margin-top: 0;
105:       color: #333;
106:       margin-bottom: 1.5rem;
107:       border-bottom: 1px solid #f0f0f0;
108:       padding-bottom: 0.5rem;
109:     }
110:     
111:     .import-card {
112:       background-color: #f9f9f9;
113:       border-radius: 6px;
114:       padding: 1.5rem;
115:       margin-bottom: 1rem;
116:     }
117:     
118:     .import-card h3 {
119:       margin-top: 0;
120:       color: #555;
121:       margin-bottom: 0.75rem;
122:     }
123:     
124:     .import-card p {
125:       color: #666;
126:       margin-bottom: 1.5rem;
127:     }
128:     
129:     .import-btn {
130:       background-color: #758f76;
131:       color: white;
132:       border: none;
133:       padding: 0.75rem 1.5rem;
134:       border-radius: 4px;
135:       cursor: pointer;
136:       transition: background-color 0.2s;
137:       font-size: 1rem;
138:     }
139:     
140:     .import-btn:hover {
141:       background-color: #657a66;
142:     }
143:     
144:     .import-btn:disabled {
145:       background-color: #a5b5a6;
146:       cursor: not-allowed;
147:     }
148:     
149:     /* Responsive adjustments */
150:     @media (max-width: 768px) {
151:       .admin-container {
152:         padding: 1rem;
153:       }
154:     }
155:   `]
156: })
157: export class ImportDataComponent {
158:   importLoading = false;
159: 
160:   constructor(
161:     private adminService: AdminService,
162:     private toastService: ToastService,
163:     private loadingService: LoadingService
164:   ) { }
165: 
166:   importFromFile(): void {
167:     if (this.importLoading) {
168:       return;
169:     }
170:     
171:     this.importLoading = true;
172:     this.loadingService.show('importExams', 'Importing exam data...');
173:     
174:     this.adminService.importExamData().subscribe({
175:       next: (result) => {
176:         this.importLoading = false;
177:         this.loadingService.hide('importExams');
178:         
179:         this.toastService.success(
180:           `Successfully imported ${result.importedExams} new exams and updated ${result.updatedExams} existing exams.`
181:         );
182:       },
183:       error: (error) => {
184:         this.importLoading = false;
185:         this.loadingService.hide('importExams');
186:         
187:         this.toastService.error(error.message || 'Failed to import exam data');
188:       }
189:     });
190:   }
191: }
````

## File: frontend/src/app/admin/manage-exams/manage-exams.component.ts
````typescript
  1: import { Component, OnInit } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { RouterLink } from '@angular/router';
  4: import { LoadingSpinnerComponent } from '../../components/index';
  5: 
  6: @Component({
  7:   selector: 'app-manage-exams',
  8:   standalone: true,
  9:   imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
 10:   template: `
 11:     <div class="admin-container">
 12:       <header class="admin-header">
 13:         <h1>Manage Exams</h1>
 14:         <nav class="admin-nav">
 15:           <a routerLink="/admin">Dashboard</a>
 16:           <a routerLink="/admin/exams" class="active">Manage Exams</a>
 17:           <a routerLink="/admin/import">Import Data</a>
 18:           <a routerLink="/">Back to Calendar</a>
 19:         </nav>
 20:       </header>
 21:       
 22:       <main class="admin-content">
 23:         <section class="exams-list">
 24:           <div class="list-header">
 25:             <h2>Exam List</h2>
 26:             <a routerLink="/admin/exams/new" class="create-btn">Add New Exam</a>
 27:           </div>
 28:           
 29:           <div class="loading-placeholder">
 30:             <app-loading-spinner [overlay]="false" [size]="30"></app-loading-spinner>
 31:             <p>Exam management functionality is currently being implemented.</p>
 32:           </div>
 33:         </section>
 34:       </main>
 35:     </div>
 36:   `,
 37:   styles: [`
 38:     .admin-container {
 39:       max-width: 1200px;
 40:       margin: 0 auto;
 41:       padding: 2rem;
 42:     }
 43:     
 44:     .admin-header {
 45:       margin-bottom: 2rem;
 46:       border-bottom: 1px solid #e0e0e0;
 47:       padding-bottom: 1rem;
 48:     }
 49:     
 50:     .admin-header h1 {
 51:       margin-top: 0;
 52:       color: #758f76;
 53:       margin-bottom: 1rem;
 54:     }
 55:     
 56:     .admin-nav {
 57:       display: flex;
 58:       gap: 1rem;
 59:       flex-wrap: wrap;
 60:     }
 61:     
 62:     .admin-nav a {
 63:       text-decoration: none;
 64:       color: #333;
 65:       padding: 0.5rem 1rem;
 66:       border-radius: 4px;
 67:       transition: background-color 0.2s;
 68:     }
 69:     
 70:     .admin-nav a:hover {
 71:       background-color: #f0f0f0;
 72:     }
 73:     
 74:     .admin-nav a.active {
 75:       background-color: #758f76;
 76:       color: white;
 77:     }
 78:     
 79:     .admin-content {
 80:       display: flex;
 81:       flex-direction: column;
 82:       gap: 2rem;
 83:     }
 84:     
 85:     .exams-list {
 86:       background-color: white;
 87:       border-radius: 8px;
 88:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 89:       padding: 1.5rem;
 90:     }
 91:     
 92:     .list-header {
 93:       display: flex;
 94:       justify-content: space-between;
 95:       align-items: center;
 96:       margin-bottom: 1.5rem;
 97:       border-bottom: 1px solid #f0f0f0;
 98:       padding-bottom: 0.5rem;
 99:     }
100:     
101:     .list-header h2 {
102:       margin: 0;
103:       color: #333;
104:     }
105:     
106:     .create-btn {
107:       background-color: #758f76;
108:       color: white;
109:       text-decoration: none;
110:       padding: 0.5rem 1rem;
111:       border-radius: 4px;
112:       transition: background-color 0.2s;
113:     }
114:     
115:     .create-btn:hover {
116:       background-color: #657a66;
117:     }
118:     
119:     .loading-placeholder {
120:       display: flex;
121:       flex-direction: column;
122:       align-items: center;
123:       padding: 3rem;
124:       text-align: center;
125:       color: #666;
126:     }
127:   `]
128: })
129: export class ManageExamsComponent implements OnInit {
130:   constructor() { }
131: 
132:   ngOnInit(): void {
133:     // This component will be implemented in the future
134:   }
135: }
````

## File: frontend/src/app/admin/admin.routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
 3: 
 4: export const ADMIN_ROUTES: Routes = [
 5:   {
 6:     path: '',
 7:     component: AdminDashboardComponent,
 8:     title: 'Admin Dashboard'
 9:   },
10:   {
11:     path: 'exams',
12:     loadComponent: () => 
13:       import('./manage-exams/manage-exams.component').then(c => c.ManageExamsComponent),
14:     title: 'Manage Exams'
15:   },
16:   {
17:     path: 'exams/new',
18:     loadComponent: () => 
19:       import('./exam-form/exam-form.component').then(c => c.ExamFormComponent),
20:     title: 'Create Exam'
21:   },
22:   {
23:     path: 'exams/:id',
24:     loadComponent: () => 
25:       import('./exam-form/exam-form.component').then(c => c.ExamFormComponent),
26:     title: 'Edit Exam'
27:   },
28:   {
29:     path: 'import',
30:     loadComponent: () => 
31:       import('./import-data/import-data.component').then(c => c.ImportDataComponent),
32:     title: 'Import Data'
33:   }
34: ];
````

## File: frontend/src/app/admin/index.ts
````typescript
1: export { ADMIN_ROUTES } from './admin.routes';
````

## File: frontend/src/app/components/exam-popup/exam-popup.component.html
````html
1: <p>exam-popup works!</p>
````

## File: frontend/src/app/components/exam-popup/exam-popup.component.spec.ts
````typescript
 1: import { ComponentFixture, TestBed } from '@angular/core/testing';
 2: 
 3: import { ExamPopupComponent } from './exam-popup.component';
 4: 
 5: describe('ExamPopupComponent', () => {
 6:   let component: ExamPopupComponent;
 7:   let fixture: ComponentFixture<ExamPopupComponent>;
 8: 
 9:   beforeEach(async () => {
10:     await TestBed.configureTestingModule({
11:       imports: [ExamPopupComponent]
12:     })
13:     .compileComponents();
14: 
15:     fixture = TestBed.createComponent(ExamPopupComponent);
16:     component = fixture.componentInstance;
17:     fixture.detectChanges();
18:   });
19: 
20:   it('should create', () => {
21:     expect(component).toBeTruthy();
22:   });
23: });
````

## File: frontend/src/app/components/exam-popup/exam-popup.component.ts
````typescript
  1: import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { trigger, transition, style, animate } from '@angular/animations';
  4: import { Exam, ExamPopupPosition } from '../../types/exam.types';
  5: 
  6: @Component({
  7:   selector: 'app-exam-popup',
  8:   standalone: true,
  9:   imports: [CommonModule],
 10:   template: `
 11:     <div class="exam-popup-overlay" *ngIf="show" (click)="onOverlayClick($event)">
 12:       <div 
 13:         class="exam-popup" 
 14:         [style.top]="position?.top" 
 15:         [style.left]="position?.left"
 16:         [style.transform-origin]="position?.transformOrigin"
 17:         [@popupAnimation]="show"
 18:       >
 19:         <div class="popup-connector" *ngIf="shouldShowConnector"
 20:              [style.top]="connectorPosition.top"
 21:              [style.left]="connectorPosition.left">
 22:         </div>
 23:         <div class="popup-header">
 24:           <h3>{{ date | date:'EEEE, MMMM d, y' }}</h3>
 25:           <button class="close-btn" (click)="close.emit()">
 26:             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 27:               <line x1="18" y1="6" x2="6" y2="18"></line>
 28:               <line x1="6" y1="6" x2="18" y2="18"></line>
 29:             </svg>
 30:           </button>
 31:         </div>
 32: 
 33:         <div class="popup-content">
 34:           <div class="no-exams" *ngIf="exams.length === 0">
 35:             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
 36:               <circle cx="12" cy="12" r="10"></circle>
 37:               <line x1="12" y1="8" x2="12" y2="12"></line>
 38:               <line x1="12" y1="16" x2="12.01" y2="16"></line>
 39:             </svg>
 40:             <p>No exams scheduled for this date.</p>
 41:           </div>
 42: 
 43:           <div class="exam-list" *ngIf="exams.length > 0">
 44:             <div class="exam-card" *ngFor="let exam of exams">
 45:               <div class="exam-header">
 46:                 <h4>{{ exam.name }}</h4>
 47:                 <span class="time-badge">{{ exam.time }}</span>
 48:               </div>
 49: 
 50:               <div class="exam-info">
 51:                 <div class="info-row">
 52:                   <span class="info-label">Course</span>
 53:                   <span class="info-value">{{ exam.course }}</span>
 54:                 </div>
 55:                 <div class="info-row">
 56:                   <span class="info-label">Subject</span>
 57:                   <span class="info-value">{{ exam.subject }}</span>
 58:                 </div>
 59:                 <div class="info-row">
 60:                   <span class="info-label">Location</span>
 61:                   <span class="info-value">{{ exam.location }}</span>
 62:                 </div>
 63:                 <div class="info-row" *ngIf="exam.notes">
 64:                   <span class="info-label">Notes</span>
 65:                   <span class="info-value notes">{{ exam.notes }}</span>
 66:                 </div>
 67:               </div>
 68: 
 69:               <div class="exam-actions">
 70:                 <button class="action-btn add-calendar" (click)="onAddToCalendar(exam)">
 71:                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 72:                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
 73:                     <line x1="16" y1="2" x2="16" y2="6"></line>
 74:                     <line x1="8" y1="2" x2="8" y2="6"></line>
 75:                     <line x1="3" y1="10" x2="21" y2="10"></line>
 76:                     <line x1="12" y1="14" x2="12" y2="18"></line>
 77:                     <line x1="10" y1="16" x2="14" y2="16"></line>
 78:                   </svg>
 79:                   Add to Calendar
 80:                 </button>
 81:                 <button class="action-btn share" (click)="onShare(exam)">
 82:                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 83:                     <circle cx="18" cy="5" r="3"></circle>
 84:                     <circle cx="6" cy="12" r="3"></circle>
 85:                     <circle cx="18" cy="19" r="3"></circle>
 86:                     <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
 87:                     <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
 88:                   </svg>
 89:                   Share
 90:                 </button>
 91:               </div>
 92:             </div>
 93:           </div>
 94:         </div>
 95:       </div>
 96:     </div>
 97:   `,
 98:   styles: [`
 99:     .exam-popup-overlay {
100:       position: fixed;
101:       top: 0;
102:       left: 0;
103:       width: 100%;
104:       height: 100%;
105:       background-color: rgba(0, 0, 0, 0.5);
106:       backdrop-filter: blur(4px);
107:       display: flex;
108:       justify-content: center;
109:       align-items: center;
110:       z-index: 1000;
111:     }
112: 
113:     .exam-popup {
114:       position: absolute;
115:       width: 320px;
116:       max-width: 90vw;
117:       max-height: 90vh;
118:       background: var(--surface-1);
119:       border-radius: 12px;
120:       box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
121:       overflow: hidden;
122:       z-index: 1001;
123:     }
124: 
125:     .popup-connector {
126:       position: absolute;
127:       width: 16px;
128:       height: 16px;
129:       background-color: var(--primary);
130:       transform: rotate(45deg);
131:       z-index: 0;
132:     }
133: 
134:     .popup-header {
135:       display: flex;
136:       justify-content: space-between;
137:       align-items: center;
138:       padding: 16px 20px;
139:       background: var(--primary);
140:       color: white;
141:       position: relative;
142:       z-index: 2;
143:     }
144: 
145:     .popup-header h3 {
146:       margin: 0;
147:       font-size: 1.1rem;
148:       font-weight: 500;
149:     }
150: 
151:     .close-btn {
152:       background: none;
153:       border: none;
154:       color: white;
155:       padding: 4px;
156:       cursor: pointer;
157:       border-radius: 6px;
158:       display: flex;
159:       align-items: center;
160:       justify-content: center;
161:       transition: background-color 0.2s;
162:     }
163: 
164:     .close-btn:hover {
165:       background-color: rgba(255, 255, 255, 0.1);
166:     }
167: 
168:     .popup-content {
169:       padding: 20px;
170:       max-height: calc(90vh - 64px);
171:       overflow-y: auto;
172:       position: relative;
173:       z-index: 2;
174:     }
175: 
176:     .no-exams {
177:       display: flex;
178:       flex-direction: column;
179:       align-items: center;
180:       gap: 16px;
181:       padding: 32px;
182:       text-align: center;
183:       color: var(--text);
184:       opacity: 0.7;
185:     }
186: 
187:     .exam-list {
188:       display: flex;
189:       flex-direction: column;
190:       gap: 16px;
191:     }
192: 
193:     .exam-card {
194:       background: var(--surface-2);
195:       border-radius: 8px;
196:       padding: 16px;
197:       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
198:       transition: transform 0.2s, box-shadow 0.2s;
199:     }
200: 
201:     .exam-card:hover {
202:       transform: translateY(-2px);
203:       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
204:     }
205: 
206:     .exam-header {
207:       display: flex;
208:       justify-content: space-between;
209:       align-items: center;
210:       margin-bottom: 16px;
211:       padding-bottom: 12px;
212:       border-bottom: 1px solid var(--surface-3);
213:     }
214: 
215:     .exam-header h4 {
216:       margin: 0;
217:       font-size: 1.1rem;
218:       color: var(--primary);
219:       font-weight: 500;
220:     }
221: 
222:     .time-badge {
223:       background: var(--primary);
224:       color: white;
225:       padding: 4px 8px;
226:       border-radius: 4px;
227:       font-size: 0.9rem;
228:       font-weight: 500;
229:     }
230: 
231:     .exam-info {
232:       display: flex;
233:       flex-direction: column;
234:       gap: 8px;
235:     }
236: 
237:     .info-row {
238:       display: flex;
239:       align-items: baseline;
240:     }
241: 
242:     .info-label {
243:       flex: 0 0 80px;
244:       font-weight: 500;
245:       color: var(--text);
246:       opacity: 0.7;
247:       font-size: 0.9rem;
248:     }
249: 
250:     .info-value {
251:       flex: 1;
252:       color: var(--text);
253:     }
254: 
255:     .info-value.notes {
256:       font-style: italic;
257:       opacity: 0.8;
258:     }
259: 
260:     .exam-actions {
261:       display: flex;
262:       gap: 8px;
263:       margin-top: 16px;
264:       padding-top: 16px;
265:       border-top: 1px solid var(--surface-3);
266:     }
267: 
268:     .action-btn {
269:       flex: 1;
270:       display: flex;
271:       align-items: center;
272:       justify-content: center;
273:       gap: 8px;
274:       padding: 8px 16px;
275:       border: none;
276:       border-radius: 6px;
277:       font-size: 0.9rem;
278:       font-weight: 500;
279:       cursor: pointer;
280:       transition: all 0.2s;
281:     }
282: 
283:     .action-btn.add-calendar {
284:       background: var(--primary);
285:       color: white;
286:     }
287: 
288:     .action-btn.add-calendar:hover {
289:       background: var(--primary-dark);
290:     }
291: 
292:     .action-btn.share {
293:       background: var(--surface-3);
294:       color: var(--text);
295:     }
296: 
297:     .action-btn.share:hover {
298:       background: var(--surface-4);
299:     }
300: 
301:     @media (max-width: 768px) {
302:       .exam-popup-overlay {
303:         align-items: flex-end;
304:       }
305: 
306:       .exam-popup {
307:         position: relative;
308:         width: 100%;
309:         max-width: none;
310:         max-height: 80vh;
311:         border-radius: 16px 16px 0 0;
312:       }
313: 
314:       .popup-connector {
315:         display: none;
316:       }
317: 
318:       .exam-actions {
319:         position: sticky;
320:         bottom: 0;
321:         background: var(--surface-1);
322:         margin: 0 -20px -20px;
323:         padding: 16px 20px;
324:         box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
325:       }
326:     }
327:   `],
328:   animations: [
329:     trigger('popupAnimation', [
330:       transition(':enter', [
331:         style({ 
332:           opacity: 0,
333:           transform: 'scale(0.95)'
334:         }),
335:         animate('200ms ease-out', style({ 
336:           opacity: 1,
337:           transform: 'scale(1)'
338:         }))
339:       ]),
340:       transition(':leave', [
341:         animate('150ms ease-in', style({ 
342:           opacity: 0,
343:           transform: 'scale(0.95)'
344:         }))
345:       ])
346:     ])
347:   ]
348: })
349: export class ExamPopupComponent {
350:   @Input() show = false;
351:   @Input() position?: ExamPopupPosition;
352:   @Input() date?: Date;
353:   @Input() exams: Exam[] = [];
354:   @Output() close = new EventEmitter<void>();
355:   @Output() addToCalendar = new EventEmitter<Exam>();
356:   @Output() shareExam = new EventEmitter<Exam>();
357: 
358:   // Connector logic
359:   get shouldShowConnector(): boolean {
360:     return !!this.position?.transformOrigin && window.innerWidth > 768;
361:   }
362: 
363:   get connectorPosition(): { top: string, left: string } {
364:     if (!this.position?.transformOrigin) {
365:       return { top: '0', left: '0' };
366:     }
367: 
368:     // Calculate connector position based on transformOrigin
369:     const origin = this.position.transformOrigin;
370:     
371:     if (origin.includes('top')) {
372:       // If popup is below the date, place connector at top
373:       return { top: '-8px', left: 'calc(50% - 8px)' };
374:     } else if (origin.includes('bottom')) {
375:       // If popup is above the date, place connector at bottom
376:       return { top: 'calc(100% - 8px)', left: 'calc(50% - 8px)' };
377:     } else if (origin.includes('left')) {
378:       // If popup is to the right of the date
379:       return { top: 'calc(50% - 8px)', left: '-8px' };
380:     } else {
381:       // If popup is to the left of the date
382:       return { top: 'calc(50% - 8px)', left: 'calc(100% - 8px)' };
383:     }
384:   }
385: 
386:   @HostListener('document:keydown.escape')
387:   onEscapePress() {
388:     this.close.emit();
389:   }
390: 
391:   onOverlayClick(event: MouseEvent) {
392:     if ((event.target as Element).classList.contains('exam-popup-overlay')) {
393:       this.close.emit();
394:     }
395:   }
396: 
397:   onAddToCalendar(exam: Exam): void {
398:     this.addToCalendar.emit(exam);
399:   }
400: 
401:   onShare(exam: Exam): void {
402:     this.shareExam.emit(exam);
403:   }
404: }
````

## File: frontend/src/app/components/loading-spinner/loading-spinner.component.spec.ts
````typescript
 1: import { ComponentFixture, TestBed } from '@angular/core/testing';
 2: import { By } from '@angular/platform-browser';
 3: import { LoadingSpinnerComponent } from './loading-spinner.component';
 4: 
 5: describe('LoadingSpinnerComponent', () => {
 6:   let component: LoadingSpinnerComponent;
 7:   let fixture: ComponentFixture<LoadingSpinnerComponent>;
 8: 
 9:   beforeEach(async () => {
10:     await TestBed.configureTestingModule({
11:       imports: [LoadingSpinnerComponent]
12:     }).compileComponents();
13: 
14:     fixture = TestBed.createComponent(LoadingSpinnerComponent);
15:     component = fixture.componentInstance;
16:     fixture.detectChanges();
17:   });
18: 
19:   it('should create', () => {
20:     expect(component).toBeTruthy();
21:   });
22: 
23:   it('should have default properties', () => {
24:     expect(component.overlay).toBeTrue();
25:     expect(component.size).toBe(40);
26:     expect(component.color).toBe('#758f76');
27:     expect(component.message).toBe('');
28:   });
29: 
30:   it('should apply overlay class when overlay is true', () => {
31:     component.overlay = true;
32:     fixture.detectChanges();
33:     
34:     const container = fixture.debugElement.query(By.css('.spinner-container'));
35:     expect(container.nativeElement.classList).toContain('overlay');
36:     expect(container.nativeElement.classList).not.toContain('inline');
37:   });
38: 
39:   it('should apply inline class when overlay is false', () => {
40:     component.overlay = false;
41:     fixture.detectChanges();
42:     
43:     const container = fixture.debugElement.query(By.css('.spinner-container'));
44:     expect(container.nativeElement.classList).toContain('inline');
45:     expect(container.nativeElement.classList).not.toContain('overlay');
46:   });
47: 
48:   it('should show message when provided', () => {
49:     component.message = 'Loading data...';
50:     fixture.detectChanges();
51:     
52:     const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
53:     expect(messageElement).toBeTruthy();
54:     expect(messageElement.nativeElement.textContent).toContain('Loading data...');
55:   });
56: 
57:   it('should not show message element when no message is provided', () => {
58:     component.message = '';
59:     fixture.detectChanges();
60:     
61:     const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
62:     expect(messageElement).toBeNull();
63:   });
64: 
65:   it('should apply custom size', () => {
66:     component.size = 60;
67:     fixture.detectChanges();
68:     
69:     const container = fixture.debugElement.query(By.css('.spinner-container'));
70:     const styles = window.getComputedStyle(container.nativeElement);
71:     
72:     // Check if the custom property is being set
73:     expect(container.nativeElement.style.getPropertyValue('--spinner-size')).toBe('60px');
74:   });
75: 
76:   it('should apply custom color', () => {
77:     component.color = '#ff0000';
78:     fixture.detectChanges();
79:     
80:     const container = fixture.debugElement.query(By.css('.spinner-container'));
81:     
82:     // Check if the custom property is being set
83:     expect(container.nativeElement.style.getPropertyValue('--spinner-color')).toBe('#ff0000');
84:   });
85: });
````

## File: frontend/src/app/components/loading-spinner/loading-spinner.component.ts
````typescript
 1: import { Component, Input } from '@angular/core';
 2: import { CommonModule } from '@angular/common';
 3: 
 4: @Component({
 5:   selector: 'app-loading-spinner',
 6:   standalone: true,
 7:   imports: [CommonModule],
 8:   template: `
 9:     <div 
10:       class="spinner-container" 
11:       [class.overlay]="overlay" 
12:       [class.inline]="!overlay"
13:       [style.--spinner-size]="size + 'px'"
14:       [style.--spinner-color]="color"
15:     >
16:       <div class="spinner"></div>
17:       <div *ngIf="message" class="spinner-message">{{ message }}</div>
18:     </div>
19:   `,
20:   styles: [`
21:     :host {
22:       display: contents;
23:     }
24:     
25:     .spinner-container {
26:       display: flex;
27:       flex-direction: column;
28:       align-items: center;
29:       justify-content: center;
30:       gap: 1rem;
31:     }
32:     
33:     .overlay {
34:       position: fixed;
35:       top: 0;
36:       left: 0;
37:       width: 100%;
38:       height: 100%;
39:       background-color: rgba(255, 255, 255, 0.8);
40:       z-index: 9998;
41:     }
42:     
43:     .inline {
44:       padding: 1rem;
45:     }
46:     
47:     .spinner {
48:       width: var(--spinner-size, 40px);
49:       height: var(--spinner-size, 40px);
50:       border: 4px solid rgba(0, 0, 0, 0.1);
51:       border-radius: 50%;
52:       border-top-color: var(--spinner-color, #758f76);
53:       animation: spin 1s ease-in-out infinite;
54:     }
55:     
56:     .spinner-message {
57:       color: #333;
58:       font-size: 1rem;
59:       text-align: center;
60:       max-width: 80%;
61:     }
62:     
63:     @keyframes spin {
64:       to {
65:         transform: rotate(360deg);
66:       }
67:     }
68:     
69:     /* Ensure accessibility - hide spinner from screen readers but keeps it visually */
70:     .spinner:not(:focus):not(:active) {
71:       position: relative;
72:       clip: rect(0 0 0 0);
73:       clip-path: inset(50%);
74:       width: var(--spinner-size, 40px);
75:       height: var(--spinner-size, 40px);
76:       overflow: hidden;
77:       white-space: nowrap;
78:     }
79:   `]
80: })
81: export class LoadingSpinnerComponent {
82:   @Input() overlay: boolean = true;
83:   @Input() size: number = 40;
84:   @Input() color: string = '#758f76'; // Primary color
85:   @Input() message: string = '';
86: }
````

## File: frontend/src/app/components/toast-container/toast-container.component.ts
````typescript
 1: import { Component, OnInit } from '@angular/core';
 2: import { CommonModule } from '@angular/common';
 3: import { ToastService } from '../../services/toast.service';
 4: import { Toast, ToastNotificationComponent } from '../toast-notification/toast-notification.component';
 5: 
 6: @Component({
 7:   selector: 'app-toast-container',
 8:   standalone: true,
 9:   imports: [CommonModule, ToastNotificationComponent],
10:   template: `
11:     <div class="toast-notification-container">
12:       <app-toast-notification
13:         *ngFor="let toast of toasts"
14:         [id]="toast.id"
15:         [message]="toast.message"
16:         [type]="toast.type"
17:         [timeout]="toast.timeout || 5000"
18:         (click)="removeToast(toast.id)"
19:       ></app-toast-notification>
20:     </div>
21:   `,
22:   styles: [`
23:     .toast-notification-container {
24:       position: fixed;
25:       top: 20px;
26:       right: 20px;
27:       z-index: 9999;
28:       display: flex;
29:       flex-direction: column;
30:       gap: 8px;
31:     }
32:     
33:     @media (max-width: 768px) {
34:       .toast-notification-container {
35:         top: 10px;
36:         right: 10px;
37:         left: 10px;
38:         align-items: center;
39:       }
40:     }
41:   `]
42: })
43: export class ToastContainerComponent implements OnInit {
44:   toasts: Toast[] = [];
45: 
46:   constructor(private toastService: ToastService) { }
47: 
48:   ngOnInit(): void {
49:     // Subscribe to toast notifications
50:     this.toastService.toasts$.subscribe(toasts => {
51:       this.toasts = toasts;
52:     });
53:   }
54: 
55:   removeToast(id: number): void {
56:     this.toastService.remove(id);
57:   }
58: }
````

## File: frontend/src/app/components/toast-notification/toast-notification.component.spec.ts
````typescript
 1: import { ComponentFixture, TestBed } from '@angular/core/testing';
 2: import { By } from '@angular/platform-browser';
 3: import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 4: import { ToastNotificationComponent } from './toast-notification.component';
 5: 
 6: describe('ToastNotificationComponent', () => {
 7:   let component: ToastNotificationComponent;
 8:   let fixture: ComponentFixture<ToastNotificationComponent>;
 9: 
10:   beforeEach(async () => {
11:     await TestBed.configureTestingModule({
12:       imports: [ToastNotificationComponent, BrowserAnimationsModule]
13:     }).compileComponents();
14: 
15:     fixture = TestBed.createComponent(ToastNotificationComponent);
16:     component = fixture.componentInstance;
17:     
18:     // Set required inputs
19:     component.id = 1;
20:     component.message = 'Test toast message';
21:     component.type = 'success';
22:     
23:     fixture.detectChanges();
24:   });
25: 
26:   it('should create', () => {
27:     expect(component).toBeTruthy();
28:   });
29: 
30:   it('should display the message correctly', () => {
31:     const messageElement = fixture.debugElement.query(By.css('.toast-message'));
32:     expect(messageElement.nativeElement.textContent).toContain('Test toast message');
33:   });
34: 
35:   it('should have correct CSS class based on type', () => {
36:     const containerElement = fixture.debugElement.query(By.css('.toast-container'));
37:     expect(containerElement.nativeElement.classList).toContain('toast-success');
38:     
39:     // Change type and verify class changes
40:     component.type = 'error';
41:     fixture.detectChanges();
42:     expect(containerElement.nativeElement.classList).toContain('toast-error');
43:   });
44: 
45:   it('should close toast when close button is clicked', () => {
46:     spyOn(component, 'closeToast');
47:     const closeButton = fixture.debugElement.query(By.css('.toast-close'));
48:     closeButton.triggerEventHandler('click', { stopPropagation: () => {} });
49:     expect(component.closeToast).toHaveBeenCalled();
50:   });
51: 
52:   it('should start with progress bar at 100%', () => {
53:     const progressBar = fixture.debugElement.query(By.css('.toast-progress'));
54:     expect(component.progressWidth).toBe(100);
55:   });
56: 
57:   it('should clear timeout on destroy', () => {
58:     spyOn(component, 'clearTimeout');
59:     component.ngOnDestroy();
60:     expect(component.clearTimeout).toHaveBeenCalled();
61:   });
62: });
````

## File: frontend/src/app/components/toast-notification/toast-notification.component.ts
````typescript
  1: import { Component, Input, OnDestroy, OnInit } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { animate, state, style, transition, trigger } from '@angular/animations';
  4: 
  5: export interface Toast {
  6:   id: number;
  7:   message: string;
  8:   type: 'success' | 'error' | 'info' | 'warning';
  9:   timeout?: number;
 10: }
 11: 
 12: @Component({
 13:   selector: 'app-toast-notification',
 14:   standalone: true,
 15:   imports: [CommonModule],
 16:   template: `
 17:     <div 
 18:       *ngIf="visible"
 19:       [@toastAnimation]="animationState" 
 20:       class="toast-container" 
 21:       [ngClass]="'toast-' + type"
 22:       (click)="closeToast()"
 23:     >
 24:       <div class="toast-content">
 25:         <div class="toast-icon">
 26:           <svg *ngIf="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 27:             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
 28:             <polyline points="22 4 12 14.01 9 11.01"></polyline>
 29:           </svg>
 30:           <svg *ngIf="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 31:             <circle cx="12" cy="12" r="10"></circle>
 32:             <line x1="15" y1="9" x2="9" y2="15"></line>
 33:             <line x1="9" y1="9" x2="15" y2="15"></line>
 34:           </svg>
 35:           <svg *ngIf="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 36:             <circle cx="12" cy="12" r="10"></circle>
 37:             <line x1="12" y1="16" x2="12" y2="12"></line>
 38:             <line x1="12" y1="8" x2="12.01" y2="8"></line>
 39:           </svg>
 40:           <svg *ngIf="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 41:             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
 42:             <line x1="12" y1="9" x2="12" y2="13"></line>
 43:             <line x1="12" y1="17" x2="12.01" y2="17"></line>
 44:           </svg>
 45:         </div>
 46:         <div class="toast-message">{{ message }}</div>
 47:         <div class="toast-close" (click)="closeToast($event)">
 48:           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 49:             <line x1="18" y1="6" x2="6" y2="18"></line>
 50:             <line x1="6" y1="6" x2="18" y2="18"></line>
 51:           </svg>
 52:         </div>
 53:       </div>
 54:       <div class="toast-progress" [style.width.%]="progressWidth"></div>
 55:     </div>
 56:   `,
 57:   styles: [`
 58:     .toast-container {
 59:       position: relative;
 60:       padding: 16px;
 61:       border-radius: 6px;
 62:       margin-bottom: 10px;
 63:       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 64:       overflow: hidden;
 65:       cursor: pointer;
 66:       max-width: 350px;
 67:       min-width: 250px;
 68:     }
 69:     
 70:     .toast-content {
 71:       display: flex;
 72:       align-items: center;
 73:       gap: 12px;
 74:     }
 75:     
 76:     .toast-icon {
 77:       flex-shrink: 0;
 78:     }
 79:     
 80:     .toast-message {
 81:       flex-grow: 1;
 82:     }
 83:     
 84:     .toast-close {
 85:       flex-shrink: 0;
 86:       cursor: pointer;
 87:       opacity: 0.6;
 88:       transition: opacity 0.2s;
 89:     }
 90:     
 91:     .toast-close:hover {
 92:       opacity: 1;
 93:     }
 94:     
 95:     .toast-progress {
 96:       position: absolute;
 97:       bottom: 0;
 98:       left: 0;
 99:       height: 3px;
100:       background-color: rgba(255, 255, 255, 0.5);
101:       transition: width 0.3s linear;
102:     }
103:     
104:     .toast-success {
105:       background-color: #4caf50;
106:       color: white;
107:     }
108:     
109:     .toast-error {
110:       background-color: #f44336;
111:       color: white;
112:     }
113:     
114:     .toast-info {
115:       background-color: #2196f3;
116:       color: white;
117:     }
118:     
119:     .toast-warning {
120:       background-color: #ff9800;
121:       color: white;
122:     }
123:   `],
124:   animations: [
125:     trigger('toastAnimation', [
126:       state('hidden', style({
127:         opacity: 0,
128:         transform: 'translateY(20px)'
129:       })),
130:       state('visible', style({
131:         opacity: 1,
132:         transform: 'translateY(0)'
133:       })),
134:       state('removed', style({
135:         opacity: 0,
136:         transform: 'translateX(100%)'
137:       })),
138:       transition('hidden => visible', animate('200ms ease-out')),
139:       transition('visible => removed', animate('300ms ease-in'))
140:     ])
141:   ]
142: })
143: export class ToastNotificationComponent implements OnInit, OnDestroy {
144:   @Input() id!: number;
145:   @Input() message: string = '';
146:   @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
147:   @Input() timeout: number = 5000; // Default 5 seconds
148: 
149:   visible = true;
150:   animationState: 'hidden' | 'visible' | 'removed' = 'hidden';
151:   progressWidth = 100;
152:   private intervalId: any;
153: 
154:   constructor() { }
155: 
156:   ngOnInit(): void {
157:     // Set animation state to visible
158:     setTimeout(() => {
159:       this.animationState = 'visible';
160:     }, 10);
161: 
162:     // Start progress bar countdown
163:     this.startTimeout();
164:   }
165: 
166:   ngOnDestroy(): void {
167:     this.clearTimeout();
168:   }
169: 
170:   startTimeout(): void {
171:     if (this.timeout > 0) {
172:       const decrementAmount = 1000 / this.timeout * 100;
173:       this.intervalId = setInterval(() => {
174:         this.progressWidth -= decrementAmount;
175:         if (this.progressWidth <= 0) {
176:           this.closeToast();
177:         }
178:       }, 100);
179:     }
180:   }
181: 
182:   clearTimeout(): void {
183:     if (this.intervalId) {
184:       clearInterval(this.intervalId);
185:     }
186:   }
187: 
188:   closeToast(event?: Event): void {
189:     if (event) {
190:       event.stopPropagation();
191:     }
192:     
193:     this.animationState = 'removed';
194:     this.clearTimeout();
195:     
196:     // Remove from DOM after animation completes
197:     setTimeout(() => {
198:       this.visible = false;
199:     }, 300);
200:   }
201: }
````

## File: frontend/src/app/components/index.ts
````typescript
1: export * from './loading-spinner/loading-spinner.component';
2: export * from './toast-notification/toast-notification.component';
3: export * from './toast-container/toast-container.component';
````

## File: frontend/src/app/guards/admin.guard.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { Router, CanActivate, UrlTree } from '@angular/router';
 3: import { AuthService } from '../services/auth.service';
 4: import { Observable } from 'rxjs';
 5: import { ToastService } from '../services/toast.service';
 6: 
 7: @Injectable({
 8:   providedIn: 'root'
 9: })
10: export class AdminGuard implements CanActivate {
11:   constructor(
12:     private authService: AuthService,
13:     private router: Router,
14:     private toastService: ToastService
15:   ) {}
16: 
17:   canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
18:     // Check if user is logged in
19:     if (!this.authService.isLoggedIn()) {
20:       this.toastService.error('You must be logged in to access the admin area');
21:       this.router.navigate(['/login'], { 
22:         queryParams: { returnUrl: this.router.url }
23:       });
24:       return false;
25:     }
26: 
27:     // Get the current user
28:     const user = this.authService.getCurrentUser();
29:     
30:     // For now, implement a simple role check. This should be enhanced later
31:     // with proper role-based access control from the backend
32:     if (user && user.email && (
33:         user.email.endsWith('@upv.es') || 
34:         user.email.endsWith('@admin.upv.es') ||
35:         user.email === 'admin@example.com'
36:       )) {
37:       return true;
38:     }
39:     
40:     // If not an admin, redirect to home page
41:     this.toastService.error('You do not have admin privileges');
42:     this.router.navigate(['/']);
43:     
44:     return false;
45:   }
46: }
````

## File: frontend/src/app/guards/auth.guard.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { Router, CanActivate, UrlTree } from '@angular/router';
 3: import { AuthService } from '../services/auth.service';
 4: import { Observable } from 'rxjs';
 5: 
 6: @Injectable({
 7:   providedIn: 'root'
 8: })
 9: export class AuthGuard implements CanActivate {
10:   constructor(
11:     private authService: AuthService,
12:     private router: Router
13:   ) {}
14: 
15:   canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
16:     // Check if user is logged in
17:     if (this.authService.isLoggedIn()) {
18:       return true;
19:     }
20: 
21:     // If not logged in, redirect to login page with return URL
22:     this.router.navigate(['/login'], { 
23:       queryParams: { returnUrl: this.router.url }
24:     });
25:     
26:     return false;
27:   }
28: }
````

## File: frontend/src/app/interceptors/auth.interceptor.ts
````typescript
  1: import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
  2: import { inject } from '@angular/core';
  3: import { catchError, switchMap, throwError, Observable, of } from 'rxjs';
  4: import { AuthService, TokenResponse } from '../services/auth.service';
  5: import { Router } from '@angular/router';
  6: import { environment } from '../../environments/environment';
  7: 
  8: // This flag helps prevent multiple refresh requests when multiple HTTP requests fail simultaneously
  9: let isRefreshing = false;
 10: let refreshSubscriber: Observable<any> | null = null;
 11: 
 12: export const authInterceptor: HttpInterceptorFn = (
 13:   req: HttpRequest<unknown>,
 14:   next: HttpHandlerFn
 15: ) => {
 16:   const authService = inject(AuthService);
 17:   const router = inject(Router);
 18: 
 19:   // Skip token for authentication requests
 20:   if (req.url.includes(`${environment.apiUrl}/auth/login`) || 
 21:       req.url.includes(`${environment.apiUrl}/auth/register`)) {
 22:     return next(req);
 23:   }
 24: 
 25:   // Get token from auth service
 26:   const token = authService.getToken();
 27: 
 28:   // If token exists, add it to the request headers
 29:   if (token) {
 30:     req = req.clone({
 31:       setHeaders: {
 32:         Authorization: `Bearer ${token}`
 33:       }
 34:     });
 35:   }
 36: 
 37:   // Pass the modified request to the next handler
 38:   return next(req).pipe(
 39:     catchError((error: HttpErrorResponse) => {
 40:       // Handle token expiration (401 Unauthorized)
 41:       if (error.status === 401 && token) {
 42:         return handleTokenExpiration(req, next, authService, router);
 43:       }
 44:       
 45:       // Handle 403 Forbidden responses
 46:       if (error.status === 403) {
 47:         // If the user doesn't have permission, redirect to home page
 48:         router.navigate(['/']);
 49:       }
 50:       
 51:       return throwError(() => error);
 52:     })
 53:   );
 54: };
 55: 
 56: /**
 57:  * Handle token expiration by refreshing the token if possible
 58:  */
 59: function handleTokenExpiration(
 60:   req: HttpRequest<unknown>,
 61:   next: HttpHandlerFn,
 62:   authService: AuthService,
 63:   router: Router
 64: ): Observable<any> {
 65:   // If we're not already refreshing
 66:   if (!isRefreshing) {
 67:     isRefreshing = true;
 68:     refreshSubscriber = null;
 69:     
 70:     // User object must still be in localStorage even if token expired
 71:     const user = authService.getCurrentUser();
 72:     
 73:     if (!user) {
 74:       // If no user info, just logout and redirect to login
 75:       isRefreshing = false;
 76:       authService.logout();
 77:       router.navigate(['/login']);
 78:       return throwError(() => new Error('Authentication required'));
 79:     }
 80:     
 81:     // Try to refresh the token 
 82:     return authService.refreshToken().pipe(
 83:       switchMap((refreshResult: TokenResponse) => {
 84:         isRefreshing = false;
 85:         
 86:         // Retry the failed request with the new token
 87:         const newRequest = req.clone({
 88:           setHeaders: {
 89:             Authorization: `Bearer ${refreshResult.token}`
 90:           }
 91:         });
 92:         
 93:         return next(newRequest);
 94:       }),
 95:       catchError(error => {
 96:         isRefreshing = false;
 97:         
 98:         // If refresh token fails, log the user out
 99:         authService.logout();
100:         router.navigate(['/login']);
101:         
102:         return throwError(() => error);
103:       })
104:     );
105:   } else {
106:     // If we're already refreshing, wait for the refresh to complete and retry
107:     return refreshSubscriber || throwError(() => new Error('Authentication required'));
108:   }
109: }
````

## File: frontend/src/app/landing/landing.component.html
````html
  1: <header class="landing-header">
  2:   <div class="header-content">
  3:     <div class="logo-container">
  4:       <img src="assets/icons/upv-logo.svg" alt="UPV Calendar" class="logo">
  5:       <span class="header-title">UPV Exam Calendar</span>
  6:     </div>
  7:     <nav class="header-nav">
  8:       <button class="nav-button" (click)="openMyCalendar()">My Calendar</button>
  9:       <button class="nav-button" (click)="openAuthModal()">{{ isLoggedIn ? 'My Account' : 'Login / Register' }}</button>
 10:       <button class="theme-toggle" (click)="toggleTheme()" [attr.aria-label]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
 11:         <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 12:           <circle cx="12" cy="12" r="5"></circle>
 13:           <line x1="12" y1="1" x2="12" y2="3"></line>
 14:           <line x1="12" y1="21" x2="12" y2="23"></line>
 15:           <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
 16:           <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
 17:           <line x1="1" y1="12" x2="3" y2="12"></line>
 18:           <line x1="21" y1="12" x2="23" y2="12"></line>
 19:           <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
 20:           <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
 21:         </svg>
 22:         <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 23:           <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
 24:         </svg>
 25:       </button>
 26:     </nav>
 27:   </div>
 28: </header>
 29: 
 30: <main class="landing-main" (click)="handleDocumentClick($event)">
 31:   <!-- Hero Section -->
 32:   <section class="hero-section">
 33:     <div class="hero-content">
 34:       <h1>Find Your UPV Exam Schedule</h1>
 35:       <p class="subtitle">Easily filter, view, and export exam dates for your courses.</p>
 36:       <button class="cta-button" (click)="scrollToFilters()">Start Filtering</button>
 37:     </div>
 38:   </section>
 39: 
 40:   <!-- Main Content Area (Filters + Calendar) -->
 41:   <div class="content-area" id="filters-section">
 42:     <!-- Filters Sidebar -->
 43:     <aside class="filters-sidebar card">
 44:       <h2>Filters</h2>
 45:       
 46:       <!-- Degree Dropdown -->
 47:       <div class="filter-group">
 48:         <button class="filter-header" (click)="toggleDropdown('degree')" [class.open]="openDropdowns.degree">
 49:           Degree <span class="arrow">▼</span>
 50:         </button>
 51:         <div class="filter-options" [class.open]="openDropdowns.degree">
 52:           <div class="checkbox-item" *ngFor="let degree of degrees">
 53:             <label><input type="checkbox" [checked]="isSelected(degree, selectedDegrees)" (change)="toggleSelection(degree, selectedDegrees)"> {{ degree }}</label>
 54:           </div>
 55:         </div>
 56:       </div>
 57: 
 58:       <!-- Semester Dropdown -->
 59:       <div class="filter-group">
 60:         <button class="filter-header" (click)="toggleDropdown('semester')" [class.open]="openDropdowns.semester">
 61:           Semester <span class="arrow">▼</span>
 62:         </button>
 63:         <div class="filter-options" [class.open]="openDropdowns.semester">
 64:           <div class="checkbox-item" *ngFor="let semester of semesters">
 65:             <label><input type="checkbox" [checked]="isSelected(semester, selectedSemesters)" (change)="toggleSelection(semester, selectedSemesters)"> {{ semester }}</label>
 66:           </div>
 67:         </div>
 68:       </div>
 69: 
 70:       <!-- Subject Dropdown -->
 71:       <div class="filter-group">
 72:         <button class="filter-header" (click)="toggleDropdown('subject')" [class.open]="openDropdowns.subject">
 73:           Subject <span class="arrow">▼</span>
 74:         </button>
 75:         <div class="filter-options" [class.open]="openDropdowns.subject">
 76:           <div class="checkbox-item" *ngFor="let subject of subjects">
 77:             <label><input type="checkbox" [checked]="isSelected(subject, selectedSubjects)" (change)="toggleSelection(subject, selectedSubjects)"> {{ subject }}</label>
 78:           </div>
 79:         </div>
 80:       </div>
 81: 
 82:       <!-- Calendar Actions -->
 83:       <div class="calendar-actions">
 84:         <button class="action-button" (click)="saveCalendar()" title="Save current filter settings">
 85:           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
 86:           Save View
 87:         </button>
 88:         <div class="export-actions">
 89:            <button class="action-button export-button" (click)="exportToGoogle()" [disabled]="filteredExams.length === 0" title="Export to Google Calendar">
 90:              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
 91:              Google
 92:            </button>
 93:            <button class="action-button export-button" (click)="exportToICal()" [disabled]="filteredExams.length === 0" title="Download .ics File">
 94:              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
 95:              iCal
 96:            </button>
 97:         </div>
 98:          <small class="export-info" *ngIf="filteredExams.length === 0">No exams to export.</small>
 99:          <small class="export-info" *ngIf="filteredExams.length > 0">{{filteredExams.length}} exam(s) selected.</small>
100:       </div>
101:     </aside>
102: 
103:     <!-- Calendar Display Area -->
104:     <section class="calendar-display-area">
105:       <div *ngIf="filteredMonths.length === 0" class="no-exams-message card">
106:         <p>No exams found for the selected filters.</p>
107:         <p>Please adjust your filter criteria.</p>
108:       </div>
109: 
110:       <div class="calendar-grid" *ngIf="filteredMonths.length > 0">
111:         <div class="month-block card" *ngFor="let month of filteredMonths">
112:           <h3>{{ month.monthName }} {{ month.year }}</h3>
113:           <table class="calendar-table">
114:             <thead>
115:               <tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr>
116:             </thead>
117:             <tbody>
118:               <tr *ngFor="let week of month.days">
119:                 <td *ngFor="let day of week" 
120:                     [ngClass]="{
121:                       'has-exam': day?.hasExams, 
122:                       'is-empty': !day,
123:                       'selected': selectedDate && day && selectedDate.getTime() === day.date.getTime()
124:                     }">
125:                   <button class="calendar-day-button" (click)="selectDate(day, $event)" *ngIf="day" [attr.aria-label]="day.hasExams ? (getExamCountForDate(day.date) + ' exam(s) on ' + (day.date | date:'longDate')) : (day.date | date:'longDate')">
126:                     {{ day.day }}
127:                     <span class="exam-dot" *ngIf="day.hasExams"></span>
128:                   </button>
129:                 </td>
130:               </tr>
131:             </tbody>
132:           </table>
133:         </div>
134:       </div>
135:     </section>
136:   </div>
137: 
138:   <!-- NEW Exam Tooltip -->
139:   <div class="exam-tooltip" 
140:        *ngIf="showExamTooltip" 
141:        [style.top]="tooltipPosition.top" 
142:        [style.left]="tooltipPosition.left"
143:        [style.transform]="tooltipPosition.transform">
144:     <div class="tooltip-content">
145:        <div *ngIf="tooltipExams.length === 0">No exam details available.</div>
146:        <div class="exam-item" *ngFor="let exam of tooltipExams">
147:           <h4>{{ exam.subject }}</h4>
148:           <p><strong>Time:</strong> {{ exam.time || 'N/A' }}</p>
149:           <p><strong>Location:</strong> {{ exam.location || 'N/A' }}</p>
150:           <p><strong>Course:</strong> {{ exam.course }}</p>
151:           <!-- Add action buttons if needed -->
152:           <!-- 
153:           <div class="tooltip-actions">
154:              <button (click)="handleAddToCalendar(exam)">Add to Cal</button>
155:              <button (click)="handleShareExam(exam)">Share</button>
156:           </div>
157:            -->
158:        </div>
159:     </div>
160:     <!-- Add arrow element here if needed, positioned with CSS -->
161:     <div class="tooltip-arrow"></div> 
162:   </div>
163:   
164:   <!-- Login/Register Modal -->
165:   <div class="modal-overlay" *ngIf="showAuthModal" (click)="closeAuthModal($event)">
166:     <div class="auth-modal card">
167:       <div class="modal-header">
168:         <h3>{{ authMode === 'login' ? 'Login' : 'Register' }}</h3>
169:         <button class="close-modal-btn" (click)="closeAuthModal($event)">×</button>
170:       </div>
171:       <div class="modal-content">
172:         <div class="form-group">
173:           <label for="email">Email</label>
174:           <input type="email" id="email" [(ngModel)]="authForm.email" placeholder="Enter your email">
175:         </div>
176:         <div class="form-group">
177:           <label for="password">Password</label>
178:           <input type="password" id="password" [(ngModel)]="authForm.password" placeholder="Enter your password">
179:         </div>
180:         <div class="form-group" *ngIf="authMode === 'register'">
181:           <label for="confirmPassword">Confirm Password</label>
182:           <input type="password" id="confirmPassword" [(ngModel)]="authForm.confirmPassword" placeholder="Confirm your password">
183:         </div>
184:         <div class="auth-buttons">
185:           <button class="auth-btn action-button" (click)="submitAuthForm()">{{ authMode === 'login' ? 'Login' : 'Register' }}</button>
186:           <div class="auth-toggle">
187:             {{ authMode === 'login' ? "Don't have an account?" : "Already have an account?" }}
188:             <a href="#" (click)="toggleAuthMode($event)">{{ authMode === 'login' ? 'Register' : 'Login' }}</a>
189:           </div>
190:         </div>
191:       </div>
192:     </div>
193:   </div>
194: 
195:   <div class="notification-toast" *ngIf="showNotification" [ngClass]="notificationType">
196:     {{ notificationMessage }}
197:   </div>
198: 
199: </main>
````

## File: frontend/src/app/landing/landing.component.scss
````scss
  1: /* Landing Page Specific Styles */
  2: 
  3: // Import global variables/mixins if needed (optional)
  4: // @import '../../styles/variables'; 
  5: 
  6: // Use :host to scope styles to this component
  7: :host {
  8:   display: block; // Ensures the component takes up space
  9: }
 10: 
 11: // Header Styles
 12: .landing-header {
 13:   background-color: var(--card-background-color);
 14:   color: var(--text-color);
 15:   box-shadow: 0 2px 4px var(--card-shadow-color);
 16:   padding: 0.75rem 1.5rem;
 17:   border-bottom: 1px solid var(--border-color);
 18:   position: sticky; // Make header sticky
 19:   top: 0;
 20:   z-index: 1000; // Ensure header stays on top
 21:   transition: background-color var(--transition-speed), border-color var(--transition-speed);
 22: 
 23:   .header-content {
 24:     display: flex;
 25:     justify-content: space-between;
 26:     align-items: center;
 27:     max-width: 1200px;
 28:     margin: 0 auto;
 29:   }
 30: 
 31:   .logo-container {
 32:     display: flex;
 33:     align-items: center;
 34:     gap: 0.75rem;
 35: 
 36:     .logo {
 37:       height: 30px;
 38:       width: auto;
 39:       // Apply filter for dark mode if needed, e.g., invert
 40:       html[data-theme="dark"] & {
 41:         filter: invert(1) hue-rotate(180deg); // Example: makes logo visible on dark bg
 42:       }
 43:     }
 44: 
 45:     .header-title {
 46:       font-size: 1.25rem;
 47:     font-weight: 600;
 48:       color: var(--text-color);
 49:     }
 50:   }
 51: 
 52:   .header-nav {
 53:     display: flex;
 54:     align-items: center;
 55:     gap: 0.5rem;
 56:   }
 57: 
 58:   .nav-button, .theme-toggle {
 59:     background-color: transparent;
 60:     color: var(--text-muted-color);
 61:     border: 1px solid var(--border-color);
 62:     padding: 0.5rem 1rem;
 63:     border-radius: var(--border-radius);
 64:     cursor: pointer;
 65:     font-size: 0.9rem;
 66:     transition: background-color var(--transition-speed), color var(--transition-speed), border-color var(--transition-speed);
 67:     display: inline-flex; // For aligning icon/text if needed
 68:     align-items: center;
 69:     justify-content: center;
 70:     
 71:     &:hover {
 72:       background-color: var(--secondary-color);
 73:       color: var(--text-color);
 74:       border-color: var(--text-muted-color);
 75:     }
 76:   }
 77:   
 78:   .theme-toggle {
 79:       padding: 0.5rem; // Make it square-ish
 80:       svg {
 81:           stroke: var(--text-muted-color); // Make icon color match theme
 82:           transition: stroke var(--transition-speed);
 83:       }
 84:        &:hover svg {
 85:             stroke: var(--text-color);
 86:        }
 87:   }
 88: }
 89: 
 90: // Main Content Area
 91: .landing-main {
 92:   padding: 2rem 1.5rem;
 93:   background-color: var(--background-color);
 94: }
 95: 
 96: // Hero Section
 97: .hero-section {
 98:   background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
 99:   color: var(--button-text-color); // Use button text color for high contrast
100:   padding: 4rem 2rem;
101:   text-align: center;
102:   border-radius: 8px;
103:   margin-bottom: 2rem;
104:   display: flex; // Use flex to center content vertically
105:   justify-content: center;
106:     align-items: center;
107:   min-height: 30vh;
108:   box-shadow: inset 0 0 20px rgba(0,0,0,0.2); // Inner shadow for depth
109: 
110:   .hero-content {
111:     max-width: 700px;
112:   }
113: 
114:   h1 {
115:     font-size: 2.5rem;
116:     font-weight: 700;
117:     margin-bottom: 0.5rem;
118:     text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
119:   }
120: 
121:   .subtitle {
122:     font-size: 1.2rem;
123:     margin-bottom: 1.5rem;
124:     opacity: 0.9;
125:   }
126: 
127:   .cta-button {
128:     background-color: var(--background-color);
129:     color: var(--primary-color);
130:     padding: 0.8rem 2rem;
131:     font-size: 1.1rem;
132:     font-weight: 600;
133:     border-radius: 50px; // Pill shape
134:     border: none;
135:     cursor: pointer;
136:     transition: transform var(--transition-speed), box-shadow var(--transition-speed);
137:     box-shadow: 0 4px 10px rgba(0,0,0,0.2);
138: 
139:     &:hover {
140:       transform: translateY(-3px);
141:       box-shadow: 0 6px 15px rgba(0,0,0,0.3);
142:     }
143:   }
144: }
145: 
146: // Filters + Calendar Layout
147: .content-area {
148:   display: grid;
149:   grid-template-columns: 280px 1fr; // Fixed sidebar, flexible content
150:   gap: 2rem;
151:     max-width: 1200px;
152:   margin: 0 auto; // Center the content area
153: }
154: 
155: // Filters Sidebar
156: .filters-sidebar {
157:   // Inherits .card styles (background, border, shadow, padding) from global styles
158:   padding: 1.5rem; // Adjust padding if needed
159:   align-self: start; // Align to the top of the grid area
160:   position: sticky; // Make filters sticky below header
161:   top: 80px; // Adjust based on header height + desired gap
162:   // max-height: calc(100vh - 100px); // REMOVE height restriction
163:   // overflow-y: auto; // REMOVE scrollbar
164: 
165:   h2 {
166:     font-size: 1.3rem;
167:     font-weight: 600;
168:     margin-bottom: 1.5rem;
169:     padding-bottom: 0.5rem;
170:     border-bottom: 1px solid var(--border-color);
171:     color: var(--text-color);
172:   }
173: 
174:   .filter-group {
175:     margin-bottom: 1rem;
176:   }
177: 
178:   .filter-header {
179:     background: none;
180:     border: none;
181:     padding: 0.5rem 0;
182:     width: 100%;
183:     text-align: left;
184:     font-size: 1rem;
185:     font-weight: 500;
186:     color: var(--text-color);
187:     cursor: pointer;
188:     display: flex;
189:     justify-content: space-between;
190:     align-items: center;
191:     border-bottom: 1px solid var(--border-color);
192: 
193:     .arrow {
194:       transition: transform var(--transition-speed);
195:     }
196: 
197:     &.open .arrow {
198:     transform: rotate(180deg);
199:     }
200:   }
201: 
202:   .filter-options {
203:     max-height: 0;
204:     overflow: hidden; // Keep hidden when closed
205:     transition: max-height 0.3s ease-out;
206:     padding-left: 0.5rem; // Indent options slightly
207:     margin-top: 0.5rem;
208: 
209:     &.open {
210:       max-height: 40rem; // Increase max-height significantly to allow growth
211:       // overflow-y: auto; // REMOVE internal scrollbar
212:     }
213: 
214:   .checkbox-item {
215:       margin-bottom: 0.5rem;
216:       label {
217:     display: flex;
218:     align-items: center;
219:         gap: 0.5rem;
220:         font-weight: 400;
221:     cursor: pointer;
222:         color: var(--text-muted-color);
223:         &:hover {
224:             color: var(--text-color);
225:         }
226:       }
227:       input[type="checkbox"] {
228:         width: auto; // Override global width
229:     cursor: pointer;
230:         accent-color: var(--primary-color); // Use theme color for checkbox
231:       }
232:     }
233:   }
234: 
235:   .calendar-actions {
236:     margin-top: 2rem;
237:     border-top: 1px solid var(--border-color);
238:     padding-top: 1.5rem;
239:     display: flex;
240:     flex-direction: column;
241:     gap: 1rem;
242:   }
243: 
244:   .action-button {
245:      // Use global button styles, maybe add specific icon alignment
246:      display: inline-flex;
247:      align-items: center;
248:      justify-content: center;
249:      gap: 0.5rem;
250:     width: 100%;
251:      padding: 0.6rem 1rem;
252: 
253:      svg {
254:         width: 16px;
255:         height: 16px;
256:         stroke: var(--button-text-color);
257:      }
258:   }
259:   
260:   .export-actions {
261:     display: flex;
262:     gap: 0.5rem;
263:     .export-button {
264:       flex: 1; // Make export buttons share space
265:       font-size: 0.85rem;
266:       padding: 0.5rem;
267:     }
268:   }
269:   
270:   .export-info {
271:       font-size: 0.8rem;
272:       color: var(--text-muted-color);
273:       text-align: center;
274:   }
275: 
276: }
277: 
278: // Calendar Display Area
279: .calendar-display-area {
280:   min-width: 0; // Prevent grid blowout
281: 
282:   .no-exams-message {
283:     // Uses global .card style
284:     text-align: center;
285:     padding: 3rem 1.5rem;
286:     color: var(--text-muted-color);
287:     p {
288:       margin-bottom: 0.5rem;
289:     }
290:     p:first-child {
291:       font-size: 1.1rem;
292:     font-weight: 500;
293:       color: var(--text-color);
294:     }
295:   }
296: 
297:   .calendar-grid {
298:     display: grid;
299:     // Responsive columns: 1 on small, 2 on medium, 3 on large screens
300:     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
301:     gap: 1.5rem;
302:   }
303: 
304:   .month-block {
305:     // Uses global .card style
306:     padding: 1.5rem;
307: 
308:     h3 {
309:     text-align: center;
310:     font-size: 1.2rem;
311:       font-weight: 600;
312:       margin-bottom: 1rem;
313:       color: var(--text-color);
314:     }
315:   }
316: 
317:   .calendar-table {
318:     width: 100%;
319:     border-collapse: collapse;
320: 
321:     th {
322:       text-align: center;
323:     font-weight: 500;
324:       color: var(--text-muted-color);
325:       padding-bottom: 0.5rem;
326:       font-size: 0.85rem;
327:     }
328: 
329:     td {
330:       text-align: center;
331:       vertical-align: middle;
332:       height: 40px; // Give cells fixed height
333:       border: 1px solid transparent; // Placeholder for potential borders
334: 
335:       &.is-empty {
336:         background-color: transparent;
337:       }
338:     }
339: 
340:     .calendar-day-button {
341:     display: flex;
342:         flex-direction: column; // Stack number and dot
343:     align-items: center;
344:     justify-content: center;
345:         width: 36px; // Fixed size button
346:         height: 36px;
347:         margin: auto; // Center button in cell
348:         border: none;
349:         border-radius: 50%; // Circular days
350:         background-color: transparent;
351:         color: var(--text-color);
352:         font-size: 0.9rem;
353:         cursor: pointer;
354:         position: relative;
355:         transition: background-color var(--transition-speed), color var(--transition-speed);
356:         
357:         &:hover {
358:           background-color: var(--secondary-color);
359:         }
360: 
361:         .exam-dot {
362:     position: absolute;
363:             bottom: 4px;
364:     left: 50%;
365:             transform: translateX(-50%);
366:             width: 5px;
367:             height: 5px;
368:     border-radius: 50%;
369:             background-color: var(--accent-color);
370:         }
371:     }
372:     
373:     td.has-exam .calendar-day-button {
374:       font-weight: 600; // Highlight days with exams
375:     }
376: 
377:     td.selected .calendar-day-button {
378:       background-color: var(--primary-color);
379:       color: var(--button-text-color);
380:       .exam-dot {
381:           background-color: var(--button-text-color); // Dot contrasts selected bg
382:       }
383:     }
384:   }
385: }
386: 
387: // Modal and Popup Styles (Leverage existing selectors, apply theme variables)
388:   .modal-overlay {
389:   position: fixed; // Ensure it covers viewport
390:     top: 0;
391:     left: 0;
392:     width: 100%;
393:     height: 100%;
394:   background-color: rgba(0, 0, 0, 0.6); // Darker overlay
395:   display: flex !important; // Force flex display
396:   justify-content: center !important; // Force horizontal centering
397:   align-items: center !important; // Force vertical centering
398:   z-index: 1500; // Ensure overlay is above other content but below highest elements if needed
399:   }
400: 
401:   .auth-modal {
402:   // Uses global .card styles
403:   max-width: 450px;
404:     width: 90%;
405:   .modal-header {
406:     display: flex;
407:     justify-content: space-between;
408:     align-items: center;
409:     border-bottom: 1px solid var(--border-color);
410:     padding-bottom: 0.75rem;
411:     margin-bottom: 1rem;
412:     h3 {
413:     margin: 0;
414:         font-size: 1.4rem;
415:         color: var(--text-color);
416:   }
417:   .close-modal-btn {
418:     background: none;
419:     border: none;
420:         font-size: 1.8rem;
421:         color: var(--text-muted-color);
422:     cursor: pointer;
423:         padding: 0 0.5rem;
424:     line-height: 1;
425:         &:hover {
426:             color: var(--error-color);
427:   }
428:   }
429:   }
430:   .form-group {
431:     margin-bottom: 1rem;
432:     label {
433:         // Uses global label style
434:         font-size: 0.9rem;
435:     }
436:     input {
437:         // Uses global input style
438:     }
439:   }
440:   .auth-buttons {
441:     margin-top: 1.5rem;
442:   .auth-btn {
443:     width: 100%;
444:        // Uses .action-button style via class binding
445:     }
446:   .auth-toggle {
447:         margin-top: 1rem;
448:     text-align: center;
449:     font-size: 0.9rem;
450:         color: var(--text-muted-color);
451:         a {
452:             // Uses global link styles
453:             margin-left: 0.3rem;
454:     font-weight: 500;
455:   }
456:     }
457:   }
458:   }
459: 
460: // Notification Toast (Adjusting existing style)
461:   .notification-toast {
462:     position: fixed;
463:     bottom: 20px;
464:   left: 50%;
465:   transform: translateX(-50%);
466:   padding: 1rem 1.5rem;
467:     border-radius: var(--border-radius);
468:   color: var(--button-text-color);
469:     font-weight: 500;
470:     z-index: 2000;
471:   box-shadow: 0 4px 15px rgba(0,0,0,0.2);
472: 
473:   // Use theme colors
474:   &.success {
475:     background-color: var(--success-color);
476:   }
477:   &.error {
478:     background-color: var(--error-color);
479:   }
480: }
481: 
482: // NEW Exam Tooltip Styles
483: .exam-tooltip {
484:   position: absolute;
485:   background-color: var(--card-background-color);
486:   color: var(--text-color);
487:   border: 1px solid var(--border-color);
488:   border-radius: 25px; // Pill shape
489:   padding: 0.75rem 1.25rem;
490:   box-shadow: 0 5px 15px var(--card-shadow-color);
491:   z-index: 1100; // Ensure tooltip is above calendar but potentially below modal
492:   width: 280px;
493:   max-width: 90vw;
494:   // Transitions for smooth appearance (optional)
495:   // transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out; 
496:   // opacity: 0; // Start hidden if using transitions
497:   // visibility: hidden;
498: 
499:   // &.visible { // Add this class via [ngClass] if using transitions
500:   //   opacity: 1;
501:   //   visibility: visible;
502:   // }
503: 
504:   .tooltip-content {
505:     max-height: 150px; // Limit height
506:     overflow-y: auto;
507:   }
508: 
509:   .exam-item {
510:     border-bottom: 1px solid var(--border-color);
511:     padding-bottom: 0.75rem;
512:     margin-bottom: 0.75rem;
513: 
514:     &:last-child {
515:       border-bottom: none;
516:       margin-bottom: 0;
517:       padding-bottom: 0;
518:     }
519: 
520:     h4 {
521:       font-size: 1rem;
522:       font-weight: 600;
523:       color: var(--primary-color);
524:       margin-bottom: 0.3rem;
525:     }
526: 
527:     p {
528:       font-size: 0.85rem;
529:       color: var(--text-muted-color);
530:       margin-bottom: 0.2rem;
531:       strong {
532:         color: var(--text-color);
533:         font-weight: 500;
534:       }
535:     }
536:   }
537: 
538:   // Tooltip Arrow (using ::after pseudo-element)
539:   .tooltip-arrow {
540:     position: absolute;
541:     width: 12px;
542:     height: 12px;
543:     background-color: var(--card-background-color);
544:     border: 1px solid var(--border-color);
545:     border-bottom-width: 0;
546:     border-right-width: 0;
547:     transform-origin: center center;
548: 
549:     // Position arrow based on tooltip position (adjust as needed)
550:     // Assuming tooltip is usually ABOVE the button (transform: translate(-50%, -100%))
551:     bottom: -7px; // Half the height - border adjustment
552:     left: 50%;
553:     transform: translateX(-50%) rotate(45deg);
554:     z-index: -1; // Place behind the main tooltip body
555: 
556:     // Add styles if tooltip is BELOW the button (transform: translate(-50%, 0))
557:     // .tooltip-below & { // Need a way to detect this in TS or use different classes
558:     //   top: -7px;
559:     //   bottom: auto;
560:     //   transform: translateX(-50%) rotate(225deg);
561:     // }
562:   }
563: }
564: 
565: // Add Exam Popup Styles reference
566: // Note: app-exam-popup might need its own SCSS adjustments to use theme variables
567: 
568: // Responsive Adjustments
569: @media (max-width: 992px) {
570:   .content-area {
571:     grid-template-columns: 240px 1fr; // Slightly smaller sidebar
572:   }
573: }
574: 
575: @media (max-width: 768px) {
576:   .landing-header {
577:     padding: 0.5rem 1rem;
578:     .logo-container .header-title {
579:       font-size: 1.1rem;
580:     }
581:     .nav-button {
582:       font-size: 0.8rem;
583:       padding: 0.4rem 0.8rem;
584:     }
585:     .theme-toggle {
586:       padding: 0.4rem;
587:     }
588:   }
589: 
590:   .hero-section {
591:     padding: 3rem 1rem;
592:     min-height: 25vh;
593:     h1 {
594:       font-size: 2rem;
595:     }
596:     .subtitle {
597:       font-size: 1rem;
598:     }
599:     .cta-button {
600:       font-size: 1rem;
601:       padding: 0.7rem 1.5rem;
602:     }
603:   }
604: 
605:   .content-area {
606:     grid-template-columns: 1fr; // Stack sidebar and content
607:   }
608: 
609:   .filters-sidebar {
610:     position: static; // Unstick sidebar on small screens
611:     margin-bottom: 1.5rem;
612:     top: auto;
613:   }
614:   
615:   .calendar-grid {
616:        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
617:   }
618: }
619: 
620: @media (max-width: 480px) {
621:     .landing-header {
622:         .logo-container .logo {
623:             height: 24px;
624:         }
625:         .logo-container .header-title {
626:              font-size: 1rem; // Further reduce title
627:         }
628:          .nav-button {
629:             padding: 0.3rem 0.6rem;
630:          }
631:     }
632:     
633:     .hero-section h1 {
634:         font-size: 1.8rem;
635:     }
636:     .hero-section .subtitle {
637:         font-size: 0.9rem;
638:     }
639:     
640:     .calendar-table td {
641:         height: 36px;
642:         .calendar-day-button {
643:             width: 32px;
644:             height: 32px;
645:             font-size: 0.8rem;
646:             .exam-dot {
647:                 width: 4px;
648:                 height: 4px;
649:                 bottom: 3px;
650:             }
651:         }
652:     }
653:     
654:     .auth-modal {
655:         width: 95%;
656:     }
657:   }
````

## File: frontend/src/app/landing/landing.component.spec.ts
````typescript
 1: import { ComponentFixture, TestBed } from '@angular/core/testing';
 2: 
 3: import { LandingComponent } from './landing.component';
 4: 
 5: describe('LandingComponent', () => {
 6:   let component: LandingComponent;
 7:   let fixture: ComponentFixture<LandingComponent>;
 8: 
 9:   beforeEach(async () => {
10:     await TestBed.configureTestingModule({
11:       imports: [LandingComponent]
12:     })
13:     .compileComponents();
14: 
15:     fixture = TestBed.createComponent(LandingComponent);
16:     component = fixture.componentInstance;
17:     fixture.detectChanges();
18:   });
19: 
20:   it('should create', () => {
21:     expect(component).toBeTruthy();
22:   });
23: });
````

## File: frontend/src/app/landing/landing.component.ts
````typescript
   1: import { Component, OnInit, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
   2: import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
   3: import { FormsModule } from '@angular/forms';
   4: import { ThemeService } from '../services/theme.service';
   5: import { ExamPopupComponent } from '../components/exam-popup/exam-popup.component';
   6: import { Exam, ExamPopupPosition } from '../types/exam.types';
   7: 
   8: // Type guard for Exam objects
   9: function isExam(obj: any): obj is Exam {
  10:   return obj && 
  11:          typeof obj === 'object' && 
  12:          'id' in obj &&
  13:          'name' in obj &&
  14:          'date' in obj &&
  15:          'time' in obj &&
  16:          'location' in obj &&
  17:          'course' in obj &&
  18:          'subject' in obj &&
  19:          'semester' in obj;
  20: }
  21: 
  22: interface SavedCalendar {
  23:   id: number;
  24:   userId: number;
  25:   name: string;
  26:   filters: {
  27:     degrees: string[];
  28:     semesters: string[];
  29:     subjects: string[];
  30:   };
  31: }
  32: 
  33: interface User {
  34:   id: number;
  35:   email: string;
  36:   password: string; // In real-world app, never store plaintext passwords
  37:   name: string;
  38:   savedCalendars: SavedCalendar[];
  39: }
  40: 
  41: @Component({
  42:   selector: 'app-landing',
  43:   standalone: true,
  44:   imports: [CommonModule, FormsModule, DatePipe, ExamPopupComponent],
  45:   templateUrl: './landing.component.html',
  46:   styleUrl: './landing.component.scss'
  47: })
  48: export class LandingComponent implements OnInit {
  49:   // Calendar data
  50:   months: any[] = [];
  51:   filteredMonths: any[] = [];
  52:   currentYear: number = 2025;
  53:   selectedDate: Date | null = null;
  54:   
  55:   // Exam data
  56:   exams: Exam[] = [];
  57:   filteredExams: Exam[] = [];
  58:   // New property to store filtered exams for display without affecting calendar
  59:   displayExams: Exam[] = [];
  60:   
  61:   // Filter options
  62:   degrees: string[] = ['Computer Science', 'Engineering', 'Mathematics', 'ETSINF'];
  63:   semesters: string[] = ['A', 'B'];
  64:   subjects: string[] = ['Programming', 'Mathematics', 'Physics', 'Databases', 'Networks', 'Software Engineering'];
  65:   
  66:   // Multi-select filter arrays
  67:   selectedDegrees: string[] = [];
  68:   selectedSemesters: string[] = [];
  69:   selectedSubjects: string[] = [];
  70:   
  71:   // Old single select variables - keeping for compatibility
  72:   selectedDegree: string = '';
  73:   selectedSemester: string = '';
  74:   selectedSubject: string = '';
  75: 
  76:   // Dropdown control
  77:   openDropdowns = {
  78:     degree: false,
  79:     semester: false,
  80:     subject: false
  81:   };
  82:   
  83:   // --- New Tooltip control ---
  84:   showExamTooltip = false;
  85:   tooltipPosition: { top: string, left: string, transform?: string } = { top: '0px', left: '0px' };
  86:   tooltipExams: Exam[] = [];
  87:   selectedExamDateElement: HTMLElement | null = null; // Store clicked element for positioning
  88: 
  89:   // Auth modal control
  90:   showAuthModal: boolean = false;
  91:   authMode: 'login' | 'register' = 'login';
  92:   authForm = {
  93:     email: '',
  94:     password: '',
  95:     confirmPassword: ''
  96:   };
  97:   isLoggedIn: boolean = false;
  98:   currentUser: User | null = null;
  99: 
 100:   // Calendar saving
 101:   savedCalendars: SavedCalendar[] = [];
 102: 
 103:   // Notification toast
 104:   showNotification: boolean = false;
 105:   notificationMessage: string = '';
 106:   notificationType: 'success' | 'error' = 'success';
 107:   notificationTimeout: any;
 108: 
 109:   // Color theme variables
 110:   themeColors = {
 111:     text: '#111511',
 112:     background: '#f7f8f7',
 113:     primary: '#758f76',
 114:     secondary: '#b5c3c4',
 115:     accent: '#96a0aa'
 116:   };
 117: 
 118:   // Theme mode
 119:   isDarkMode: boolean = false;
 120:   private isBrowser: boolean;
 121: 
 122:   // Mock users for demonstration (in a real app, this would be in a backend database)
 123:   private users: User[] = [
 124:     { id: 1, email: 'demo@example.com', password: 'password123', name: 'John Doe', savedCalendars: [] }
 125:   ];
 126: 
 127:   // Export section toggle
 128:   showExportOptions: boolean = false;
 129: 
 130:   constructor(
 131:     private renderer: Renderer2, 
 132:     private themeService: ThemeService,
 133:     @Inject(PLATFORM_ID) private platformId: Object
 134:   ) {
 135:     this.isBrowser = isPlatformBrowser(this.platformId);
 136:     
 137:     // Mock exam data with exams in different months
 138:     this.exams = [
 139:       { id: 1, name: 'Programming Fundamentals', date: new Date(2025, 8, 15), time: '10:00', location: 'Room A1', course: 'Computer Science', subject: 'Programming', semester: 'A', notes: 'First exam of the semester' },
 140:       { id: 2, name: 'Calculus', date: new Date(2025, 8, 20), time: '15:00', location: 'Room B2', course: 'Mathematics', subject: 'Mathematics', semester: 'A', notes: 'Standard calculus exam' },
 141:       { id: 3, name: 'Physics I', date: new Date(2025, 9, 5), time: '9:00', location: 'Room C3', course: 'Engineering', subject: 'Physics', semester: 'A', notes: 'Introductory physics exam' },
 142:       { id: 4, name: 'Data Structures', date: new Date(2025, 10, 15), time: '11:00', location: 'Room A2', course: 'Computer Science', subject: 'Programming', semester: 'B', notes: 'Advanced programming concepts' },
 143:       { id: 5, name: 'Databases', date: new Date(2026, 1, 10), time: '16:00', location: 'Room A3', course: 'Computer Science', subject: 'Databases', semester: 'A', notes: 'Database management fundamentals' },
 144:       { id: 6, name: 'Computer Networks', date: new Date(2026, 3, 5), time: '12:00', location: 'Room D1', course: 'Computer Science', subject: 'Networks', semester: 'B', notes: 'Network architecture and protocols' },
 145:       { id: 7, name: 'Software Engineering', date: new Date(2026, 5, 20), time: '11:00', location: 'Room D2', course: 'Computer Science', subject: 'Software Engineering', semester: 'B', notes: 'Project management and team collaboration' }
 146:     ];
 147:     
 148:     // Mock saved calendars
 149:     this.savedCalendars = [
 150:       {
 151:         id: 1,
 152:         userId: 1,
 153:         name: 'CS Exams Only',
 154:         filters: {
 155:           degrees: ['Computer Science'],
 156:           semesters: ['A', 'B'],
 157:           subjects: ['Programming', 'Databases']
 158:         }
 159:       }
 160:     ];
 161:   }
 162: 
 163:   ngOnInit(): void {
 164:     this.generateCalendars();
 165:     this.filterExams();
 166:     this.filterMonths();
 167:     
 168:     // Only access browser APIs if running in browser
 169:     if (this.isBrowser) {
 170:       // Check for stored login
 171:       const storedUser = localStorage.getItem('currentUser');
 172:       if (storedUser) {
 173:         try {
 174:           this.currentUser = JSON.parse(storedUser);
 175:           this.isLoggedIn = true;
 176:         } catch (e) {
 177:           localStorage.removeItem('currentUser');
 178:         }
 179:       }
 180:       
 181:       // Check for stored theme preference
 182:       const storedTheme = localStorage.getItem('theme');
 183:       if (storedTheme === 'dark') {
 184:         this.isDarkMode = true;
 185:         this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
 186:       }
 187:     }
 188:     
 189:     // Subscribe to theme changes
 190:     this.themeService.darkMode$.subscribe(isDark => {
 191:       this.isDarkMode = isDark;
 192:     });
 193:   }
 194: 
 195:   // Toggle dropdown menus
 196:   toggleDropdown(dropdownName: 'degree' | 'semester' | 'subject'): void {
 197:     // Close all other dropdowns
 198:     for (const key in this.openDropdowns) {
 199:       if (key !== dropdownName) {
 200:         this.openDropdowns[key as keyof typeof this.openDropdowns] = false;
 201:       }
 202:     }
 203:     
 204:     // Toggle the selected dropdown
 205:     this.openDropdowns[dropdownName] = !this.openDropdowns[dropdownName];
 206:   }
 207: 
 208:   // Multi-select checkbox utilities
 209:   isSelected(item: string, selectedArray: string[]): boolean {
 210:     return selectedArray.indexOf(item) >= 0;
 211:   }
 212: 
 213:   toggleSelection(item: string, selectedArray: string[]): void {
 214:     const index = selectedArray.indexOf(item);
 215:     if (index >= 0) {
 216:       selectedArray.splice(index, 1); // Remove if already selected
 217:     } else {
 218:       selectedArray.push(item); // Add if not selected
 219:     }
 220:     this.updateFilters();
 221:   }
 222: 
 223:   // Generate calendar data for all months
 224:   generateCalendars(): void {
 225:     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
 226:                         'July', 'August', 'September', 'October', 'November', 'December'];
 227:     
 228:     // Initialize empty months array
 229:     this.months = [];
 230:     
 231:     // Generate for Sep 2025 to Aug 2026
 232:     for (let month = 8; month < 12; month++) {
 233:       this.months.push(this.generateMonthData(2025, month, monthNames[month]));
 234:     }
 235:     
 236:     for (let month = 0; month < 8; month++) {
 237:       this.months.push(this.generateMonthData(2026, month, monthNames[month]));
 238:     }
 239:   }
 240: 
 241:   // Generate data for a specific month
 242:   generateMonthData(year: number, month: number, monthName: string): any {
 243:     const firstDay = new Date(year, month, 1);
 244:     const daysInMonth = new Date(year, month + 1, 0).getDate();
 245:     
 246:     // Adjust starting day for Monday as first day (0 = Monday, 6 = Sunday)
 247:     let startingDay = firstDay.getDay() - 1; // Subtract 1 to make Monday (1) become 0
 248:     if (startingDay < 0) startingDay = 6; // If it was Sunday (0), make it 6 for the end of the week
 249:     
 250:     // Create weeks array
 251:     let days = [];
 252:     let week = Array(7).fill(null);
 253:     let hasAnyExam = false;
 254:     
 255:     // Fill in empty days before the first day of the month
 256:     for (let i = 0; i < startingDay; i++) {
 257:       week[i] = null;
 258:     }
 259:     
 260:     // Fill in days of the month
 261:     let dayCount = 1;
 262:     for (let i = startingDay; i < 7; i++) {
 263:       const hasExams = this.checkExamForDate(new Date(year, month, dayCount));
 264:       if (hasExams) {
 265:         hasAnyExam = true;
 266:       }
 267:       
 268:       week[i] = {
 269:         day: dayCount,
 270:         date: new Date(year, month, dayCount),
 271:         hasExams: hasExams
 272:       };
 273:       dayCount++;
 274:     }
 275:     days.push(week);
 276:     
 277:     // Fill in remaining weeks
 278:     while (dayCount <= daysInMonth) {
 279:       week = Array(7).fill(null);
 280:       for (let i = 0; i < 7 && dayCount <= daysInMonth; i++) {
 281:         const hasExams = this.checkExamForDate(new Date(year, month, dayCount));
 282:         if (hasExams) {
 283:           hasAnyExam = true;
 284:         }
 285:         
 286:         week[i] = {
 287:           day: dayCount,
 288:           date: new Date(year, month, dayCount),
 289:           hasExams: hasExams
 290:         };
 291:         dayCount++;
 292:       }
 293:       days.push(week);
 294:     }
 295:     
 296:     return {
 297:       year: year,
 298:       month: month,
 299:       monthName: monthName,
 300:       days: days,
 301:       hasExams: hasAnyExam
 302:     };
 303:   }
 304: 
 305:   // Filter months to only show those with exams
 306:   filterMonths(): void {
 307:     this.filteredMonths = this.months.filter(month => month.hasExams);
 308:   }
 309: 
 310:   // Check if there are exams on a specific date
 311:   checkExamForDate(date: Date): boolean {
 312:     return this.filteredExams.some(exam => 
 313:       exam.date.getFullYear() === date.getFullYear() &&
 314:       exam.date.getMonth() === date.getMonth() &&
 315:       exam.date.getDate() === date.getDate()
 316:     );
 317:   }
 318: 
 319:   // Get the count of exams on a specific date
 320:   getExamCountForDate(date: Date): number {
 321:     return this.filteredExams.filter(exam => 
 322:       exam.date.getFullYear() === date.getFullYear() &&
 323:       exam.date.getMonth() === date.getMonth() &&
 324:       exam.date.getDate() === date.getDate()
 325:     ).length;
 326:   }
 327: 
 328:   // Select a date to view exams (only if it has exams)
 329:   selectDate(day: any, event: MouseEvent): void {
 330:     if (!day || !day.hasExams) {
 331:       this.closeExamTooltip(); // Close any existing tooltip if clicking on empty day
 332:       return; // Do nothing if the day has no exams or is null
 333:     }
 334:     
 335:     this.selectedDate = day.date;
 336:     this.tooltipExams = this.filteredExams.filter(exam => 
 337:         exam.date.getFullYear() === this.selectedDate!.getFullYear() &&
 338:         exam.date.getMonth() === this.selectedDate!.getMonth() &&
 339:         exam.date.getDate() === this.selectedDate!.getDate()
 340:     );
 341:     
 342:     this.selectedExamDateElement = event.target as HTMLElement;
 343:     this.positionTooltip(this.selectedExamDateElement);
 344:     this.showExamTooltip = true;
 345:   }
 346:   
 347:   // Position tooltip near the clicked date element
 348:   positionTooltip(element: HTMLElement): void {
 349:     const buttonRect = element.getBoundingClientRect();
 350:     const scrollX = window.scrollX;
 351:     const scrollY = window.scrollY;
 352: 
 353:     // Default position: Above the button
 354:     let top = buttonRect.top + scrollY - 10; // 10px spacing above
 355:     let left = buttonRect.left + scrollX + (buttonRect.width / 2);
 356:     let transform = 'translate(-50%, -100%)'; // Center horizontally, move up vertically
 357: 
 358:     // Basic boundary check (simplified)
 359:     // In a real app, calculate tooltip size dynamically for perfect boundary checks
 360:     const tooltipEstimatedHeight = 100; // Estimate tooltip height
 361:     const tooltipEstimatedWidth = 250; // Estimate tooltip width
 362: 
 363:     if (buttonRect.top < tooltipEstimatedHeight) { // Not enough space above? Position below
 364:       top = buttonRect.bottom + scrollY + 10;
 365:       transform = 'translate(-50%, 0)';
 366:     }
 367: 
 368:     if (buttonRect.left + buttonRect.width/2 + tooltipEstimatedWidth/2 > window.innerWidth) { // Too close to right edge?
 369:         left = window.innerWidth + scrollX - tooltipEstimatedWidth/2 - 15; // Adjust left position
 370:         // Keep transform centered for now, might need adjustments for arrow position
 371:     }
 372:     
 373:     if (buttonRect.left + buttonRect.width/2 - tooltipEstimatedWidth/2 < 0) { // Too close to left edge?
 374:         left = tooltipEstimatedWidth/2 + scrollX + 15; // Adjust left position
 375:         // Keep transform centered for now
 376:     }
 377: 
 378:     this.tooltipPosition = {
 379:       top: `${top}px`,
 380:       left: `${left}px`,
 381:       transform: transform
 382:     };
 383:   }
 384:   
 385:   // Close tooltip
 386:   closeExamTooltip(): void {
 387:     this.showExamTooltip = false;
 388:     this.selectedDate = null;
 389:     this.selectedExamDateElement = null;
 390:     this.tooltipExams = [];
 391:   }
 392: 
 393:   // Apply filters to exams for calendar view
 394:   filterExams(): void {
 395:     this.filteredExams = this.exams.filter(exam => {
 396:       // Filter by degree (multi-select)
 397:       if (this.selectedDegrees.length > 0 && !this.selectedDegrees.includes(exam.course)) {
 398:         return false;
 399:       }
 400:       
 401:       // Filter by semester (multi-select)
 402:       if (this.selectedSemesters.length > 0 && !this.selectedSemesters.includes(exam.semester)) {
 403:         return false;
 404:       }
 405:       
 406:       // Filter by subject (multi-select)
 407:       if (this.selectedSubjects.length > 0 && !this.selectedSubjects.includes(exam.subject)) {
 408:         return false;
 409:       }
 410:       
 411:       return true;
 412:     });
 413:     
 414:     // After filtering exams, regenerate calendar data and filter months
 415:     this.generateCalendars();
 416:     this.filterMonths();
 417:     
 418:     // Also update the display exams
 419:     this.getDisplayExams();
 420:   }
 421: 
 422:   // Get exams to display in the popup
 423:   getDisplayExams(): void {
 424:     // Start with the filtered exams based on filters
 425:     this.displayExams = this.filteredExams.filter(exam => {
 426:       // If a date is selected, only show exams on that date
 427:       if (this.selectedDate) {
 428:         return exam.date.getFullYear() === this.selectedDate.getFullYear() &&
 429:                exam.date.getMonth() === this.selectedDate.getMonth() &&
 430:                exam.date.getDate() === this.selectedDate.getDate();
 431:       }
 432:       
 433:       return true;
 434:     });
 435:   }
 436: 
 437:   // Update filters
 438:   updateFilters(): void {
 439:     this.filterExams();
 440:   }
 441:   
 442:   // Handle document click to close dropdowns and tooltip when clicking outside
 443:   handleDocumentClick(event: MouseEvent): void {
 444:     const targetElement = event.target as Element;
 445: 
 446:     // Close dropdowns if click is outside the filter group headers/options
 447:     const clickedFilterHeader = targetElement.closest('.filter-header');
 448:     const clickedFilterOptions = targetElement.closest('.filter-options');
 449: 
 450:     if (!clickedFilterHeader && !clickedFilterOptions) {
 451:       // Close all dropdowns
 452:       this.openDropdowns = {
 453:         degree: false,
 454:         semester: false,
 455:         subject: false
 456:       };
 457:     }
 458:     
 459:     // Close the exam tooltip if clicking outside
 460:     const tooltipElement = document.querySelector('.exam-tooltip'); 
 461:     const clickedCalendarButton = targetElement.closest('.calendar-day-button');
 462:     if (this.showExamTooltip && tooltipElement && !tooltipElement.contains(targetElement) && !clickedCalendarButton) {
 463:       this.closeExamTooltip();
 464:     }
 465:   }
 466: 
 467:   // Authentication Methods
 468:   openAuthModal(): void {
 469:     if (this.isLoggedIn) {
 470:       // Show user account information if logged in
 471:       // For demo purpose, we'll just log out
 472:       this.logout();
 473:       return;
 474:     }
 475:     
 476:     this.authMode = 'login';
 477:     this.authForm = {
 478:       email: '',
 479:       password: '',
 480:       confirmPassword: ''
 481:     };
 482:     this.showAuthModal = true;
 483:   }
 484:   
 485:   closeAuthModal(event: MouseEvent): void {
 486:     // Only close if clicking on the overlay or close button
 487:     if (
 488:       (event.target as Element).classList.contains('modal-overlay') ||
 489:       (event.target as Element).classList.contains('close-modal-btn')
 490:     ) {
 491:       this.showAuthModal = false;
 492:     }
 493:   }
 494:   
 495:   toggleAuthMode(event: MouseEvent): void {
 496:     event.preventDefault();
 497:     this.authMode = this.authMode === 'login' ? 'register' : 'login';
 498:   }
 499:   
 500:   submitAuthForm(): void {
 501:     if (this.authMode === 'login') {
 502:       this.login();
 503:     } else {
 504:       this.register();
 505:     }
 506:   }
 507:   
 508:   login(): void {
 509:     const { email, password } = this.authForm;
 510:     
 511:     // Simple validation
 512:     if (!email || !password) {
 513:       this.showToast('Please enter both email and password.', 'error');
 514:       return;
 515:     }
 516:     
 517:     // Find user
 518:     const user = this.users.find(u => u.email === email && u.password === password);
 519:     
 520:     if (user) {
 521:       this.currentUser = user;
 522:       this.isLoggedIn = true;
 523:       if (this.isBrowser) {
 524:         localStorage.setItem('currentUser', JSON.stringify(user));
 525:       }
 526:       this.showAuthModal = false;
 527:       this.showToast('Successfully logged in!', 'success');
 528:     } else {
 529:       this.showToast('Invalid email or password.', 'error');
 530:     }
 531:   }
 532:   
 533:   register(): void {
 534:     const { email, password, confirmPassword } = this.authForm;
 535:     
 536:     // Simple validation
 537:     if (!email || !password) {
 538:       this.showToast('Please enter email and password.', 'error');
 539:       return;
 540:     }
 541:     
 542:     if (password !== confirmPassword) {
 543:       this.showToast('Passwords do not match.', 'error');
 544:       return;
 545:     }
 546:     
 547:     // Check if user already exists
 548:     const existingUser = this.users.find(u => u.email === email);
 549:     if (existingUser) {
 550:       this.showToast('Email already in use.', 'error');
 551:       return;
 552:     }
 553:     
 554:     // Create new user
 555:     const newUser: User = {
 556:       id: this.users.length + 1,
 557:       email,
 558:       password,
 559:       name: email.split('@')[0],
 560:       savedCalendars: []
 561:     };
 562:     
 563:     this.users.push(newUser);
 564:     this.currentUser = newUser;
 565:     this.isLoggedIn = true;
 566:     if (this.isBrowser) {
 567:       localStorage.setItem('currentUser', JSON.stringify(newUser));
 568:     }
 569:     this.showAuthModal = false;
 570:     this.showToast('Account created successfully!', 'success');
 571:   }
 572:   
 573:   logout(): void {
 574:     this.currentUser = null;
 575:     this.isLoggedIn = false;
 576:     if (this.isBrowser) {
 577:       localStorage.removeItem('currentUser');
 578:     }
 579:     this.showToast('You have been logged out.', 'success');
 580:   }
 581: 
 582:   // Show notification toast
 583:   showToast(message: string, type: 'success' | 'error'): void {
 584:     // Clear any existing timeout
 585:     if (this.notificationTimeout) {
 586:       clearTimeout(this.notificationTimeout);
 587:     }
 588:     
 589:     // Set message and show
 590:     this.notificationMessage = message;
 591:     this.notificationType = type;
 592:     this.showNotification = true;
 593:     
 594:     // Hide after 3 seconds
 595:     this.notificationTimeout = setTimeout(() => {
 596:       this.showNotification = false;
 597:     }, 3000);
 598:   }
 599: 
 600:   // Toggle between light and dark theme
 601:   toggleTheme(): void {
 602:     this.themeService.toggleDarkMode();
 603:   }
 604: 
 605:   // Methods for export functionality
 606:   exportToGoogleCalendar() {
 607:     if (this.filteredExams.length === 0) {
 608:       alert('No exams to export. Please adjust your filters.');
 609:       return;
 610:     }
 611: 
 612:     // Confirm if exporting many exams
 613:     if (this.filteredExams.length > 5) {
 614:       if (!confirm(`You are about to open ${this.filteredExams.length} tabs for Google Calendar. Continue?`)) {
 615:         return;
 616:       }
 617:     }
 618: 
 619:     let exportCount = 0;
 620:     
 621:     // Open tabs with staggered timing to prevent browser blocking
 622:     this.filteredExams.forEach((exam, index) => {
 623:       setTimeout(() => {
 624:         const startDate = new Date(exam.date);
 625:         // Set exam time (default to 9:00 AM if not specified)
 626:         const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
 627:         startDate.setHours(parseInt(hours), parseInt(minutes), 0);
 628:         
 629:         // End time (default to 2 hours after start)
 630:         const endDate = new Date(startDate);
 631:         endDate.setHours(endDate.getHours() + 2);
 632:         
 633:         // Format dates for Google Calendar
 634:         const startDateFormatted = this.formatDateForGoogleCalendar(startDate);
 635:         const endDateFormatted = this.formatDateForGoogleCalendar(endDate);
 636:         
 637:         // Create detailed description with exam info
 638:         const description = `Subject: ${exam.subject}\nDegree: ${exam.course}\nSemester: ${exam.semester}\nLocation: ${exam.location || 'TBD'}\nNotes: ${exam.notes || ''}`;
 639:         
 640:         // Build Google Calendar URL
 641:         const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent('Exam: ' + exam.subject)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(exam.location || '')}&sf=true`;
 642:         
 643:         window.open(url, '_blank');
 644:         exportCount++;
 645:       }, index * 300); // Stagger opening of tabs by 300ms each
 646:     });
 647: 
 648:     // Show success message
 649:     setTimeout(() => {
 650:       alert(`Exported ${exportCount} exams to Google Calendar.`);
 651:     }, this.filteredExams.length * 300 + 100);
 652:   }
 653: 
 654:   // Format date for Google Calendar URL (YYYYMMDDTHHMMSS format)
 655:   private formatDateForGoogleCalendar(date: Date): string {
 656:     return date.getFullYear().toString() +
 657:       (date.getMonth() + 1).toString().padStart(2, '0') +
 658:       date.getDate().toString().padStart(2, '0') + 
 659:       'T' + 
 660:       date.getHours().toString().padStart(2, '0') +
 661:       date.getMinutes().toString().padStart(2, '0') +
 662:       date.getSeconds().toString().padStart(2, '0');
 663:   }
 664: 
 665:   // Export to iCal format following RFC 5545 standards
 666:   exportToIcal() {
 667:     if (this.filteredExams.length === 0) {
 668:       alert('No exams to export. Please adjust your filters.');
 669:       return;
 670:     }
 671: 
 672:     try {
 673:       // Calendar header
 674:       let icalContent = [
 675:         'BEGIN:VCALENDAR',
 676:         'VERSION:2.0',
 677:         'PRODID:-//UPV//Exam Calendar//EN',
 678:         'CALSCALE:GREGORIAN',
 679:         'METHOD:PUBLISH',
 680:         'X-WR-CALNAME:UPV Exams',
 681:         'X-WR-TIMEZONE:Europe/Madrid',
 682:       ].join('\r\n');
 683: 
 684:       // Add each exam event
 685:       this.filteredExams.forEach(exam => {
 686:         const startDate = new Date(exam.date);
 687:         
 688:         // Set exam time (default to 9:00 AM if not specified)
 689:         const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
 690:         startDate.setHours(parseInt(hours), parseInt(minutes), 0);
 691:         
 692:         // End time (default to 2 hours after start)
 693:         const endDate = new Date(startDate);
 694:         endDate.setHours(endDate.getHours() + 2);
 695:         
 696:         // Create a unique ID for the event
 697:         const uid = `exam-${exam.subject.replace(/\s+/g, '-')}-${startDate.getTime()}@upv.es`;
 698:         
 699:         // Format dates for iCal (YYYYMMDDTHHMMSSZ format)
 700:         const dtStart = this.formatDateForIcal(startDate);
 701:         const dtEnd = this.formatDateForIcal(endDate);
 702:         const dtStamp = this.formatDateForIcal(new Date());
 703:         
 704:         // Create detailed description with exam info
 705:         let description = `Subject: ${exam.subject}\\nDegree: ${exam.course}\\nSemester: ${exam.semester}`;
 706:         if (exam.location) description += `\\nLocation: ${exam.location}`;
 707:         if (exam.notes) description += `\\nNotes: ${exam.notes}`;
 708:         
 709:         // Add event to calendar with line folding for long text
 710:         icalContent += '\r\n' + [
 711:           'BEGIN:VEVENT',
 712:           `UID:${uid}`,
 713:           `DTSTAMP:${dtStamp}`,
 714:           `DTSTART:${dtStart}`,
 715:           `DTEND:${dtEnd}`,
 716:           `SUMMARY:${this.foldLine('Exam: ' + exam.subject)}`,
 717:           `DESCRIPTION:${this.foldLine(description)}`,
 718:           'CATEGORIES:EXAM,UNIVERSITY',
 719:           exam.location ? `LOCATION:${this.foldLine(exam.location)}` : '',
 720:           // Add alarms (1 day and 1 hour before)
 721:           'BEGIN:VALARM',
 722:           'ACTION:DISPLAY',
 723:           'DESCRIPTION:Exam reminder - 1 day',
 724:           'TRIGGER:-P1D',
 725:           'END:VALARM',
 726:           'BEGIN:VALARM',
 727:           'ACTION:DISPLAY',
 728:           'DESCRIPTION:Exam reminder - 1 hour',
 729:           'TRIGGER:-PT1H',
 730:           'END:VALARM',
 731:           'END:VEVENT'
 732:         ].filter(line => line).join('\r\n'); // Filter out empty lines
 733:       });
 734: 
 735:       // Calendar footer
 736:       icalContent += '\r\nEND:VCALENDAR';
 737: 
 738:       // Create and download file
 739:       const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
 740:       const link = document.createElement('a');
 741:       link.href = window.URL.createObjectURL(blob);
 742:       link.download = 'upv_exams.ics';
 743:       link.click();
 744:       
 745:       // Success message
 746:       alert(`Successfully exported ${this.filteredExams.length} exams to iCal format.`);
 747:     } catch (error) {
 748:       console.error('Error exporting to iCal:', error);
 749:       alert('Failed to export calendar. Please try again later.');
 750:     }
 751:   }
 752: 
 753:   // Format date for iCal (YYYYMMDDTHHMMSSZ format)
 754:   private formatDateForIcal(date: Date): string {
 755:     return date.getUTCFullYear().toString() +
 756:       (date.getUTCMonth() + 1).toString().padStart(2, '0') +
 757:       date.getUTCDate().toString().padStart(2, '0') + 
 758:       'T' + 
 759:       date.getUTCHours().toString().padStart(2, '0') +
 760:       date.getUTCMinutes().toString().padStart(2, '0') +
 761:       date.getUTCSeconds().toString().padStart(2, '0') +
 762:       'Z';
 763:   }
 764: 
 765:   // Implement line folding for iCal (RFC 5545 section 3.1)
 766:   private foldLine(text: string): string {
 767:     if (!text) return '';
 768:     
 769:     // Escape special characters
 770:     text = text.replace(/[\\;,]/g, match => '\\' + match);
 771:     
 772:     // Implement line folding (max 75 chars per line)
 773:     let result = '';
 774:     while (text.length > 0) {
 775:       if (result.length > 0) {
 776:         result += '\r\n '; // Folded lines start with a space
 777:       }
 778:       result += text.slice(0, 75);
 779:       text = text.slice(75);
 780:     }
 781:     return result;
 782:   }
 783: 
 784:   // Save the current calendar configuration
 785:   saveCalendar(): void {
 786:     if (!this.isLoggedIn) {
 787:       this.showToast('Please log in to save your calendar.', 'error');
 788:       this.openAuthModal();
 789:       return;
 790:     }
 791:     
 792:     // Prompt for calendar name
 793:     const calendarName = prompt('Enter a name for this calendar:', 'My Calendar');
 794:     if (!calendarName) return; // User cancelled
 795:     
 796:     // Create a new saved calendar
 797:     const newCalendar: SavedCalendar = {
 798:       id: Date.now(), // Use timestamp as temporary ID
 799:       userId: this.currentUser!.id,
 800:       name: calendarName,
 801:       filters: {
 802:         degrees: [...this.selectedDegrees],
 803:         semesters: [...this.selectedSemesters],
 804:         subjects: [...this.selectedSubjects]
 805:       }
 806:     };
 807:     
 808:     // Add to user's saved calendars
 809:     if (this.currentUser) {
 810:       this.currentUser.savedCalendars.push(newCalendar);
 811:       // Update localStorage if in browser
 812:       if (this.isBrowser) {
 813:         localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
 814:       }
 815:       this.showToast(`Calendar "${calendarName}" saved successfully!`, 'success');
 816:     }
 817:   }
 818:   
 819:   // Export to Google Calendar
 820:   exportToGoogle(): void {
 821:     // Alias for exportToGoogleCalendar for HTML compatibility
 822:     this.exportToGoogleCalendar();
 823:   }
 824:   
 825:   // Export to iCal format
 826:   exportToICal(): void {
 827:     // Alias for exportToIcal for HTML compatibility
 828:     this.exportToIcal();
 829:   }
 830:   
 831:   // Open the user's saved calendars
 832:   openMyCalendar(): void {
 833:     if (!this.isLoggedIn) {
 834:       this.showToast('Please log in to view your saved calendars.', 'error');
 835:       this.openAuthModal();
 836:       return;
 837:     }
 838:     
 839:     if (!this.currentUser || this.currentUser.savedCalendars.length === 0) {
 840:       this.showToast('You have no saved calendars. Create one first!', 'error');
 841:       return;
 842:     }
 843:     
 844:     // Show a list of saved calendars
 845:     const calendarList = this.currentUser.savedCalendars.map(
 846:       (cal, index) => `${index + 1}. ${cal.name}`
 847:     ).join('\n');
 848:     
 849:     const selection = prompt(`Select a calendar to load (enter number):\n${calendarList}`);
 850:     if (!selection) return; // User cancelled
 851:     
 852:     const index = parseInt(selection) - 1;
 853:     if (isNaN(index) || index < 0 || index >= this.currentUser.savedCalendars.length) {
 854:       this.showToast('Invalid selection. Please try again.', 'error');
 855:       return;
 856:     }
 857:     
 858:     // Load the selected calendar
 859:     const calendar = this.currentUser.savedCalendars[index];
 860:     this.selectedDegrees = [...calendar.filters.degrees];
 861:     this.selectedSemesters = [...calendar.filters.semesters];
 862:     this.selectedSubjects = [...calendar.filters.subjects];
 863:     
 864:     // Update filters
 865:     this.updateFilters();
 866:     this.showToast(`Calendar "${calendar.name}" loaded successfully!`, 'success');
 867:   }
 868: 
 869:   // Toggle export options visibility
 870:   toggleExportSection(): void {
 871:     this.showExportOptions = !this.showExportOptions;
 872:   }
 873: 
 874:   // Handle adding exam to calendar
 875:   handleAddToCalendar(event: any): void {
 876:     if (!isExam(event)) {
 877:       console.error('Invalid exam data received');
 878:       return;
 879:     }
 880:     const exam = event;
 881:     
 882:     // Create a single exam array for export
 883:     const examToExport = [exam];
 884:     
 885:     // Ask user which format they prefer
 886:     const format = confirm('Would you like to export to Google Calendar?\nClick OK for Google Calendar, or Cancel for iCal download.');
 887:     
 888:     if (format) {
 889:       // Export to Google Calendar
 890:       const startDate = new Date(exam.date);
 891:       const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
 892:       startDate.setHours(parseInt(hours), parseInt(minutes), 0);
 893:       
 894:       const endDate = new Date(startDate);
 895:       endDate.setHours(endDate.getHours() + 2);
 896:       
 897:       const startDateFormatted = this.formatDateForGoogleCalendar(startDate);
 898:       const endDateFormatted = this.formatDateForGoogleCalendar(endDate);
 899:       
 900:       const description = `Subject: ${exam.subject}\nDegree: ${exam.course}\nSemester: ${exam.semester}\nLocation: ${exam.location || 'TBD'}\nNotes: ${exam.notes || ''}`;
 901:       
 902:       const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent('Exam: ' + exam.subject)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(exam.location || '')}&sf=true`;
 903:       
 904:       window.open(url, '_blank');
 905:     } else {
 906:       // Export to iCal
 907:       let icalContent = [
 908:         'BEGIN:VCALENDAR',
 909:         'VERSION:2.0',
 910:         'PRODID:-//UPV//Exam Calendar//EN',
 911:         'CALSCALE:GREGORIAN',
 912:         'METHOD:PUBLISH',
 913:         'X-WR-CALNAME:UPV Exam',
 914:         'X-WR-TIMEZONE:Europe/Madrid',
 915:       ].join('\r\n');
 916: 
 917:       const startDate = new Date(exam.date);
 918:       const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
 919:       startDate.setHours(parseInt(hours), parseInt(minutes), 0);
 920:       
 921:       const endDate = new Date(startDate);
 922:       endDate.setHours(endDate.getHours() + 2);
 923:       
 924:       const uid = `exam-${exam.subject.replace(/\s+/g, '-')}-${startDate.getTime()}@upv.es`;
 925:       
 926:       const dtStart = this.formatDateForIcal(startDate);
 927:       const dtEnd = this.formatDateForIcal(endDate);
 928:       const dtStamp = this.formatDateForIcal(new Date());
 929:       
 930:       let description = `Subject: ${exam.subject}\\nDegree: ${exam.course}\\nSemester: ${exam.semester}`;
 931:       if (exam.location) description += `\\nLocation: ${exam.location}`;
 932:       if (exam.notes) description += `\\nNotes: ${exam.notes}`;
 933:       
 934:       icalContent += '\r\n' + [
 935:         'BEGIN:VEVENT',
 936:         `UID:${uid}`,
 937:         `DTSTAMP:${dtStamp}`,
 938:         `DTSTART:${dtStart}`,
 939:         `DTEND:${dtEnd}`,
 940:         `SUMMARY:${this.foldLine('Exam: ' + exam.subject)}`,
 941:         `DESCRIPTION:${this.foldLine(description)}`,
 942:         'CATEGORIES:EXAM,UNIVERSITY',
 943:         exam.location ? `LOCATION:${this.foldLine(exam.location)}` : '',
 944:         'BEGIN:VALARM',
 945:         'ACTION:DISPLAY',
 946:         'DESCRIPTION:Exam reminder - 1 day',
 947:         'TRIGGER:-P1D',
 948:         'END:VALARM',
 949:         'BEGIN:VALARM',
 950:         'ACTION:DISPLAY',
 951:         'DESCRIPTION:Exam reminder - 1 hour',
 952:         'TRIGGER:-PT1H',
 953:         'END:VALARM',
 954:         'END:VEVENT'
 955:       ].filter(line => line).join('\r\n');
 956: 
 957:       icalContent += '\r\nEND:VCALENDAR';
 958: 
 959:       const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
 960:       const link = document.createElement('a');
 961:       link.href = window.URL.createObjectURL(blob);
 962:       link.download = `upv_exam_${exam.subject.replace(/\s+/g, '_')}.ics`;
 963:       link.click();
 964:     }
 965:   }
 966: 
 967:   // Handle sharing exam details
 968:   handleShareExam(event: any): void {
 969:     if (!isExam(event)) {
 970:       console.error('Invalid exam data received');
 971:       return;
 972:     }
 973:     const exam = event;
 974:     
 975:     // Create share text
 976:     const shareText = `UPV Exam Details:\n\n` +
 977:       `Subject: ${exam.subject}\n` +
 978:       `Date: ${new Date(exam.date).toLocaleDateString()}\n` +
 979:       `Time: ${exam.time}\n` +
 980:       `Location: ${exam.location}\n` +
 981:       `Course: ${exam.course}\n` +
 982:       `Semester: ${exam.semester}`;
 983: 
 984:     // Check if Web Share API is available
 985:     if (navigator.share) {
 986:       navigator.share({
 987:         title: 'UPV Exam Details',
 988:         text: shareText
 989:       }).catch(err => {
 990:         // Fallback to clipboard if share fails
 991:         this.copyToClipboard(shareText);
 992:       });
 993:     } else {
 994:       // Fallback to clipboard
 995:       this.copyToClipboard(shareText);
 996:     }
 997:   }
 998: 
 999:   // Helper method to copy text to clipboard
1000:   private copyToClipboard(text: string): void {
1001:     navigator.clipboard.writeText(text).then(() => {
1002:       this.showToast('Exam details copied to clipboard!', 'success');
1003:     }).catch(err => {
1004:       this.showToast('Failed to copy exam details.', 'error');
1005:     });
1006:   }
1007: 
1008:   // Method to scroll to the filters section
1009:   scrollToFilters(): void {
1010:     if (this.isBrowser) {
1011:       const element = document.getElementById('filters-section');
1012:       if (element) {
1013:         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
1014:       }
1015:     }
1016:   }
1017: }
````

## File: frontend/src/app/login/login.component.ts
````typescript
  1: import { Component, OnInit } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { FormsModule } from '@angular/forms';
  4: import { Router, ActivatedRoute, RouterLink } from '@angular/router';
  5: import { AuthService, LoginData } from '../services/auth.service';
  6: import { LoadingService } from '../services/loading.service';
  7: import { ToastService } from '../services/toast.service';
  8: 
  9: @Component({
 10:   selector: 'app-login',
 11:   standalone: true,
 12:   imports: [CommonModule, FormsModule, RouterLink],
 13:   template: `
 14:     <div class="auth-container">
 15:       <div class="auth-card">
 16:         <h2>Login</h2>
 17:         
 18:         <div *ngIf="errorMessage" class="error-message">
 19:           {{ errorMessage }}
 20:         </div>
 21:         
 22:         <form (ngSubmit)="onSubmit()" (keydown.enter)="onSubmit()">
 23:           <div class="form-group">
 24:             <label for="email">Email</label>
 25:             <input 
 26:               type="email" 
 27:               id="email" 
 28:               name="email" 
 29:               [(ngModel)]="loginData.email" 
 30:               required 
 31:               autocomplete="email"
 32:               [attr.aria-invalid]="!isValidEmail && loginData.email ? true : null"
 33:             >
 34:             <small *ngIf="!isValidEmail && loginData.email" class="validation-error">
 35:               Please enter a valid email address
 36:             </small>
 37:           </div>
 38:           
 39:           <div class="form-group">
 40:             <label for="password">Password</label>
 41:             <input 
 42:               type="password" 
 43:               id="password" 
 44:               name="password" 
 45:               [(ngModel)]="loginData.password" 
 46:               required 
 47:               autocomplete="current-password"
 48:             >
 49:           </div>
 50:           
 51:           <div class="form-actions">
 52:             <button 
 53:               type="submit" 
 54:               [disabled]="isLoading || !loginData.email || !loginData.password || !isValidEmail"
 55:               aria-live="polite"
 56:             >
 57:               {{ isLoading ? 'Logging in...' : 'Login' }}
 58:             </button>
 59:           </div>
 60:         </form>
 61:         
 62:         <p class="auth-switch">
 63:           Don't have an account? <a routerLink="/register">Register</a>
 64:         </p>
 65:       </div>
 66:     </div>
 67:   `,
 68:   styles: [`
 69:     .auth-container {
 70:       display: flex;
 71:       justify-content: center;
 72:       align-items: center;
 73:       min-height: 100vh;
 74:       background-color: #f5f5f5;
 75:     }
 76:     
 77:     .auth-card {
 78:       background: white;
 79:       border-radius: 8px;
 80:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 81:       padding: 2rem;
 82:       width: 100%;
 83:       max-width: 400px;
 84:     }
 85:     
 86:     h2 {
 87:       margin-top: 0;
 88:       color: #758f76;
 89:       text-align: center;
 90:       margin-bottom: 1.5rem;
 91:     }
 92:     
 93:     .form-group {
 94:       margin-bottom: 1rem;
 95:     }
 96:     
 97:     label {
 98:       display: block;
 99:       margin-bottom: 0.5rem;
100:       font-weight: 500;
101:     }
102:     
103:     input {
104:       width: 100%;
105:       padding: 0.75rem;
106:       border: 1px solid #ccc;
107:       border-radius: 4px;
108:       font-size: 1rem;
109:     }
110:     
111:     input[aria-invalid="true"] {
112:       border-color: #f44336;
113:     }
114:     
115:     .validation-error {
116:       color: #f44336;
117:       font-size: 0.875rem;
118:       margin-top: 0.25rem;
119:       display: block;
120:     }
121:     
122:     .form-actions {
123:       margin-top: 1.5rem;
124:     }
125:     
126:     button {
127:       background-color: #758f76;
128:       color: white;
129:       border: none;
130:       border-radius: 4px;
131:       padding: 0.75rem 1rem;
132:       font-size: 1rem;
133:       cursor: pointer;
134:       width: 100%;
135:     }
136:     
137:     button:hover {
138:       background-color: #657a66;
139:     }
140:     
141:     button:disabled {
142:       background-color: #a5b5a6;
143:       cursor: not-allowed;
144:     }
145:     
146:     .error-message {
147:       background-color: #f8d7da;
148:       color: #721c24;
149:       padding: 0.75rem;
150:       border-radius: 4px;
151:       margin-bottom: 1rem;
152:     }
153:     
154:     .auth-switch {
155:       text-align: center;
156:       margin-top: 1.5rem;
157:       margin-bottom: 0;
158:     }
159:     
160:     a {
161:       color: #758f76;
162:       text-decoration: none;
163:       font-weight: 500;
164:     }
165:     
166:     a:hover {
167:       text-decoration: underline;
168:     }
169:   `]
170: })
171: export class LoginComponent implements OnInit {
172:   loginData: LoginData = {
173:     email: '',
174:     password: ''
175:   };
176:   
177:   isLoading = false;
178:   errorMessage = '';
179:   returnUrl = '/';
180:   isValidEmail = true;
181:   
182:   // Email validation regex
183:   private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
184:   
185:   constructor(
186:     private authService: AuthService,
187:     private router: Router,
188:     private route: ActivatedRoute,
189:     private loadingService: LoadingService,
190:     private toastService: ToastService
191:   ) {}
192:   
193:   ngOnInit(): void {
194:     // Get return URL from route parameters or default to '/'
195:     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
196:     
197:     // If already logged in, redirect to return URL
198:     if (this.authService.isLoggedIn()) {
199:       this.router.navigateByUrl(this.returnUrl);
200:     }
201:   }
202:   
203:   onSubmit(): void {
204:     // Validate form
205:     if (!this.validateForm()) {
206:       return;
207:     }
208:     
209:     // Set loading state
210:     this.isLoading = true;
211:     this.errorMessage = '';
212:     this.loadingService.show('login', 'Logging in...');
213:     
214:     // Attempt to log in
215:     this.authService.login(this.loginData).subscribe({
216:       next: () => {
217:         this.loadingService.hide('login');
218:         this.isLoading = false;
219:         
220:         // Show success toast
221:         this.toastService.success('Successfully logged in!');
222:         
223:         // Navigate to return URL on success
224:         this.router.navigateByUrl(this.returnUrl);
225:       },
226:       error: (error) => {
227:         this.loadingService.hide('login');
228:         this.isLoading = false;
229:         this.errorMessage = error.message || 'Failed to log in. Please check your credentials and try again.';
230:         
231:         // Show error toast
232:         this.toastService.error(this.errorMessage);
233:       }
234:     });
235:   }
236:   
237:   validateForm(): boolean {
238:     // Reset error message
239:     this.errorMessage = '';
240:     
241:     // Check if fields are filled
242:     if (!this.loginData.email || !this.loginData.password) {
243:       this.errorMessage = 'Please enter both email and password';
244:       return false;
245:     }
246:     
247:     // Validate email format
248:     this.isValidEmail = this.emailRegex.test(this.loginData.email);
249:     if (!this.isValidEmail) {
250:       this.errorMessage = 'Please enter a valid email address';
251:       return false;
252:     }
253:     
254:     return true;
255:   }
256: }
````

## File: frontend/src/app/register/register.component.ts
````typescript
  1: import { Component } from '@angular/core';
  2: import { CommonModule } from '@angular/common';
  3: import { FormsModule } from '@angular/forms';
  4: import { Router } from '@angular/router';
  5: import { AuthService, RegisterData } from '../services/auth.service';
  6: 
  7: @Component({
  8:   selector: 'app-register',
  9:   standalone: true,
 10:   imports: [CommonModule, FormsModule],
 11:   template: `
 12:     <div class="auth-container">
 13:       <div class="auth-card">
 14:         <h2>Register</h2>
 15:         
 16:         <div *ngIf="errorMessage" class="error-message">
 17:           {{ errorMessage }}
 18:         </div>
 19:         
 20:         <form (ngSubmit)="onSubmit()">
 21:           <div class="form-group">
 22:             <label for="name">Name</label>
 23:             <input 
 24:               type="text" 
 25:               id="name" 
 26:               name="name" 
 27:               [(ngModel)]="registerData.name" 
 28:               required
 29:               autocomplete="name"
 30:             >
 31:           </div>
 32:           
 33:           <div class="form-group">
 34:             <label for="email">Email</label>
 35:             <input 
 36:               type="email" 
 37:               id="email" 
 38:               name="email" 
 39:               [(ngModel)]="registerData.email" 
 40:               required
 41:               autocomplete="email"
 42:             >
 43:           </div>
 44:           
 45:           <div class="form-group">
 46:             <label for="password">Password</label>
 47:             <input 
 48:               type="password" 
 49:               id="password" 
 50:               name="password" 
 51:               [(ngModel)]="registerData.password" 
 52:               required
 53:               minlength="6"
 54:               autocomplete="new-password"
 55:             >
 56:             <small>Password must be at least 6 characters long</small>
 57:           </div>
 58:           
 59:           <div class="form-group">
 60:             <label for="confirmPassword">Confirm Password</label>
 61:             <input 
 62:               type="password" 
 63:               id="confirmPassword" 
 64:               name="confirmPassword" 
 65:               [(ngModel)]="confirmPassword" 
 66:               required
 67:               autocomplete="new-password"
 68:             >
 69:           </div>
 70:           
 71:           <div class="form-actions">
 72:             <button type="submit" [disabled]="isLoading">
 73:               {{ isLoading ? 'Registering...' : 'Register' }}
 74:             </button>
 75:           </div>
 76:         </form>
 77:         
 78:         <p class="auth-switch">
 79:           Already have an account? <a routerLink="/login">Login</a>
 80:         </p>
 81:       </div>
 82:     </div>
 83:   `,
 84:   styles: [`
 85:     .auth-container {
 86:       display: flex;
 87:       justify-content: center;
 88:       align-items: center;
 89:       min-height: 100vh;
 90:       background-color: #f5f5f5;
 91:     }
 92:     
 93:     .auth-card {
 94:       background: white;
 95:       border-radius: 8px;
 96:       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 97:       padding: 2rem;
 98:       width: 100%;
 99:       max-width: 400px;
100:     }
101:     
102:     h2 {
103:       margin-top: 0;
104:       color: #758f76;
105:       text-align: center;
106:       margin-bottom: 1.5rem;
107:     }
108:     
109:     .form-group {
110:       margin-bottom: 1rem;
111:     }
112:     
113:     label {
114:       display: block;
115:       margin-bottom: 0.5rem;
116:       font-weight: 500;
117:     }
118:     
119:     input {
120:       width: 100%;
121:       padding: 0.75rem;
122:       border: 1px solid #ccc;
123:       border-radius: 4px;
124:       font-size: 1rem;
125:     }
126:     
127:     small {
128:       display: block;
129:       margin-top: 0.25rem;
130:       color: #666;
131:     }
132:     
133:     .form-actions {
134:       margin-top: 1.5rem;
135:     }
136:     
137:     button {
138:       background-color: #758f76;
139:       color: white;
140:       border: none;
141:       border-radius: 4px;
142:       padding: 0.75rem 1rem;
143:       font-size: 1rem;
144:       cursor: pointer;
145:       width: 100%;
146:     }
147:     
148:     button:hover {
149:       background-color: #657a66;
150:     }
151:     
152:     button:disabled {
153:       background-color: #a5b5a6;
154:       cursor: not-allowed;
155:     }
156:     
157:     .error-message {
158:       background-color: #f8d7da;
159:       color: #721c24;
160:       padding: 0.75rem;
161:       border-radius: 4px;
162:       margin-bottom: 1rem;
163:     }
164:     
165:     .auth-switch {
166:       text-align: center;
167:       margin-top: 1.5rem;
168:       margin-bottom: 0;
169:     }
170:     
171:     a {
172:       color: #758f76;
173:       text-decoration: none;
174:       font-weight: 500;
175:     }
176:     
177:     a:hover {
178:       text-decoration: underline;
179:     }
180:   `]
181: })
182: export class RegisterComponent {
183:   registerData: RegisterData = {
184:     name: '',
185:     email: '',
186:     password: ''
187:   };
188:   
189:   confirmPassword = '';
190:   isLoading = false;
191:   errorMessage = '';
192:   
193:   constructor(
194:     private authService: AuthService,
195:     private router: Router
196:   ) {}
197:   
198:   onSubmit(): void {
199:     // Reset error message
200:     this.errorMessage = '';
201:     
202:     // Validate form
203:     if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
204:       this.errorMessage = 'Please fill in all fields';
205:       return;
206:     }
207:     
208:     if (this.registerData.password.length < 6) {
209:       this.errorMessage = 'Password must be at least 6 characters long';
210:       return;
211:     }
212:     
213:     if (this.registerData.password !== this.confirmPassword) {
214:       this.errorMessage = 'Passwords do not match';
215:       return;
216:     }
217:     
218:     // Set loading state
219:     this.isLoading = true;
220:     
221:     // Attempt to register
222:     this.authService.register(this.registerData).subscribe({
223:       next: () => {
224:         // Navigate to home page on success
225:         this.router.navigate(['/']);
226:       },
227:       error: (error) => {
228:         this.isLoading = false;
229:         this.errorMessage = error.message || 'Registration failed. Please try again later.';
230:       }
231:     });
232:   }
233: }
````

## File: frontend/src/app/services/admin.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { HttpClient } from '@angular/common/http';
 3: import { Observable, catchError, throwError } from 'rxjs';
 4: import { environment } from '../../environments/environment';
 5: 
 6: export interface ExamStats {
 7:   totalExams: number;
 8:   totalSubjects: number;
 9:   totalDegrees: number;
10:   lastUpdated: string;
11: }
12: 
13: export interface ImportResult {
14:   importedExams: number;
15:   updatedExams: number;
16:   errors: string[];
17: }
18: 
19: @Injectable({
20:   providedIn: 'root'
21: })
22: export class AdminService {
23:   private apiUrl = environment.apiUrl + '/admin';
24: 
25:   constructor(private http: HttpClient) { }
26: 
27:   // Get exam statistics
28:   getExamStats(): Observable<ExamStats> {
29:     return this.http.get<ExamStats>(`${this.apiUrl}/stats`)
30:       .pipe(
31:         catchError(error => {
32:           return throwError(() => new Error(error.error?.message || 'Failed to fetch exam statistics'));
33:         })
34:       );
35:   }
36: 
37:   // Manually trigger exam data import
38:   importExamData(): Observable<ImportResult> {
39:     return this.http.post<ImportResult>(`${this.apiUrl}/import-exams`, {})
40:       .pipe(
41:         catchError(error => {
42:           return throwError(() => new Error(error.error?.message || 'Failed to import exam data'));
43:         })
44:       );
45:   }
46: 
47:   // Delete an exam by ID
48:   deleteExam(examId: string): Observable<{ message: string }> {
49:     return this.http.delete<{ message: string }>(`${this.apiUrl}/exams/${examId}`)
50:       .pipe(
51:         catchError(error => {
52:           return throwError(() => new Error(error.error?.message || 'Failed to delete exam'));
53:         })
54:       );
55:   }
56: 
57:   // Edit an exam
58:   updateExam(examId: string, examData: any): Observable<any> {
59:     return this.http.put<any>(`${this.apiUrl}/exams/${examId}`, examData)
60:       .pipe(
61:         catchError(error => {
62:           return throwError(() => new Error(error.error?.message || 'Failed to update exam'));
63:         })
64:       );
65:   }
66: 
67:   // Create a new exam
68:   createExam(examData: any): Observable<any> {
69:     return this.http.post<any>(`${this.apiUrl}/exams`, examData)
70:       .pipe(
71:         catchError(error => {
72:           return throwError(() => new Error(error.error?.message || 'Failed to create exam'));
73:         })
74:       );
75:   }
76: }
````

## File: frontend/src/app/services/auth.service.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { HttpClient } from '@angular/common/http';
  3: import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
  4: import { Router } from '@angular/router';
  5: import { environment } from '../../environments/environment';
  6: 
  7: export interface User {
  8:   _id: string;
  9:   name: string;
 10:   email: string;
 11:   savedCalendars: SavedCalendar[];
 12:   token: string;
 13: }
 14: 
 15: export interface TokenResponse {
 16:   token: string;
 17: }
 18: 
 19: export interface SavedCalendar {
 20:   _id: string;
 21:   name: string;
 22:   description?: string;
 23:   filters: {
 24:     degrees: string[];
 25:     semesters: string[];
 26:     subjects: string[];
 27:   };
 28:   createdAt: Date;
 29: }
 30: 
 31: export interface LoginData {
 32:   email: string;
 33:   password: string;
 34: }
 35: 
 36: export interface RegisterData {
 37:   name: string;
 38:   email: string;
 39:   password: string;
 40: }
 41: 
 42: @Injectable({
 43:   providedIn: 'root'
 44: })
 45: export class AuthService {
 46:   private apiUrl = environment.apiUrl + '/auth';
 47:   private userSubject = new BehaviorSubject<User | null>(null);
 48:   public user$ = this.userSubject.asObservable();
 49:   
 50:   constructor(
 51:     private http: HttpClient,
 52:     private router: Router
 53:   ) {
 54:     this.loadUserFromStorage();
 55:   }
 56:   
 57:   // Load user from localStorage on service initialization
 58:   private loadUserFromStorage(): void {
 59:     const userJson = localStorage.getItem('user');
 60:     if (userJson) {
 61:       try {
 62:         const user = JSON.parse(userJson);
 63:         this.userSubject.next(user);
 64:       } catch (error) {
 65:         console.error('Error parsing user from localStorage:', error);
 66:         localStorage.removeItem('user');
 67:       }
 68:     }
 69:   }
 70:   
 71:   // Register new user
 72:   register(userData: RegisterData): Observable<User> {
 73:     return this.http.post<User>(`${this.apiUrl}/register`, userData)
 74:       .pipe(
 75:         tap(user => {
 76:           this.storeUserData(user);
 77:         }),
 78:         catchError(error => {
 79:           return throwError(() => new Error(error.error?.message || 'Registration failed'));
 80:         })
 81:       );
 82:   }
 83:   
 84:   // Login user
 85:   login(loginData: LoginData): Observable<User> {
 86:     return this.http.post<User>(`${this.apiUrl}/login`, loginData)
 87:       .pipe(
 88:         tap(user => {
 89:           this.storeUserData(user);
 90:         }),
 91:         catchError(error => {
 92:           return throwError(() => new Error(error.error?.message || 'Login failed'));
 93:         })
 94:       );
 95:   }
 96:   
 97:   // Store user data in localStorage and update BehaviorSubject
 98:   private storeUserData(user: User): void {
 99:     localStorage.setItem('user', JSON.stringify(user));
100:     this.userSubject.next(user);
101:   }
102:   
103:   // Logout user
104:   logout(): void {
105:     localStorage.removeItem('user');
106:     this.userSubject.next(null);
107:     this.router.navigate(['/login']);
108:   }
109:   
110:   // Get current user
111:   getCurrentUser(): User | null {
112:     return this.userSubject.value;
113:   }
114:   
115:   // Check if user is logged in
116:   isLoggedIn(): boolean {
117:     return !!this.userSubject.value;
118:   }
119:   
120:   // Get token
121:   getToken(): string | null {
122:     return this.userSubject.value?.token || null;
123:   }
124:   
125:   // Refresh token
126:   refreshToken(): Observable<TokenResponse> {
127:     return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, {})
128:       .pipe(
129:         tap(response => {
130:           // Update token in user object
131:           const user = this.userSubject.value;
132:           if (user) {
133:             user.token = response.token;
134:             this.storeUserData(user);
135:           }
136:         }),
137:         catchError(error => {
138:           // Clear user data if refresh fails
139:           this.logout();
140:           return throwError(() => new Error(error.error?.message || 'Token refresh failed'));
141:         })
142:       );
143:   }
144:   
145:   // Get user profile
146:   getUserProfile(): Observable<User> {
147:     return this.http.get<User>(`${this.apiUrl}/profile`)
148:       .pipe(
149:         catchError(error => {
150:           return throwError(() => new Error(error.error?.message || 'Failed to get user profile'));
151:         })
152:       );
153:   }
154:   
155:   // Save calendar
156:   saveCalendar(calendar: { name: string, filters: any }): Observable<SavedCalendar[]> {
157:     return this.http.post<SavedCalendar[]>(`${this.apiUrl}/calendar`, calendar)
158:       .pipe(
159:         tap(calendars => {
160:           // Update the user's saved calendars in local storage
161:           const user = this.userSubject.value;
162:           if (user) {
163:             user.savedCalendars = calendars;
164:             this.storeUserData(user);
165:           }
166:         }),
167:         catchError(error => {
168:           return throwError(() => new Error(error.error?.message || 'Failed to save calendar'));
169:         })
170:       );
171:   }
172:   
173:   // Delete calendar
174:   deleteCalendar(calendarId: string): Observable<SavedCalendar[]> {
175:     return this.http.delete<SavedCalendar[]>(`${this.apiUrl}/calendar/${calendarId}`)
176:       .pipe(
177:         tap(calendars => {
178:           // Update the user's saved calendars in local storage
179:           const user = this.userSubject.value;
180:           if (user) {
181:             user.savedCalendars = calendars;
182:             this.storeUserData(user);
183:           }
184:         }),
185:         catchError(error => {
186:           return throwError(() => new Error(error.error?.message || 'Failed to delete calendar'));
187:         })
188:       );
189:   }
190: }
````

## File: frontend/src/app/services/calendar.service.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { HttpClient } from '@angular/common/http';
  3: import { Observable, throwError } from 'rxjs';
  4: import { catchError } from 'rxjs/operators';
  5: import { AuthService } from './auth.service';
  6: 
  7: export interface SavedCalendar {
  8:   id: number;
  9:   user_id: number;
 10:   name: string;
 11:   degrees: string[];
 12:   semesters: string[];
 13:   subjects: string[];
 14:   created_at: string;
 15:   updated_at: string;
 16: }
 17: 
 18: @Injectable({
 19:   providedIn: 'root'
 20: })
 21: export class CalendarService {
 22:   private apiUrl = 'http://localhost:3000/api/calendars';
 23: 
 24:   constructor(
 25:     private http: HttpClient,
 26:     private authService: AuthService
 27:   ) {}
 28: 
 29:   // Get all saved calendars for the current user
 30:   getUserCalendars(): Observable<SavedCalendar[]> {
 31:     const userId = this.authService.currentUserId;
 32:     
 33:     if (!userId) {
 34:       return throwError(() => new Error('User not authenticated'));
 35:     }
 36:     
 37:     return this.http.get<SavedCalendar[]>(`${this.apiUrl}?userId=${userId}`)
 38:       .pipe(
 39:         catchError(error => {
 40:           console.error('Error fetching calendars:', error);
 41:           return throwError(() => new Error('Failed to load calendars. Please try again.'));
 42:         })
 43:       );
 44:   }
 45: 
 46:   // Get a specific calendar by ID
 47:   getCalendar(id: number): Observable<SavedCalendar> {
 48:     const userId = this.authService.currentUserId;
 49:     
 50:     if (!userId) {
 51:       return throwError(() => new Error('User not authenticated'));
 52:     }
 53:     
 54:     return this.http.get<SavedCalendar>(`${this.apiUrl}/${id}?userId=${userId}`)
 55:       .pipe(
 56:         catchError(error => {
 57:           console.error(`Error fetching calendar ${id}:`, error);
 58:           return throwError(() => new Error('Failed to load calendar. Please try again.'));
 59:         })
 60:       );
 61:   }
 62: 
 63:   // Save a new calendar
 64:   saveCalendar(name: string, degrees: string[], semesters: string[], subjects: string[]): Observable<SavedCalendar> {
 65:     const userId = this.authService.currentUserId;
 66:     
 67:     if (!userId) {
 68:       return throwError(() => new Error('User not authenticated'));
 69:     }
 70:     
 71:     return this.http.post<SavedCalendar>(this.apiUrl, {
 72:       userId,
 73:       name,
 74:       degrees,
 75:       semesters,
 76:       subjects
 77:     }).pipe(
 78:       catchError(error => {
 79:         console.error('Error saving calendar:', error);
 80:         return throwError(() => new Error('Failed to save calendar. Please try again.'));
 81:       })
 82:     );
 83:   }
 84: 
 85:   // Delete a calendar
 86:   deleteCalendar(id: number): Observable<any> {
 87:     const userId = this.authService.currentUserId;
 88:     
 89:     if (!userId) {
 90:       return throwError(() => new Error('User not authenticated'));
 91:     }
 92:     
 93:     return this.http.delete(`${this.apiUrl}/${id}?userId=${userId}`)
 94:       .pipe(
 95:         catchError(error => {
 96:           console.error(`Error deleting calendar ${id}:`, error);
 97:           return throwError(() => new Error('Failed to delete calendar. Please try again.'));
 98:         })
 99:       );
100:   }
101: }
````

## File: frontend/src/app/services/exam.service.ts
````typescript
  1: import { Injectable } from '@angular/core';
  2: import { HttpClient, HttpParams } from '@angular/common/http';
  3: import { Observable, catchError, throwError } from 'rxjs';
  4: import { environment } from '../../environments/environment';
  5: 
  6: export interface Exam {
  7:   _id: string;
  8:   subject: string;
  9:   degree: string;
 10:   semester: number;
 11:   date: Date;
 12:   startTime: string;
 13:   endTime: string;
 14:   location: string;
 15:   professor?: string;
 16:   notes?: string;
 17:   createdAt: Date;
 18: }
 19: 
 20: export interface FilterOptions {
 21:   degrees: string[];
 22:   semesters: number[];
 23:   subjects: string[];
 24: }
 25: 
 26: @Injectable({
 27:   providedIn: 'root'
 28: })
 29: export class ExamService {
 30:   private apiUrl = environment.apiUrl + '/exams';
 31:   
 32:   constructor(private http: HttpClient) {}
 33:   
 34:   // Get all exams (with optional filters)
 35:   getExams(filters?: {
 36:     degree?: string;
 37:     semester?: number;
 38:     subject?: string;
 39:     startDate?: Date;
 40:     endDate?: Date;
 41:   }): Observable<Exam[]> {
 42:     let params = new HttpParams();
 43:     
 44:     // Add filters to params if they exist
 45:     if (filters) {
 46:       if (filters.degree) params = params.append('degree', filters.degree);
 47:       if (filters.semester) params = params.append('semester', filters.semester.toString());
 48:       if (filters.subject) params = params.append('subject', filters.subject);
 49:       if (filters.startDate) params = params.append('startDate', filters.startDate.toISOString());
 50:       if (filters.endDate) params = params.append('endDate', filters.endDate.toISOString());
 51:     }
 52:     
 53:     return this.http.get<Exam[]>(this.apiUrl, { params })
 54:       .pipe(
 55:         catchError(error => {
 56:           return throwError(() => new Error(error.error?.message || 'Failed to fetch exams'));
 57:         })
 58:       );
 59:   }
 60:   
 61:   // Get exam by ID
 62:   getExamById(id: string): Observable<Exam> {
 63:     return this.http.get<Exam>(`${this.apiUrl}/${id}`)
 64:       .pipe(
 65:         catchError(error => {
 66:           return throwError(() => new Error(error.error?.message || 'Failed to fetch exam'));
 67:         })
 68:       );
 69:   }
 70:   
 71:   // Get filter options (degrees, semesters, subjects)
 72:   getFilterOptions(): Observable<FilterOptions> {
 73:     return this.http.get<FilterOptions>(`${this.apiUrl}/filters`)
 74:       .pipe(
 75:         catchError(error => {
 76:           return throwError(() => new Error(error.error?.message || 'Failed to fetch filter options'));
 77:         })
 78:       );
 79:   }
 80:   
 81:   // Admin functions (these would be protected by auth guard in a real app)
 82:   
 83:   // Create exam
 84:   createExam(examData: Omit<Exam, '_id' | 'createdAt'>): Observable<Exam> {
 85:     return this.http.post<Exam>(this.apiUrl, examData)
 86:       .pipe(
 87:         catchError(error => {
 88:           return throwError(() => new Error(error.error?.message || 'Failed to create exam'));
 89:         })
 90:       );
 91:   }
 92:   
 93:   // Update exam
 94:   updateExam(id: string, examData: Partial<Exam>): Observable<Exam> {
 95:     return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData)
 96:       .pipe(
 97:         catchError(error => {
 98:           return throwError(() => new Error(error.error?.message || 'Failed to update exam'));
 99:         })
100:       );
101:   }
102:   
103:   // Delete exam
104:   deleteExam(id: string): Observable<{ message: string }> {
105:     return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
106:       .pipe(
107:         catchError(error => {
108:           return throwError(() => new Error(error.error?.message || 'Failed to delete exam'));
109:         })
110:       );
111:   }
112: }
````

## File: frontend/src/app/services/loading.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { BehaviorSubject, Observable } from 'rxjs';
 3: 
 4: @Injectable({
 5:   providedIn: 'root'
 6: })
 7: export class LoadingService {
 8:   private loadingSubject = new BehaviorSubject<boolean>(false);
 9:   private loadingMap = new Map<string, boolean>();
10:   private messageSubject = new BehaviorSubject<string>('');
11: 
12:   constructor() { }
13: 
14:   // Get loading state as observable
15:   get loading$(): Observable<boolean> {
16:     return this.loadingSubject.asObservable();
17:   }
18: 
19:   // Get loading message as observable
20:   get message$(): Observable<string> {
21:     return this.messageSubject.asObservable();
22:   }
23: 
24:   // Show loading with an optional task identifier and message
25:   show(taskId: string = 'global', message: string = ''): void {
26:     this.loadingMap.set(taskId, true);
27:     this.updateLoadingState();
28:     
29:     if (message) {
30:       this.messageSubject.next(message);
31:     }
32:   }
33: 
34:   // Hide loading for a specific task
35:   hide(taskId: string = 'global'): void {
36:     this.loadingMap.delete(taskId);
37:     this.updateLoadingState();
38:     
39:     // Clear message if no more loading tasks
40:     if (this.loadingMap.size === 0) {
41:       this.messageSubject.next('');
42:     }
43:   }
44: 
45:   // Check if a specific task is loading
46:   isLoading(taskId: string = 'global'): boolean {
47:     return this.loadingMap.has(taskId);
48:   }
49: 
50:   // Private method to update the loading state based on the map
51:   private updateLoadingState(): void {
52:     this.loadingSubject.next(this.loadingMap.size > 0);
53:   }
54: }
````

## File: frontend/src/app/services/theme.service.ts
````typescript
 1: import { Injectable, Renderer2, RendererFactory2, PLATFORM_ID, Inject } from '@angular/core';
 2: import { BehaviorSubject, Observable } from 'rxjs';
 3: import { isPlatformBrowser } from '@angular/common';
 4: 
 5: @Injectable({
 6:   providedIn: 'root'
 7: })
 8: export class ThemeService {
 9:   private renderer: Renderer2;
10:   private darkMode = new BehaviorSubject<boolean>(true);
11:   public darkMode$: Observable<boolean> = this.darkMode.asObservable();
12:   private isBrowser: boolean;
13: 
14:   constructor(
15:     rendererFactory: RendererFactory2,
16:     @Inject(PLATFORM_ID) private platformId: Object
17:   ) {
18:     this.renderer = rendererFactory.createRenderer(null, null);
19:     this.isBrowser = isPlatformBrowser(this.platformId);
20:     
21:     // Only access browser APIs if running in browser
22:     if (this.isBrowser) {
23:       // Check for stored theme preference
24:       const storedTheme = localStorage.getItem('theme');
25:       
26:       if (!storedTheme) {
27:         // If no stored preference, use dark mode as default
28:         this.setDarkMode(true);
29:       } else {
30:         // Otherwise respect stored preference
31:         this.setDarkMode(storedTheme === 'dark');
32:       }
33:       
34:       // Listen for system preference changes
35:       window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
36:         if (!localStorage.getItem('theme')) {
37:           this.setDarkMode(e.matches);
38:         }
39:       });
40:     } else {
41:       // In SSR, default to dark mode
42:       this.setDarkMode(true);
43:     }
44:   }
45: 
46:   /**
47:    * Toggle between dark and light mode
48:    */
49:   public toggleDarkMode(): void {
50:     this.setDarkMode(!this.darkMode.value);
51:   }
52:   
53:   /**
54:    * Set dark mode state
55:    */
56:   private setDarkMode(isDark: boolean): void {
57:     // Update observable state
58:     this.darkMode.next(isDark);
59:     
60:     // Apply theme class to HTML element
61:     if (this.isBrowser) {
62:       if (isDark) {
63:         this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
64:         localStorage.setItem('theme', 'dark');
65:       } else {
66:         this.renderer.removeAttribute(document.documentElement, 'data-theme');
67:         localStorage.setItem('theme', 'light');
68:       }
69:     }
70:   }
71: }
````

## File: frontend/src/app/services/toast.service.spec.ts
````typescript
  1: import { TestBed } from '@angular/core/testing';
  2: import { ToastService } from './toast.service';
  3: import { Toast } from '../components/toast-notification/toast-notification.component';
  4: 
  5: describe('ToastService', () => {
  6:   let service: ToastService;
  7: 
  8:   beforeEach(() => {
  9:     TestBed.configureTestingModule({});
 10:     service = TestBed.inject(ToastService);
 11:   });
 12: 
 13:   it('should be created', () => {
 14:     expect(service).toBeTruthy();
 15:   });
 16: 
 17:   it('should start with empty toasts array', (done) => {
 18:     service.toasts$.subscribe(toasts => {
 19:       expect(toasts).toEqual([]);
 20:       done();
 21:     });
 22:   });
 23: 
 24:   it('should add success toast with correct type', (done) => {
 25:     service.success('Success message');
 26:     
 27:     service.toasts$.subscribe(toasts => {
 28:       expect(toasts.length).toBe(1);
 29:       expect(toasts[0].type).toBe('success');
 30:       expect(toasts[0].message).toBe('Success message');
 31:       expect(toasts[0].timeout).toBe(5000);
 32:       done();
 33:     });
 34:   });
 35: 
 36:   it('should add error toast with correct type and longer timeout', (done) => {
 37:     service.error('Error message');
 38:     
 39:     service.toasts$.subscribe(toasts => {
 40:       expect(toasts.length).toBe(1);
 41:       expect(toasts[0].type).toBe('error');
 42:       expect(toasts[0].message).toBe('Error message');
 43:       expect(toasts[0].timeout).toBe(8000);
 44:       done();
 45:     });
 46:   });
 47: 
 48:   it('should add info toast with correct type', (done) => {
 49:     service.info('Info message');
 50:     
 51:     service.toasts$.subscribe(toasts => {
 52:       expect(toasts.length).toBe(1);
 53:       expect(toasts[0].type).toBe('info');
 54:       expect(toasts[0].message).toBe('Info message');
 55:       done();
 56:     });
 57:   });
 58: 
 59:   it('should add warning toast with correct type', (done) => {
 60:     service.warning('Warning message');
 61:     
 62:     service.toasts$.subscribe(toasts => {
 63:       expect(toasts.length).toBe(1);
 64:       expect(toasts[0].type).toBe('warning');
 65:       expect(toasts[0].message).toBe('Warning message');
 66:       done();
 67:     });
 68:   });
 69: 
 70:   it('should remove toast by id', (done) => {
 71:     // Add two toasts
 72:     service.success('First toast');
 73:     service.error('Second toast');
 74:     
 75:     // Get the first toast id
 76:     let firstToastId: number;
 77:     service.toasts$.subscribe(toasts => {
 78:       if (toasts.length === 2) {
 79:         firstToastId = toasts[0].id;
 80:         
 81:         // Remove the first toast
 82:         service.remove(firstToastId);
 83:       } else if (toasts.length === 1) {
 84:         // After removal, check that only second toast remains
 85:         expect(toasts[0].message).toBe('Second toast');
 86:         done();
 87:       }
 88:     });
 89:   });
 90: 
 91:   it('should clear all toasts', (done) => {
 92:     // Add multiple toasts
 93:     service.success('Toast 1');
 94:     service.error('Toast 2');
 95:     service.info('Toast 3');
 96:     
 97:     // Clear all toasts
 98:     service.clear();
 99:     
100:     service.toasts$.subscribe(toasts => {
101:       expect(toasts.length).toBe(0);
102:       done();
103:     });
104:   });
105: 
106:   it('should generate unique IDs for each toast', (done) => {
107:     service.success('Toast 1');
108:     service.success('Toast 2');
109:     
110:     service.toasts$.subscribe(toasts => {
111:       if (toasts.length === 2) {
112:         expect(toasts[0].id).not.toBe(toasts[1].id);
113:         done();
114:       }
115:     });
116:   });
117: });
````

## File: frontend/src/app/services/toast.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: import { BehaviorSubject, Observable } from 'rxjs';
 3: import { Toast } from '../components/toast-notification/toast-notification.component';
 4: 
 5: @Injectable({
 6:   providedIn: 'root'
 7: })
 8: export class ToastService {
 9:   private toasts: Toast[] = [];
10:   private toastSubject = new BehaviorSubject<Toast[]>([]);
11:   private lastId = 0;
12: 
13:   constructor() { }
14: 
15:   // Get all active toasts as an observable
16:   get toasts$(): Observable<Toast[]> {
17:     return this.toastSubject.asObservable();
18:   }
19: 
20:   // Show a success toast
21:   success(message: string, timeout: number = 5000): void {
22:     this.add({
23:       id: ++this.lastId,
24:       message,
25:       type: 'success',
26:       timeout
27:     });
28:   }
29: 
30:   // Show an error toast
31:   error(message: string, timeout: number = 8000): void {
32:     this.add({
33:       id: ++this.lastId,
34:       message,
35:       type: 'error',
36:       timeout
37:     });
38:   }
39: 
40:   // Show an info toast
41:   info(message: string, timeout: number = 5000): void {
42:     this.add({
43:       id: ++this.lastId,
44:       message,
45:       type: 'info',
46:       timeout
47:     });
48:   }
49: 
50:   // Show a warning toast
51:   warning(message: string, timeout: number = 6000): void {
52:     this.add({
53:       id: ++this.lastId,
54:       message,
55:       type: 'warning',
56:       timeout
57:     });
58:   }
59: 
60:   // Add a toast to the list
61:   private add(toast: Toast): void {
62:     // Add new toast to the array
63:     this.toasts = [...this.toasts, toast];
64:     
65:     // Update the subject
66:     this.toastSubject.next(this.toasts);
67:     
68:     // Remove the toast after it closes
69:     if (toast.timeout !== undefined && toast.timeout !== 0) {
70:       setTimeout(() => {
71:         this.remove(toast.id);
72:       }, toast.timeout + 1000); // Add 1 second buffer for animation
73:     }
74:   }
75: 
76:   // Remove a toast by id
77:   remove(id: number): void {
78:     // Remove the toast from array
79:     this.toasts = this.toasts.filter(t => t.id !== id);
80:     
81:     // Update the subject
82:     this.toastSubject.next(this.toasts);
83:   }
84: 
85:   // Clear all toasts
86:   clear(): void {
87:     this.toasts = [];
88:     this.toastSubject.next(this.toasts);
89:   }
90: }
````

## File: frontend/src/app/app-routing.module.ts
````typescript
 1: import { NgModule } from '@angular/core';
 2: import { RouterModule, Routes } from '@angular/router';
 3: import { LandingComponent } from './landing/landing.component';
 4: 
 5: const routes: Routes = [
 6:   { path: '', redirectTo: 'landing', pathMatch: 'full' },
 7:   { path: 'landing', component: LandingComponent }
 8: ];
 9: 
10: @NgModule({
11:   imports: [RouterModule.forRoot(routes)],
12:   exports: [RouterModule]
13: })
14: export class AppRoutingModule { }
````

## File: frontend/src/app/app.component.html
````html
1: <router-outlet />
````

## File: frontend/src/app/app.component.spec.ts
````typescript
 1: import { TestBed } from '@angular/core/testing';
 2: import { AppComponent } from './app.component';
 3: 
 4: describe('AppComponent', () => {
 5:   beforeEach(async () => {
 6:     await TestBed.configureTestingModule({
 7:       imports: [AppComponent],
 8:     }).compileComponents();
 9:   });
10: 
11:   it('should create the app', () => {
12:     const fixture = TestBed.createComponent(AppComponent);
13:     const app = fixture.componentInstance;
14:     expect(app).toBeTruthy();
15:   });
16: 
17:   it(`should have the 'frontend' title`, () => {
18:     const fixture = TestBed.createComponent(AppComponent);
19:     const app = fixture.componentInstance;
20:     expect(app.title).toEqual('frontend');
21:   });
22: 
23:   it('should render title', () => {
24:     const fixture = TestBed.createComponent(AppComponent);
25:     fixture.detectChanges();
26:     const compiled = fixture.nativeElement as HTMLElement;
27:     expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
28:   });
29: });
````

## File: frontend/src/app/app.component.ts
````typescript
 1: import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
 2: import { RouterOutlet } from '@angular/router';
 3: import { isPlatformBrowser, CommonModule } from '@angular/common';
 4: import { ThemeService } from './services/theme.service';
 5: import { LoadingService } from './services/loading.service';
 6: import { LoadingSpinnerComponent, ToastContainerComponent } from './components/index';
 7: 
 8: @Component({
 9:   selector: 'app-root',
10:   standalone: true,
11:   imports: [RouterOutlet, CommonModule, LoadingSpinnerComponent, ToastContainerComponent],
12:   template: `
13:     <app-toast-container></app-toast-container>
14:     <app-loading-spinner 
15:       *ngIf="isLoading" 
16:       [overlay]="true" 
17:       [message]="loadingMessage">
18:     </app-loading-spinner>
19:     <router-outlet />
20:   `,
21:   styleUrl: './app.component.css'
22: })
23: export class AppComponent implements OnInit {
24:   title = 'UPV Calendar';
25:   isLoading = false;
26:   loadingMessage = '';
27:   
28:   constructor(
29:     private themeService: ThemeService,
30:     private loadingService: LoadingService,
31:     @Inject(PLATFORM_ID) private platformId: Object
32:   ) {}
33:   
34:   ngOnInit() {
35:     // Subscribe to loading status
36:     this.loadingService.loading$.subscribe(loading => {
37:       this.isLoading = loading;
38:     });
39:     
40:     // Subscribe to loading message
41:     this.loadingService.message$.subscribe(message => {
42:       this.loadingMessage = message;
43:     });
44:     
45:     // Theme initialization is handled by the ThemeService
46:     // Additional initialization if needed can be guarded with isPlatformBrowser
47:     if (isPlatformBrowser(this.platformId)) {
48:       // Browser-only code here
49:     }
50:   }
51: }
````

## File: frontend/src/app/app.config.server.ts
````typescript
 1: import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
 2: import { provideServerRendering } from '@angular/platform-server';
 3: import { appConfig } from './app.config';
 4: 
 5: const serverConfig: ApplicationConfig = {
 6:   providers: [
 7:     provideServerRendering(),
 8:   ]
 9: };
10: 
11: export const config = mergeApplicationConfig(appConfig, serverConfig);
````

## File: frontend/src/app/app.config.ts
````typescript
 1: import { ApplicationConfig } from '@angular/core';
 2: import { provideRouter } from '@angular/router';
 3: import { provideHttpClient, withInterceptors } from '@angular/common/http';
 4: import { provideAnimations } from '@angular/platform-browser/animations';
 5: import { routes } from './app.routes';
 6: import { provideClientHydration } from '@angular/platform-browser';
 7: import { authInterceptor } from './interceptors/auth.interceptor';
 8: 
 9: export const appConfig: ApplicationConfig = {
10:   providers: [
11:     provideRouter(routes), 
12:     provideClientHydration(),
13:     provideHttpClient(withInterceptors([authInterceptor])),
14:     provideAnimations()
15:   ]
16: };
````

## File: frontend/src/app/app.module.ts
````typescript
 1: // This file is deprecated as the application now uses standalone components
 2: // All providers are now configured in app.config.ts
 3: // This file is kept for reference purposes only
 4: 
 5: /*
 6: import { NgModule } from '@angular/core';
 7: import { BrowserModule } from '@angular/platform-browser';
 8: import { FormsModule } from '@angular/forms';
 9: import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
10: import { AppRoutingModule } from './app-routing.module';
11: import { AppComponent } from './app.component';
12: import { LandingComponent } from './landing/landing.component';
13: import { AuthInterceptor } from './interceptors/auth.interceptor';
14: import { AuthService } from './services/auth.service';
15: import { ExamService } from './services/exam.service';
16: 
17: @NgModule({
18:   declarations: [
19:     AppComponent,
20:     LandingComponent
21:   ],
22:   imports: [
23:     BrowserModule,
24:     AppRoutingModule,
25:     FormsModule,
26:     HttpClientModule
27:   ],
28:   providers: [
29:     AuthService,
30:     ExamService,
31:     {
32:       provide: HTTP_INTERCEPTORS,
33:       useClass: AuthInterceptor,
34:       multi: true
35:     }
36:   ],
37:   bootstrap: [AppComponent]
38: })
39: export class AppModule { }
40: */
````

## File: frontend/src/app/app.routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { LandingComponent } from './landing/landing.component'; // Import the new component
 3: import { LoginComponent } from './login/login.component';
 4: import { RegisterComponent } from './register/register.component';
 5: import { AuthGuard } from './guards/auth.guard';
 6: import { AdminGuard } from './guards/admin.guard';
 7: import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
 8: 
 9: export const routes: Routes = [
10:   { path: '', component: LandingComponent }, // Set the landing page as the default route
11:   { path: 'login', component: LoginComponent },
12:   { path: 'register', component: RegisterComponent },
13:   {
14:     path: 'admin',
15:     canActivate: [AuthGuard, AdminGuard],
16:     component: AdminDashboardComponent,
17:     title: 'Admin Dashboard'
18:   },
19:   {
20:     path: 'admin/exams',
21:     canActivate: [AuthGuard, AdminGuard],
22:     loadComponent: () => import('./admin/manage-exams/manage-exams.component').then(c => c.ManageExamsComponent),
23:     title: 'Manage Exams'
24:   },
25:   {
26:     path: 'admin/exams/new',
27:     canActivate: [AuthGuard, AdminGuard],
28:     loadComponent: () => import('./admin/exam-form/exam-form.component').then(c => c.ExamFormComponent),
29:     title: 'Create Exam'
30:   },
31:   {
32:     path: 'admin/exams/:id',
33:     canActivate: [AuthGuard, AdminGuard],
34:     loadComponent: () => import('./admin/exam-form/exam-form.component').then(c => c.ExamFormComponent),
35:     title: 'Edit Exam'
36:   },
37:   {
38:     path: 'admin/import',
39:     canActivate: [AuthGuard, AdminGuard],
40:     loadComponent: () => import('./admin/import-data/import-data.component').then(c => c.ImportDataComponent),
41:     title: 'Import Data'
42:   },
43:   // Redirect all other paths to the landing page
44:   { path: '**', redirectTo: '' }
45: ];
````

## File: frontend/src/assets/icons/dark-mode.svg
````
1: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
2:   <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
3: </svg>
````

## File: frontend/src/assets/icons/light-mode.svg
````
 1: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 2:   <circle cx="12" cy="12" r="5"></circle>
 3:   <line x1="12" y1="1" x2="12" y2="3"></line>
 4:   <line x1="12" y1="21" x2="12" y2="23"></line>
 5:   <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
 6:   <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
 7:   <line x1="1" y1="12" x2="3" y2="12"></line>
 8:   <line x1="21" y1="12" x2="23" y2="12"></line>
 9:   <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
10:   <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
11: </svg>
````

## File: frontend/src/assets/icons/upv-logo.svg
````
1: <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
2:   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
3:   <line x1="16" y1="2" x2="16" y2="6"></line>
4:   <line x1="8" y1="2" x2="8" y2="6"></line>
5:   <line x1="3" y1="10" x2="21" y2="10"></line>
6:   <text x="6" y="18" font-family="sans-serif" font-size="6" fill="currentColor">UPV</text>
7: </svg>
````

## File: frontend/src/assets/js/theme-init.js
````javascript
 1: (function() {
 2:   // Only run in browser environment
 3:   if (typeof window === 'undefined' || typeof document === 'undefined') {
 4:     return;
 5:   }
 6:   
 7:   // Add preloading class to prevent transition flashes
 8:   document.documentElement.classList.add('theme-preloading');
 9:   
10:   try {
11:     // Check for stored theme preference
12:     const storedTheme = localStorage.getItem('theme');
13:     
14:     // Check system preference if no stored preference
15:     if (!storedTheme) {
16:       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
17:       if (prefersDark) {
18:         document.documentElement.setAttribute('data-theme', 'dark');
19:       }
20:     } else if (storedTheme === 'dark') {
21:       document.documentElement.setAttribute('data-theme', 'dark');
22:     }
23:     
24:     // Remove preloading class after a short delay to enable transitions
25:     window.addEventListener('load', function() {
26:       setTimeout(function() {
27:         document.documentElement.classList.remove('theme-preloading');
28:       }, 300);
29:     });
30:   } catch (error) {
31:     console.warn('Theme initialization error:', error);
32:   }
33: })();
````

## File: frontend/src/environments/environment.prod.ts
````typescript
1: export const environment = {
2:   production: true,
3:   apiUrl: '/api' // In production, API is served from the same domain
4: };
````

## File: frontend/src/environments/environment.ts
````typescript
1: export const environment = {
2:   production: false,
3:   apiUrl: 'http://localhost:3000/api'
4: };
````

## File: frontend/src/index.html
````html
 1: <!doctype html>
 2: <html lang="en">
 3: <head>
 4:   <meta charset="utf-8">
 5:   <title>UPV Calendar</title>
 6:   <base href="/">
 7:   <meta name="viewport" content="width=device-width, initial-scale=1">
 8:   <meta name="color-scheme" content="light dark">
 9:   <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f8f7">
10:   <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#070807">
11:   <link rel="icon" type="image/x-icon" href="favicon.ico">
12:   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
13:   <script>
14:     // Inline script to detect and set theme before full page load
15:     (function() {
16:       try {
17:         if (typeof window !== 'undefined' && typeof document !== 'undefined' && localStorage) {
18:           // Add preloading class to prevent transition flashes
19:           document.documentElement.classList.add('theme-preloading');
20:           
21:           // Check for stored theme preference
22:           const storedTheme = localStorage.getItem('theme');
23:           
24:           // Use dark mode as default unless light mode is explicitly set
25:           if (!storedTheme || storedTheme === 'dark') {
26:             document.documentElement.setAttribute('data-theme', 'dark');
27:           }
28:         }
29:       } catch (e) {
30:         // Silently fail if localStorage is not available
31:         // Default to dark mode for SSR
32:         if (typeof document !== 'undefined') {
33:           document.documentElement.setAttribute('data-theme', 'dark');
34:         }
35:       }
36:     })();
37:   </script>
38: </head>
39: <body>
40:   <app-root></app-root>
41:   <script>
42:     // Remove preloading class after a short delay to enable transitions
43:     if (typeof window !== 'undefined' && typeof document !== 'undefined') {
44:       window.addEventListener('load', function() {
45:         setTimeout(function() {
46:           document.documentElement.classList.remove('theme-preloading');
47:         }, 300);
48:       });
49:     }
50:   </script>
51: </body>
52: </html>
````

## File: frontend/src/main.server.ts
````typescript
1: import { bootstrapApplication } from '@angular/platform-browser';
2: import { AppComponent } from './app/app.component';
3: import { config } from './app/app.config.server';
4: 
5: const bootstrap = () => bootstrapApplication(AppComponent, config);
6: 
7: export default bootstrap;
````

## File: frontend/src/main.ts
````typescript
1: import { bootstrapApplication } from '@angular/platform-browser';
2: import { appConfig } from './app/app.config';
3: import { AppComponent } from './app/app.component';
4: 
5: bootstrapApplication(AppComponent, appConfig)
6:   .catch((err) => console.error(err));
````

## File: frontend/src/server.ts
````typescript
 1: import { APP_BASE_HREF } from '@angular/common';
 2: import { CommonEngine, isMainModule } from '@angular/ssr/node';
 3: import express from 'express';
 4: import { dirname, join, resolve } from 'node:path';
 5: import { fileURLToPath } from 'node:url';
 6: import bootstrap from './main.server';
 7: 
 8: const serverDistFolder = dirname(fileURLToPath(import.meta.url));
 9: const browserDistFolder = resolve(serverDistFolder, '../browser');
10: const indexHtml = join(serverDistFolder, 'index.server.html');
11: 
12: const app = express();
13: const commonEngine = new CommonEngine();
14: 
15: /**
16:  * Example Express Rest API endpoints can be defined here.
17:  * Uncomment and define endpoints as necessary.
18:  *
19:  * Example:
20:  * ```ts
21:  * app.get('/api/**', (req, res) => {
22:  *   // Handle API request
23:  * });
24:  * ```
25:  */
26: 
27: /**
28:  * Serve static files from /browser
29:  */
30: app.get(
31:   '**',
32:   express.static(browserDistFolder, {
33:     maxAge: '1y',
34:     index: 'index.html'
35:   }),
36: );
37: 
38: /**
39:  * Handle all other requests by rendering the Angular application.
40:  */
41: app.get('**', (req, res, next) => {
42:   const { protocol, originalUrl, baseUrl, headers } = req;
43: 
44:   commonEngine
45:     .render({
46:       bootstrap,
47:       documentFilePath: indexHtml,
48:       url: `${protocol}://${headers.host}${originalUrl}`,
49:       publicPath: browserDistFolder,
50:       providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
51:     })
52:     .then((html) => res.send(html))
53:     .catch((err) => next(err));
54: });
55: 
56: /**
57:  * Start the server if this module is the main entry point.
58:  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
59:  */
60: if (isMainModule(import.meta.url)) {
61:   const port = process.env['PORT'] || 4000;
62:   app.listen(port, () => {
63:     console.log(`Node Express server listening on http://localhost:${port}`);
64:   });
65: }
66: 
67: export default app;
````

## File: frontend/src/styles.css
````css
  1: /* You can add global styles to this file, and also import other style files */
  2: 
  3: /* Global CSS Variables - Light Mode (Default) */
  4: :root {
  5:   /* Complete background palette */
  6:   --background-50: #f1f3f1;
  7:   --background-100: #e4e7e4;
  8:   --background-200: #c8d0c8;
  9:   --background-300: #adb8ad;
 10:   --background-400: #92a092;
 11:   --background-500: #778877;
 12:   --background-600: #5f6d5f;
 13:   --background-700: #475247;
 14:   --background-800: #2f372f;
 15:   --background-900: #181b18;
 16:   --background-950: #0c0e0c;
 17:   
 18:   /* Light Mode Colors */
 19:   --text: rgb(16, 20, 16);
 20:   --background: var(--background-50);
 21:   --background-rgb: 241, 243, 241;
 22:   
 23:   --surface-1: var(--background-100);
 24:   --surface-2: var(--background-200);
 25:   --surface-3: var(--background-300);
 26:   
 27:   --primary: var(--background-500);
 28:   --primary-rgb: 119, 136, 119;
 29:   --primary-dark: var(--background-600);
 30:   --primary-light: var(--background-400);
 31:   
 32:   --secondary: rgb(181, 195, 196);
 33:   --accent: rgb(150, 160, 171);
 34:   --accent-rgb: 150, 160, 171;
 35:   
 36:   /* Visual hierarchy colors */
 37:   --shadow-color: rgba(0, 0, 0, 0.1);
 38:   --inverse-text: white;
 39:   --weekday-color: black;
 40:   
 41:   --logo-filter: none;
 42:   --calendar-hover: rgba(119, 136, 119, 0.15);
 43:   --calendar-exam: var(--background-500);
 44:   --calendar-exam-hover: var(--background-600);
 45:   --hover-bg: rgba(0, 0, 0, 0.03);
 46: 
 47:   /* Common Styling Values */
 48:   --border-radius: 8px;
 49:   --box-shadow: 0 4px 12px var(--shadow-color);
 50:   --transition-speed: 0.3s;
 51: }
 52: 
 53: /* Dark Mode Colors */
 54: [data-theme="dark"] {
 55:   /* Dark Mode Colors */
 56:   --text: rgb(235, 239, 235);
 57:   --background: var(--background-900);
 58:   --background-rgb: 24, 27, 24;
 59:   
 60:   --surface-1: var(--background-800);
 61:   --surface-2: var(--background-700);
 62:   --surface-3: var(--background-600);
 63:   
 64:   --primary: var(--background-400);
 65:   --primary-rgb: 146, 160, 146;
 66:   --primary-dark: var(--background-500);
 67:   --primary-light: var(--background-300);
 68:   
 69:   --secondary: rgb(59, 73, 74);
 70:   --accent: rgb(84, 94, 105);
 71:   --accent-rgb: 84, 94, 105;
 72:   
 73:   /* Visual hierarchy colors */
 74:   --shadow-color: rgba(0, 0, 0, 0.25);
 75:   --inverse-text: var(--background-950);
 76:   --weekday-color: white;
 77:   
 78:   --logo-filter: invert(1) hue-rotate(180deg);
 79:   --calendar-hover: rgba(92, 160, 92, 0.15);
 80:   --calendar-exam: var(--background-400);
 81:   --calendar-exam-hover: var(--background-300);
 82:   --hover-bg: rgba(255, 255, 255, 0.05);
 83: }
 84: 
 85: /* Global Styles */
 86: * {
 87:   margin: 0;
 88:   padding: 0;
 89:   box-sizing: border-box;
 90:   transition: transform var(--transition-speed),
 91:               box-shadow var(--transition-speed);
 92: }
 93: 
 94: body {
 95:   font-family: 'Inter', 'Roboto', sans-serif;
 96:   background-color: var(--background);
 97:   color: var(--text);
 98:   min-height: 100vh;
 99:   display: flex;
100:   flex-direction: column;
101: }
102: 
103: /* Theme Toggle Style */
104: .theme-toggle {
105:   background: transparent;
106:   border: none;
107:   cursor: pointer;
108:   display: flex;
109:   align-items: center;
110:   justify-content: center;
111:   padding: 8px;
112:   margin: 0 10px;
113:   border-radius: 50%;
114:   transition: background-color 0.2s;
115:   overflow: hidden;
116: }
117: 
118: .theme-toggle:hover {
119:   background-color: rgba(255, 255, 255, 0.2);
120: }
121: 
122: .theme-toggle img,
123: .theme-toggle svg {
124:   width: 22px;
125:   height: 22px;
126:   color: white;
127:   transition: transform 0.5s ease;
128: }
129: 
130: /* Add rotation animation when toggling */
131: .theme-toggle:active img,
132: .theme-toggle:active svg {
133:   transform: rotate(360deg);
134: }
135: 
136: /* Add a preloading class to prevent transition flashes */
137: .theme-preloading * {
138:   transition: none !important;
139: }
140: 
141: /* Focus styles for accessibility */
142: :focus-visible {
143:   outline: 2px solid var(--primary);
144:   outline-offset: 2px;
145: }
146: 
147: /* Calendar dates need instant color changes */
148: .calendar-date, 
149: .month-block td,
150: .has-exam,
151: .no-exam,
152: .selected {
153:   transition: transform 0.2s, box-shadow 0.2s !important;
154:   color-transition: none !important;
155: }
````

## File: frontend/src/styles.scss
````scss
  1: /* You can add global styles to this file, and also import other style files */
  2: 
  3: /* Reset styles */
  4: * {
  5:   margin: 0;
  6:   padding: 0;
  7:   box-sizing: border-box;
  8: }
  9: 
 10: /* Define Light Theme Colors */
 11: :root {
 12:   --primary-color: #6b8e23; /* Olive Drab */
 13:   --secondary-color: #f5f5f5; /* Light Gray */
 14:   --accent-color: #ff8c00; /* Dark Orange */
 15:   --background-color: #ffffff; /* White */
 16:   --text-color: #333333; /* Dark Gray */
 17:   --text-muted-color: #6c757d; /* Muted Gray */
 18:   --border-color: #dee2e6; /* Light Gray Border */
 19:   --card-background-color: #ffffff; /* White Card */
 20:   --card-shadow-color: rgba(0, 0, 0, 0.1);
 21:   --link-color: var(--primary-color);
 22:   --button-text-color: #ffffff;
 23: 
 24:   --error-color: #dc3545; /* Red */
 25:   --success-color: #28a745; /* Green */
 26:   --info-color: #17a2b8; /* Teal */
 27:   --warning-color: #ffc107; /* Yellow */
 28: 
 29:   --border-radius: 4px;
 30:   --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
 31:   --transition-speed: 0.2s ease-in-out;
 32: }
 33: 
 34: /* Define Dark Theme Colors using data attribute */
 35: html[data-theme="dark"] {
 36:   --primary-color: #90ee90; /* Light Green */
 37:   --secondary-color: #343a40; /* Dark Gray */
 38:   --accent-color: #ffa500; /* Orange */
 39:   --background-color: #212529; /* Very Dark Gray/Black */
 40:   --text-color: #f8f9fa; /* Light Gray/White */
 41:   --text-muted-color: #adb5bd; /* Lighter Muted Gray */
 42:   --border-color: #495057; /* Medium Gray Border */
 43:   --card-background-color: #343a40; /* Dark Gray Card */
 44:   --card-shadow-color: rgba(0, 0, 0, 0.4);
 45:   --link-color: var(--primary-color);
 46:   --button-text-color: #212529; /* Dark text on light green button */
 47: 
 48:   --error-color: #f8d7da; /* Light Red */
 49:   --success-color: #d4edda; /* Light Green */
 50:   --info-color: #d1ecf1; /* Light Teal */
 51:   --warning-color: #fff3cd; /* Light Yellow */
 52: }
 53: 
 54: /* Apply base styles using variables */
 55: html, body {
 56:   height: 100%;
 57:   font-family: var(--font-family);
 58:   font-size: 16px;
 59:   color: var(--text-color);
 60:   background-color: var(--background-color); /* Use background variable */
 61:   line-height: 1.5;
 62:   transition: background-color var(--transition-speed), color var(--transition-speed); /* Smooth transition */
 63: }
 64: 
 65: /* Updated Global button styles */
 66: button {
 67:   cursor: pointer;
 68:   border: none;
 69:   border-radius: var(--border-radius);
 70:   padding: 0.75rem 1.5rem; /* Increased padding */
 71:   background-color: var(--primary-color);
 72:   color: var(--button-text-color);
 73:   font-size: 1rem;
 74:   font-weight: 500; /* Slightly bolder */
 75:   transition: background-color var(--transition-speed), transform var(--transition-speed);
 76: }
 77: 
 78: button:hover {
 79:   /* Slightly darken/lighten based on theme - simple opacity for now */
 80:   filter: brightness(90%);
 81:   transform: translateY(-2px); /* Subtle lift */
 82: }
 83: 
 84: button:disabled {
 85:   background-color: var(--secondary-color);
 86:   color: var(--text-muted-color);
 87:   cursor: not-allowed;
 88:   transform: none;
 89:   filter: brightness(100%);
 90: }
 91: 
 92: /* Updated Link styles */
 93: a {
 94:   color: var(--link-color);
 95:   text-decoration: none;
 96:   transition: color var(--transition-speed);
 97: }
 98: 
 99: a:hover {
100:   text-decoration: underline;
101:   filter: brightness(85%);
102: }
103: 
104: /* Updated Form styles */
105: input, select, textarea {
106:   width: 100%;
107:   padding: 0.75rem;
108:   border: 1px solid var(--border-color);
109:   border-radius: var(--border-radius);
110:   font-size: 1rem;
111:   background-color: var(--background-color); /* Form fields adapt */
112:   color: var(--text-color); /* Form text adapts */
113:   transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
114: }
115: 
116: input:focus, select:focus, textarea:focus {
117:   outline: none;
118:   border-color: var(--accent-color); /* Use accent color for focus */
119:   box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb, 255, 140, 0), 0.25); /* Add focus ring - needs RGB var */
120: }
121: 
122: label {
123:   display: block;
124:   margin-bottom: 0.5rem;
125:   font-weight: 500;
126:   color: var(--text-color); /* Label color adapts */
127: }
128: 
129: /* Updated Utility classes */
130: .container {
131:   max-width: 1200px;
132:   margin: 0 auto;
133:   padding: 1rem 1.5rem; /* Adjust padding */
134: }
135: 
136: .card {
137:   background: var(--card-background-color); /* Card adapts */
138:   border-radius: 8px; /* Slightly larger radius */
139:   box-shadow: 0 4px 15px var(--card-shadow-color); /* Softer, larger shadow */
140:   padding: 2rem; /* More padding */
141:   border: 1px solid var(--border-color); /* Subtle border */
142:   transition: background-color var(--transition-speed), border-color var(--transition-speed), box-shadow var(--transition-speed);
143: }
144: 
145: /* Accessibility */
146: .sr-only {
147:   position: absolute;
148:   width: 1px;
149:   height: 1px;
150:   padding: 0;
151:   margin: -1px;
152:   overflow: hidden;
153:   clip: rect(0, 0, 0, 0);
154:   white-space: nowrap;
155:   border-width: 0;
156: }
````

## File: frontend/.editorconfig
````
 1: # Editor configuration, see https://editorconfig.org
 2: root = true
 3: 
 4: [*]
 5: charset = utf-8
 6: indent_style = space
 7: indent_size = 2
 8: insert_final_newline = true
 9: trim_trailing_whitespace = true
10: 
11: [*.ts]
12: quote_type = single
13: ij_typescript_use_double_quotes = false
14: 
15: [*.md]
16: max_line_length = off
17: trim_trailing_whitespace = false
````

## File: frontend/.gitignore
````
 1: # See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.
 2: 
 3: # Compiled output
 4: /dist
 5: /tmp
 6: /out-tsc
 7: /bazel-out
 8: 
 9: # Node
10: /node_modules
11: npm-debug.log
12: yarn-error.log
13: 
14: # IDEs and editors
15: .idea/
16: .project
17: .classpath
18: .c9/
19: *.launch
20: .settings/
21: *.sublime-workspace
22: 
23: # Visual Studio Code
24: .vscode/*
25: !.vscode/settings.json
26: !.vscode/tasks.json
27: !.vscode/launch.json
28: !.vscode/extensions.json
29: .history/*
30: 
31: # Miscellaneous
32: /.angular/cache
33: .sass-cache/
34: /connect.lock
35: /coverage
36: /libpeerconnection.log
37: testem.log
38: /typings
39: 
40: # System files
41: .DS_Store
42: Thumbs.db
````

## File: frontend/angular.json
````json
  1: {
  2:   "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  3:   "version": 1,
  4:   "cli": {
  5:     "cache": {
  6:       "enabled": true,
  7:       "path": ".angular/cache",
  8:       "environment": "all"
  9:     },
 10:     "analytics": false
 11:   },
 12:   "newProjectRoot": "projects",
 13:   "projects": {
 14:     "frontend": {
 15:       "projectType": "application",
 16:       "schematics": {
 17:         "@schematics/angular:component": {
 18:           "standalone": true,
 19:           "style": "scss"
 20:         },
 21:         "@schematics/angular:directive": {
 22:           "standalone": true
 23:         },
 24:         "@schematics/angular:pipe": {
 25:           "standalone": true
 26:         }
 27:       },
 28:       "root": "",
 29:       "sourceRoot": "src",
 30:       "prefix": "app",
 31:       "architect": {
 32:         "build": {
 33:           "builder": "@angular-devkit/build-angular:application",
 34:           "options": {
 35:             "allowedCommonJsDependencies": [
 36:               "lodash"
 37:             ],
 38:             "outputPath": "dist/frontend",
 39:             "index": "src/index.html",
 40:             "browser": "src/main.ts",
 41:             "polyfills": [
 42:               "zone.js"
 43:             ],
 44:             "tsConfig": "tsconfig.app.json",
 45:             "inlineStyleLanguage": "scss",
 46:             "assets": [
 47:               "src/favicon.ico",
 48:               "src/assets"
 49:             ],
 50:             "styles": [
 51:               "src/styles.scss"
 52:             ],
 53:             "scripts": [],
 54:             "server": "src/main.server.ts",
 55:             "prerender": false,
 56:             "ssr": false,
 57:             "preserveSymlinks": true
 58:           },
 59:           "configurations": {
 60:             "production": {
 61:               "budgets": [
 62:                 {
 63:                   "type": "initial",
 64:                   "maximumWarning": "1mb",
 65:                   "maximumError": "2mb"
 66:                 },
 67:                 {
 68:                   "type": "anyComponentStyle",
 69:                   "maximumWarning": "4kb",
 70:                   "maximumError": "8kb"
 71:                 }
 72:               ],
 73:               "outputHashing": "all"
 74:             },
 75:             "development": {
 76:               "optimization": false,
 77:               "extractLicenses": false,
 78:               "sourceMap": true
 79:             }
 80:           },
 81:           "defaultConfiguration": "production"
 82:         },
 83:         "serve": {
 84:           "builder": "@angular-devkit/build-angular:dev-server",
 85:           "configurations": {
 86:             "production": {
 87:               "buildTarget": "frontend:build:production"
 88:             },
 89:             "development": {
 90:               "buildTarget": "frontend:build:development"
 91:             }
 92:           },
 93:           "defaultConfiguration": "development"
 94:         },
 95:         "extract-i18n": {
 96:           "builder": "@angular-devkit/build-angular:extract-i18n",
 97:           "options": {
 98:             "buildTarget": "frontend:build"
 99:           }
100:         },
101:         "test": {
102:           "builder": "@angular-devkit/build-angular:karma",
103:           "options": {
104:             "polyfills": [
105:               "zone.js",
106:               "zone.js/testing"
107:             ],
108:             "tsConfig": "tsconfig.spec.json",
109:             "inlineStyleLanguage": "scss",
110:             "assets": [
111:               "src/favicon.ico",
112:               "src/assets"
113:             ],
114:             "styles": [
115:               "src/styles.scss"
116:             ],
117:             "scripts": []
118:           }
119:         }
120:       }
121:     }
122:   }
123: }
````

## File: frontend/package.json
````json
 1: {
 2:   "name": "frontend",
 3:   "version": "0.0.0",
 4:   "scripts": {
 5:     "ng": "ng",
 6:     "start": "ng serve",
 7:     "build": "ng build",
 8:     "watch": "ng build --watch --configuration development",
 9:     "test": "ng test",
10:     "serve:ssr:frontend": "node dist/frontend/server/server.mjs"
11:   },
12:   "private": true,
13:   "dependencies": {
14:     "@angular/animations": "^19.2.7",
15:     "@angular/common": "^19.2.0",
16:     "@angular/compiler": "^19.2.0",
17:     "@angular/core": "^19.2.0",
18:     "@angular/forms": "^19.2.0",
19:     "@angular/platform-browser": "^19.2.0",
20:     "@angular/platform-browser-dynamic": "^19.2.0",
21:     "@angular/platform-server": "^19.2.0",
22:     "@angular/router": "^19.2.0",
23:     "@angular/ssr": "^19.2.7",
24:     "express": "^4.18.2",
25:     "frontend": "file:",
26:     "rxjs": "~7.8.0",
27:     "tslib": "^2.3.0",
28:     "zone.js": "~0.15.0"
29:   },
30:   "devDependencies": {
31:     "@angular-devkit/build-angular": "^19.2.7",
32:     "@angular/cli": "^19.2.7",
33:     "@angular/compiler-cli": "^19.2.0",
34:     "@types/express": "^4.17.17",
35:     "@types/jasmine": "~5.1.0",
36:     "@types/node": "^18.18.0",
37:     "jasmine-core": "~5.6.0",
38:     "karma": "~6.4.0",
39:     "karma-chrome-launcher": "~3.2.0",
40:     "karma-coverage": "~2.2.0",
41:     "karma-jasmine": "~5.1.0",
42:     "karma-jasmine-html-reporter": "~2.1.0",
43:     "typescript": "~5.7.2"
44:   }
45: }
````

## File: frontend/README.md
````markdown
 1: # Frontend
 2: 
 3: This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.
 4: 
 5: ## Development server
 6: 
 7: To start a local development server, run:
 8: 
 9: ```bash
10: ng serve
11: ```
12: 
13: Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
14: 
15: ## Code scaffolding
16: 
17: Angular CLI includes powerful code scaffolding tools. To generate a new component, run:
18: 
19: ```bash
20: ng generate component component-name
21: ```
22: 
23: For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:
24: 
25: ```bash
26: ng generate --help
27: ```
28: 
29: ## Building
30: 
31: To build the project run:
32: 
33: ```bash
34: ng build
35: ```
36: 
37: This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
38: 
39: ## Running unit tests
40: 
41: To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:
42: 
43: ```bash
44: ng test
45: ```
46: 
47: ## Running end-to-end tests
48: 
49: For end-to-end (e2e) testing, run:
50: 
51: ```bash
52: ng e2e
53: ```
54: 
55: Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.
56: 
57: ## Additional Resources
58: 
59: For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
````

## File: frontend/tsconfig.app.json
````json
 1: /* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
 2: /* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
 3: {
 4:   "extends": "./tsconfig.json",
 5:   "compilerOptions": {
 6:     "outDir": "./out-tsc/app",
 7:     "types": [
 8:       "node"
 9:     ]
10:   },
11:   "files": [
12:     "src/main.ts",
13:     "src/main.server.ts",
14:     "src/server.ts"
15:   ],
16:   "include": [
17:     "src/**/*.d.ts"
18:   ]
19: }
````

## File: frontend/tsconfig.json
````json
 1: /* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
 2: /* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
 3: {
 4:   "compileOnSave": false,
 5:   "compilerOptions": {
 6:     "outDir": "./dist/out-tsc",
 7:     "strict": true,
 8:     "noImplicitOverride": true,
 9:     "noPropertyAccessFromIndexSignature": true,
10:     "noImplicitReturns": true,
11:     "noFallthroughCasesInSwitch": true,
12:     "skipLibCheck": true,
13:     "isolatedModules": true,
14:     "esModuleInterop": true,
15:     "experimentalDecorators": true,
16:     "moduleResolution": "bundler",
17:     "importHelpers": true,
18:     "target": "ES2022",
19:     "module": "ES2022"
20:   },
21:   "angularCompilerOptions": {
22:     "enableI18nLegacyMessageIdFormat": false,
23:     "strictInjectionParameters": true,
24:     "strictInputAccessModifiers": true,
25:     "strictTemplates": true
26:   }
27: }
````

## File: frontend/tsconfig.spec.json
````json
 1: /* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
 2: /* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
 3: {
 4:   "extends": "./tsconfig.json",
 5:   "compilerOptions": {
 6:     "outDir": "./out-tsc/spec",
 7:     "types": [
 8:       "jasmine"
 9:     ]
10:   },
11:   "include": [
12:     "src/**/*.spec.ts",
13:     "src/**/*.d.ts"
14:   ]
15: }
````
