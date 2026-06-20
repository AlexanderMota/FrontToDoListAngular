import { Component, inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-private',
  imports: [],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  private platformId = inject(PLATFORM_ID);
  
  public user: string = ''; // Variable para almacenar los datos del perfil
  public mensaje: string = ''; // Variable para almacenar los datos del perfil

  constructor(private userServ:UserService) {
 }
  
  ngOnInit(): void {
    /* La siguiente linea es mejorable. Provisional para simplificar el uso de los tokens en cookies con SSR activo */
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.userServ.getPerfil().subscribe({
      next: (response) => {
        this.user = response.user;
        this.mensaje = response.message;
        console.log('Perfil obtenido:', response);
      },
      error: (error) => {
        this.mensaje = error.message;
        console.error('Error al obtener el perfil:', error);
      }
    });
  }
}
