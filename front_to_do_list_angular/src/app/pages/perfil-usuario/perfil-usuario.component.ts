import { Component, inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
import { User } from '../../models/user.model';
import { isPlatformBrowser } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getAvatarUrl } from '../../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CambioPasswordFormComponent } from './cambio-password-form/cambio-password-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  imports: [FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CambioPasswordFormComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss'
})
export class PerfilUsuarioComponent {

  private platformId =  inject(PLATFORM_ID);
  user! : User;
  editing = false;
  editingPass = false;
  backupUser!: User;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private authServ :AuthService, private authState: AuthStateService, private router: Router) { 
    this.user = {
      user_id:'',
      name: '',
      lastname: '',
      username: '',
      email: '',
      role: "",
      phone: '',
      avatar_url: '',
      password: ""
    }
    
  }

  ngOnInit(): void {
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.userService.getPerfil().subscribe({
      next: (response) => {
        console.log(response.message);
        this.user = response.user!;
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      }
    });
  }
  editProfile() {

    this.backupUser = structuredClone(this.user);

    this.editing = true;

  }
  openChangePassword() {
    this.editingPass = false;
  }
  cancelEdit() {

    this.user = structuredClone(this.backupUser);

    this.editing = false;

  }
  saveProfile() {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.user.username.length > 2 && this.user.username.length < 45) {

      this.userService.updatePerfil(this.user).subscribe({
        next: response => {
          this.editing = false;
          this.user = response.user!;
          this.successMessage = response.message;
        },
        error: err => {
          this.errorMessage =
            err?.error?.error ||
            'No se ha podido actualizar el perfil.';
        }
      });

    } else {
      this.errorMessage = 'El nombre de usuario debe tener entre 3 y 44 caracteres.';
    }
  }

  onAvatarSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {

        return;

    }

    const file = input.files[0];

    this.userService.uploadAvatar(file).subscribe({

      next: res => {
        this.user.avatar_url = res.user!.avatar_url;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  eliminarFoto(){

    this.userService.deleteFotoDePerfil().subscribe({

      next: res => {
        console.log(res.message);
        this.user.avatar_url = null;
      },
      error: err => {
        console.error(err);
      }
    });
  }
  confirmDeleteProfile() {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos.'
    );

    if (!confirmar) return;

    this.userService.deleteProfile().subscribe({
      next: () => {
        this.authState.clearUser();
        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMessage =
          err?.error?.error ||
          'No se ha podido eliminar la cuenta.';
      }
    });
  }
  
  closeOnOutsideClick(event: Event) {
    setTimeout(() => {
      this.editingPass = false;
    }, 40);
  }
  getAvatarUrl = getAvatarUrl;
}
