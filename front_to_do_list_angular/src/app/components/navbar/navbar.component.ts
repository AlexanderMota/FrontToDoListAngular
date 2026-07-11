import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  user$;

  constructor(
    private authState: AuthStateService,
    private authService: AuthService,
    private router: Router ) {

    this.user$ = this.authState.user$;

  }

  logout(){
    this.authService.logout().subscribe({

      next: () => {
        this.authState.clearUser();
        this.router.navigate(['/']);
      },

      error: err => {
        console.error('Error logout:', err);
      }
    });
  }
}