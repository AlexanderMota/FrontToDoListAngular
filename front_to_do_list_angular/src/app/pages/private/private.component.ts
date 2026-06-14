import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-private',
  imports: [],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  public user: string = ''; // Variable para almacenar los datos del perfil
  public mensaje: string = ''; // Variable para almacenar los datos del perfil

  constructor(private userServ:UserService) {
 }
  
  ngOnInit(): void {
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
