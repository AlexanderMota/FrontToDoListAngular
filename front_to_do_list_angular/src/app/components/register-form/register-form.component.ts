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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  onRegister() {
    if (this.registerForm.valid) {

      this.authServ.register({ email: this.registerForm.value.email, password: this.registerForm.value.password })
      .subscribe({ next : response => {
        console.log('Registro exitoso', response.user.email);
        this.authServ.login({ email: this.registerForm.value.email, password: this.registerForm.value.password });
        this.router.navigate(['/private']);
      }, error: err => {
        console.error('Error en el registro', err);
      }});
    }
  }
}
