import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivateComponent } from './pages/private/private.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // ✅ '/'
  { path: 'home', component: HomeComponent }, // ✅ actúa como Home
  { path: 'private', component: PrivateComponent }, 
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // ✅ Rutas incorrectas redirigen a '/home'
];
