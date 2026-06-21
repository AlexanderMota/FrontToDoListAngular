import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  user$;

  constructor(
    private authState: AuthStateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authState.user$;
  }
  ngOnInit(): void {
    if (!this.user$) {
      this.router.navigate(['/']);
    }
    /*this.authState.user$.subscribe(user => {

      if (user) {
        this.email = user.email;
        this.mensaje = 'Usuario autenticado';
      } else {
        this.email = '';
        this.mensaje = 'Usuario no autenticado';
      }
    });*/
  }
  logout(){

    this.authService.logout()
      .subscribe({

        next: () => {
          console.log('Logout OK');
          this.authState.clearUser();

          console.log('Antes de navegar');

          this.router.navigate(['/']).then(result => {
            console.log('Resultado navegación:', result);
          });
        },

        error: err => {
          console.error('Error logout:', err);
        }

      });

  }

}