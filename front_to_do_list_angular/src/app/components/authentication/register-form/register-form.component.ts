import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-register-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authServ:AuthService, 
    private router: Router ) {

    this.registerForm = this.fb.group({

      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],

      name: ['', [ Validators.maxLength(45) ]],
      lastname: ['', [ Validators.maxLength(45) ]],

      phone: ['', [ Validators.pattern(/^[0-9]{9}$/) ]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });

    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      const emailControl = this.registerForm.get('email');

      if (emailControl?.hasError('emailExists')) {
        const errors = { ...emailControl.errors };
        delete errors['emailExists'];

        emailControl.setErrors(
          Object.keys(errors).length ? Object.keys(errors) : null
        );
      }
    });
  }
  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    const newUser: User = {
      user_id: "",
      name: formValue.name?.trim() || null,
      lastname: formValue.lastname?.trim() || null,
      username: formValue.username.trim(),
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
      phone: formValue.phone?.trim() || null,
      avatar_url: null,
      role: 'Viewer'
    };

    this.loading = true;
    this.errorMessage = '';

    this.authServ.register(newUser).subscribe({
      next: (response) => {

        this.errorMessage = '';

        this.successMessage = response.message;
      },

      error: (err) => {
        this.loading = false;

        const message = err.error?.error || 'Error al registrar el usuario';

        if (message.includes('email ya se encuentra registrado')) {
          const emailControl = this.registerForm.get('email');

          emailControl?.setErrors({
            ...emailControl.errors,
            emailExists: true
          });

          emailControl?.markAsTouched();

        } else if (message.includes('nickname ya se encuentra registrado')) {
          const usernameControl = this.registerForm.get('username');

          usernameControl?.setErrors({
            ...usernameControl.errors,
            usernameExists: true
          });

          usernameControl?.markAsTouched();

        } else {
          this.errorMessage = message;
        }
      }
    });
  }
}
