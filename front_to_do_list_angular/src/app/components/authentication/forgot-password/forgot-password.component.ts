import { 
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
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
export class ForgotPasswordComponent implements OnChanges {

  @Input()
  email = '';

  @Output()
  backToLogin = new EventEmitter<void>();

  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authServ: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email']) {
      this.loginForm.patchValue({
        email: this.email
      });
    }
  }

  onForgotPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authServ.forgotPassword(
      this.loginForm.value.email
    ).subscribe({
      next: response => {
        this.loading = false;
        this.successMessage = response.message;
      },
      error: err => {
        this.loading = false;

        this.errorMessage =
          err?.error?.error ||
          'No se ha podido enviar el correo. Inténtalo de nuevo.';
      }
    });
  }
  toggleFormLogIn(){
    this.backToLogin.emit();
  }
}
