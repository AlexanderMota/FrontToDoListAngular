
import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  token: string | null = null;

  loading = false;
  success = false;

  errorMessage = '';

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authServ: AuthService
  ) {

    this.resetForm = this.fb.group({

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      repeatPassword: [
        '',
        [
          Validators.required,
          this.passwordsMatchValidator
        ]
      ]

    });

    // Si cambia la primera contraseña, volvemos a validar la confirmación.
    this.resetForm.get('password')?.valueChanges.subscribe(() => {
      this.resetForm.get('repeatPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {

    // Recuperamos el token incluido en el enlace del correo.
    this.token = this.route.snapshot.queryParamMap.get('token');

  }

  // Validar que las dos contraseñas coincidan.
  private passwordsMatchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {

    const password = control.parent?.get('password')?.value;
    const repeatPassword = control.value;

    if (!password || !repeatPassword) {
      return null;
    }

    return password === repeatPassword
      ? null
      : { passwordMismatch: true };
  };

  onResetPassword(): void {

    this.errorMessage = '';

    const token = this.token;

    if (!token) {
      this.errorMessage = 'El enlace de recuperación no es válido.';
      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password = this.resetForm.get('password')?.value;

    this.loading = true;

    this.authServ.resetPassword(
      token,
      password
    ).subscribe({

      next: response => {

        console.log('ResetPassword exitoso', response);

        this.success = true;
        this.loading = false;
        this.resetForm.disable();

      },

      error: err => {

        console.error('Error al restablecer la contraseña:', err);

        this.loading = false;

        this.errorMessage =
          err?.error?.error ||
          'No se pudo restablecer la contraseña. Inténtalo de nuevo.';

      }

    });
  }
}
