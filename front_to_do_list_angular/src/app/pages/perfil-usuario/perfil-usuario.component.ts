import { Component, inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { isPlatformBrowser } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getAvatarUrl } from '../../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CambioPasswordFormComponent } from './cambio-password-form/cambio-password-form.component';

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


  constructor(private userService: UserService) { 
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
  openChangePassword(){
    this.editingPass = true;
  }
  cancelEdit() {

    this.user = structuredClone(this.backupUser);

    this.editing = false;

  }
  saveProfile() {

    if(this.user.username.length > 2 && this.user.username.length < 45){
      
      this.userService.updatePerfil(this.user).subscribe({

        next: response => {

          this.editing = false;
          console.log(response.message);
        },
        error: err => console.error(err)
      });
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
  
  closeOnOutsideClick(event: Event) {
    setTimeout(() => {
      this.editingPass = false;
    }, 40);
  }
  getAvatarUrl = getAvatarUrl;
}
