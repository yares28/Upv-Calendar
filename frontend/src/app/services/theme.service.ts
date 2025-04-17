import { Injectable, Renderer2, RendererFactory2, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private darkMode = new BehaviorSubject<boolean>(true);
  public darkMode$: Observable<boolean> = this.darkMode.asObservable();
  private isBrowser: boolean;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Only access browser APIs if running in browser
    if (this.isBrowser) {
      // Check for stored theme preference
      const storedTheme = localStorage.getItem('theme');
      
      if (!storedTheme) {
        // If no stored preference, use dark mode as default
        this.setDarkMode(true);
      } else {
        // Otherwise respect stored preference
        this.setDarkMode(storedTheme === 'dark');
      }
      
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setDarkMode(e.matches);
        }
      });
    } else {
      // In SSR, default to dark mode
      this.setDarkMode(true);
    }
  }

  /**
   * Toggle between dark and light mode
   */
  public toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode.value);
  }
  
  /**
   * Set dark mode state
   */
  private setDarkMode(isDark: boolean): void {
    // Update observable state
    this.darkMode.next(isDark);
    
    // Apply theme class to HTML element
    if (this.isBrowser) {
      if (isDark) {
        this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        this.renderer.removeAttribute(document.documentElement, 'data-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }
} 