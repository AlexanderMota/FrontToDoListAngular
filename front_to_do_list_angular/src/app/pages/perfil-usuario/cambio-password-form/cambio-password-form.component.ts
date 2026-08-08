import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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

  @Input()
  editingPass = false;

  passwordForm: any;

  private fb = inject(FormBuilder);
  
  constructor(private userService: UserService) { 
    
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordsMatchValidator
      } as AbstractControlOptions
    );
  }

  
  onChangePassword(): void {

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const form = this.passwordForm.getRawValue();

    this.userService.updatePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    }).subscribe({

      next: (res) => {

        console.log(res);

        this.passwordForm.reset();

        this.editingPass = false;
      },
      error: (err) => console.error(err)
    });
  }

  cancelChangePassword(){
    this.editingPass = false;
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
