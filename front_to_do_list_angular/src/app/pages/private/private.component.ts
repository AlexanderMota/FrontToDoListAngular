import {  Component } from '@angular/core';
/*import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';*/

@Component({
  selector: 'app-private',
  imports: [],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  mensaje: string = 'Espacio privado del usuario';
  //private platformId = inject(PLATFORM_ID);
  /*public userData: User | undefined; // Variable para almacenar los datos del perfil
  public mensaje: string = ''; // Variable para almacenar los datos del perfil

  constructor( private userServ: UserService) {
  }

  ngOnInit(): void {
    this.userServ.getPerfil().subscribe(user => {
      console.log('Datos del perfil:', user); // Muestra los datos del perfil en la consola
      if (user) {
        this.userData = user;
        this.mensaje = 'Usuario autenticado';
      } else {
        this.userData = undefined;
        this.mensaje = 'Usuario no autenticado';
      }
    });
  }*/

}