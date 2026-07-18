import { Component, inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { isPlatformBrowser } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { getAvatarUrl } from '../../models/user.model';

@Component({
  selector: 'app-perfil-usuario',
  imports: [FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss'
})
export class PerfilUsuarioComponent {

  private platformId =  inject(PLATFORM_ID);
  user : User;
  editing = false;
  backupUser!: User;

  constructor(private userService: UserService) { 
    this.user = {
      user_id:'',
      name: '',
      lastname: '',
      username: '',
      email: '',
      role_id: 6,
      phone: '',
      avatar_url: ''
    }
  }

  ngOnInit(): void {
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.userService.getPerfil().subscribe({
      next: (response) => {
        this.user = response.user;
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
  cancelEdit() {

    this.user = structuredClone(this.backupUser);

    this.editing = false;

  }
  saveProfile() {
    
    /*if(this.user.avatar_url == null){
      this.user.avatar_url = this.backupUser.avatar_url;
    }*/

    this.userService.updatePerfil(this.user).subscribe({

      next: response => {

        console.log(response.message);

        this.editing = false;

      },

      error: err => {
        console.error(err);
      }
    });
  }

  onAvatarSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {

        return;

    }

    const file = input.files[0];

    this.userService.uploadAvatar(file).subscribe({

      next: res => {

        console.log(res);
        this.user.avatar_url = res.user.avatar_url;

      },
      error: err => {
        console.error(err);
      }
    });
  }
  deleteAvatar(){
    console.log("falta implementar. Id a borrar: ", this.user.avatar_url);
  }
  getAvatarUrl = getAvatarUrl;
}
