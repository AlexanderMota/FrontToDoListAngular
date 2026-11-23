import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-cambio-password-form',
  imports: [FormsModule, NgIf, 
      ReactiveFormsModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule],
  templateUrl: './cambio-password-form.component.html',
  styleUrl: './cambio-password-form.component.scss'
})
export class CambioPasswordFormComponent {

  @Output()
  editingPass = new EventEmitter<void>();

  passwordForm: any;
  errorMessage = '';
  successMessage = '';
  loading = false;

  private fb = inject(FormBuilder);
  
  constructor(private userService: UserService) { 
    
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordsMatchValidator
      } as AbstractControlOptions
    );
  }

  
  onChangePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const form = this.passwordForm.getRawValue();

    this.loading = true;

    this.userService.updatePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    }).subscribe({

      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Contraseña actualizada correctamente.';
        //this.passwordForm.reset();
      },

      error: (err) => {
        this.loading = false;

        this.errorMessage =
          err?.error?.error ||
          'No se ha podido cambiar la contraseña. Inténtalo de nuevo.';
      }
    });
  }

  cancelChangePassword(){
    this.editingPass.emit();
  }
  passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;

    if (password !== confirm) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
