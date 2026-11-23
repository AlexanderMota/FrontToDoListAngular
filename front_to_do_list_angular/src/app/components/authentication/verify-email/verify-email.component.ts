import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {

  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // Evitar ejecutar la verificación durante SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.message = 'No se ha proporcionado un token de verificación.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.message = response.message;
      },
      error: (error) => {
        this.loading = false;
        this.success = false;
        this.message =
          error?.error?.error ||
          'No se pudo verificar el correo electrónico.';
      }
    });
  }
}