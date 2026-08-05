import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Component } from '@angular/core';
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

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authServ:AuthService, private router: Router, private authState: AuthStateService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {

      this.authServ.login({ 
        email: this.loginForm.value.email, 
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe

      }).subscribe({ next : response => {
        console.log('Login exitoso', response.user!.email);
        this.authState.loadUser();
        this.router.navigate(['/home']);

      }, error: err => {
        console.error('Error en el login', err);

      }});
    }
  }
}
