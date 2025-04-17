import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component'; // Import the new component

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Set the landing page as the default route
];