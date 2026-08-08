import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { switchMap } from 'rxjs';

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

  constructor(private fb: FormBuilder, private authServ:AuthService, private router: Router ) {
    this.registerForm = this.fb.group({
  name: ['', [ Validators.maxLength(45) ]],

  lastname: ['', [ Validators.maxLength(45) ]],

  username: ['', [
    Validators.required, 
    Validators.minLength(3),
    Validators.maxLength(30)
  ]],

  email: ['', [
    Validators.required, 
    Validators.email
  ]],

  phone: ['', [ Validators.pattern(/^[0-9]{9}$/) ]],

  password: ['', [Validators.required, Validators.minLength(6)]],

      rememberMe: [false]
    });
  }
  onRegister(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    const newUser : User = {
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

    this.authServ.register(newUser).pipe(

      switchMap(() =>
        this.authServ.login({
          email: newUser.email,
          password: newUser.password!,
          rememberMe: this.registerForm.value.rememberMe
        })
      )

    ).subscribe({

      next: () => this.router.navigate(['/perfil']),
      error: err => console.error(err)

    });
/*
    this.authServ.register(newUser).subscribe({

      next: response => {
        console.log('Registro exitoso', response.user);

        this.authServ.login({
          email: newUser.email,
          password: newUser.password
        }).subscribe({
          next: () => this.router.navigate(['/private']),
          error: err => console.error('Error iniciando sesión automáticamente', err)
        });
      },
      error: err => console.error('Error en el registro', err)
    });
*/
  }
}
