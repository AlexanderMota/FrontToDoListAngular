import { AuthService } from '../../../services/auth.service';
import { Component, Output, EventEmitter, Input  } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  @Input() 
  email = '';

  @Output() 
  backToLogin = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private authServ:AuthService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgotPassword() {
    if (this.loginForm.valid) {

      this.authServ.forgotPassword(this.loginForm.value.email).subscribe({ next : response => {
        console.log('Recuperación de contraseña exitosa', response);

      }, error: err => {
        console.error('Error en la recuperación de contraseña', err);

      }});
    }
  }
  toggleFormLogIn(){
    this.backToLogin.emit();
  }
}
