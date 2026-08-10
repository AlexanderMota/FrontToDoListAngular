import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { PrivateComponent } from './pages/private/private.component';
import { HomeComponent } from './pages/home/home.component';
import { TareaComponent } from './pages/tarea/tarea.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent }, 
  
  { path: 'home', component: HomeComponent, canActivate: [authGuard]  },
  { path: 'perfil', component: PerfilUsuarioComponent, canActivate: [authGuard]  },
  { path: 'private', component: PrivateComponent, canActivate: [authGuard]  }, 
  { path: 'tarea/:id', component: TareaComponent, canActivate: [authGuard]  }, 
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' }, // ✅ Rutas incorrectas redirigen a '/home'
];
