import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivateComponent } from './pages/private/private.component';
import { HomeComponent } from './pages/home/home.component';
import { TareaComponent } from './pages/tarea/tarea.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // ✅ '/'
  { path: 'home', component: HomeComponent }, // ✅ actúa como Home
  { path: 'perfil', component: PerfilUsuarioComponent }, // ✅ Perfil de usuario
  { path: 'private', component: PrivateComponent }, 
  { path: 'tarea/:id', component: TareaComponent }, 
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // ✅ Rutas incorrectas redirigen a '/home'
];
