import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivateComponent } from './pages/private/private.component';

export const routes: Routes = [
  { path: 'landing', component: LandingComponent }, // ✅ '/' actúa como Home
  { path: 'private', component: PrivateComponent }, 
  { path: '**', redirectTo: '/landing', pathMatch: 'full' }, // ✅ Rutas incorrectas redirigen a '/'
];
