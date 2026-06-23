import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-perfil-usuario',
  imports: [],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss'
})
export class PerfilUsuarioComponent {

  public user : User;

  constructor(private userService: UserService) { 
    this.user = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      role: 0,
      phone: '',
      avatar_url: ''
    }
  }

  ngOnInit(): void {
    this.userService.getPerfil().subscribe({
      next: (user) => {
        this.user = user;
        console.log('Datos del backend:', user); 
        console.log('Datos del frontend:', this.user); 
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
        // Manejo de errores si ocurre algún problema al obtener el perfil
      }
    });
  }
}
