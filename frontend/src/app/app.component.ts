import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LoadingService } from './services/loading.service';
import { LoadingSpinnerComponent, ToastContainerComponent } from './components/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoadingSpinnerComponent, ToastContainerComponent],
  template: `
    <app-toast-container></app-toast-container>
    <app-loading-spinner 
      *ngIf="isLoading" 
      [overlay]="true" 
      [message]="loadingMessage">
    </app-loading-spinner>
    <router-outlet />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'UPV Calendar';
  isLoading = false;
  loadingMessage = '';
  
  constructor(
    private themeService: ThemeService,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit() {
    // Subscribe to loading status
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
    
    // Subscribe to loading message
    this.loadingService.message$.subscribe(message => {
      this.loadingMessage = message;
    });
    
    // Theme initialization is handled by the ThemeService
    // Additional initialization if needed can be guarded with isPlatformBrowser
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code here
    }
  }
}
