import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
//import { isPlatformBrowser } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private',
  imports: [],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  //private platformId = inject(PLATFORM_ID);
  
  public email: string = ''; // Variable para almacenar los datos del perfil
  public mensaje: string = ''; // Variable para almacenar los datos del perfil

  constructor( private authState: AuthStateService, private authServ: AuthService, private router: Router,
  private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authState.user$.subscribe(user => {

      if (user) {
        this.email = user.email;
        this.mensaje = 'Usuario autenticado';
      } else {
        this.email = '';
        this.mensaje = 'Usuario no autenticado';
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.authServ.logout().subscribe({

      next: () => {

        this.authState.clearUser();
      },

      error: err => {
        console.error("Error en Logout(): ",err);
      }
    });
  }
}