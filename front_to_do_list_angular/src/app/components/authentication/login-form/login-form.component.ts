import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  @Output() 
  forgotPasswordRequested = new EventEmitter<string>();

  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;
  reverify = false;
  resendingVerification = false;
  //emailNotVerified = false;

  constructor(private fb: FormBuilder, private authServ:AuthService, private router: Router, private authState: AuthStateService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  onLogin() {
    this.errorMessage = '';
    this.successMessage = '';
    this.reverify = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authServ.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe
    }).subscribe({
      next: response => {
        this.loading = false;

        //console.log('Login exitoso', response.user!.email);

        this.authState.loadUser();
        this.router.navigate(['/home']);
      },
      error: err => {
        //console.log(err.status);
        this.loading = false;

        this.errorMessage =
          err?.error?.error ||
          'No se ha podido iniciar sesión. Inténtalo de nuevo.';

        if(err.status === 403 && err?.error?.error?.includes('Debes verificar tu correo')){
          this.reverify = true;
        }
      }
    });
  }
  resendVerificationEmail(): void {
    const email = this.loginForm.get('email')?.value;

    if (!email || this.resendingVerification) return;

    this.resendingVerification = true;
    this.successMessage = '';

    this.authServ.resendVerificationEmail(email).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.resendingVerification = false;
        this.reverify = false;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.resendingVerification = false;
        this.errorMessage =
          err?.error?.error ||
          'No se pudo reenviar el correo de verificación.';
      }
    });
  }
  onForgotPassword() {
    this.forgotPasswordRequested.emit(this.loginForm.value.email ?? '');
  }
}
