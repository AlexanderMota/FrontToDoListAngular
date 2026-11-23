
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CambioPasswordFormComponent } from './cambio-password-form.component';
import { UserService } from '../../../services/user.service';

describe('CambioPasswordFormComponent', () => {

  let component: CambioPasswordFormComponent;
  let fixture: ComponentFixture<CambioPasswordFormComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  const validPasswords = {
    currentPassword: 'password123',
    newPassword: 'password456',
    confirmPassword: 'password456'
  };

  beforeEach(async () => {

    userServiceMock = jasmine.createSpyObj('UserService', [
      'updatePassword'
    ]);

    await TestBed.configureTestingModule({
      imports: [CambioPasswordFormComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .overrideComponent(CambioPasswordFormComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioPasswordFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Validaciones del formulario', () => {

    it('Debe exigir la contraseña actual', () => {

      const currentPassword = component.passwordForm.get('currentPassword');

      currentPassword?.setValue('');

      expect(currentPassword?.hasError('required')).toBeTrue();
    });

    it('Debe exigir una nueva contraseña', () => {

      const newPassword = component.passwordForm.get('newPassword');

      newPassword?.setValue('');

      expect(newPassword?.hasError('required')).toBeTrue();
    });

    it('Debe exigir al menos 8 caracteres para la nueva contraseña', () => {

      const newPassword = component.passwordForm.get('newPassword');

      newPassword?.setValue('12345');

      expect(newPassword?.hasError('minlength')).toBeTrue();

      newPassword?.setValue('12345678');

      expect(newPassword?.hasError('minlength')).toBeFalse();
    });

    it('Debe exigir la confirmación de la contraseña', () => {

      const confirmPassword = component.passwordForm.get('confirmPassword');

      confirmPassword?.setValue('');

      expect(confirmPassword?.hasError('required')).toBeTrue();
    });

    it('Debe rechazar contraseñas que no coinciden', () => {

      component.passwordForm.patchValue({
        newPassword: 'password123',
        confirmPassword: 'password456'
      });

      expect(
        component.passwordForm.hasError('passwordMismatch')
      ).toBeTrue();

      component.passwordForm.patchValue({
        confirmPassword: 'password123'
      });

      expect(
        component.passwordForm.hasError('passwordMismatch')
      ).toBeFalse();
    });
  });

  describe('onChangePassword', () => {

    it('No debe llamar al servicio si el formulario es inválido', () => {

      component.passwordForm.patchValue({
        currentPassword: 'password123',
        newPassword: 'password456',
        confirmPassword: 'password789'
      });

      component.onChangePassword();

      expect(component.passwordForm.invalid).toBeTrue();
      expect(component.passwordForm.touched).toBeTrue();

      expect(userServiceMock.updatePassword)
        .not.toHaveBeenCalled();
    });

    it('Debe enviar únicamente la contraseña actual y la nueva', () => {

      component.passwordForm.setValue(validPasswords);

      userServiceMock.updatePassword.and.returnValue(
        of({
          message: 'Contraseña actualizada correctamente.'
        } as any)
      );

      component.onChangePassword();

      expect(userServiceMock.updatePassword).toHaveBeenCalledWith({
        currentPassword: 'password123',
        newPassword: 'password456'
      });
    });

    it('Debe mostrar el mensaje de éxito tras actualizar la contraseña', () => {

      component.passwordForm.setValue(validPasswords);

      userServiceMock.updatePassword.and.returnValue(
        of({
          message: 'Contraseña actualizada correctamente.'
        } as any)
      );

      component.onChangePassword();

      expect(component.successMessage).toBe(
        'Contraseña actualizada correctamente.'
      );

      expect(component.errorMessage).toBe('');
      expect(component.loading).toBeFalse();
    });

    it('Debe mostrar el error recibido del servidor', () => {

      component.passwordForm.setValue(validPasswords);

      userServiceMock.updatePassword.and.returnValue(
        throwError(() => ({
          status: 400,
          error: {
            error: 'La contraseña actual es incorrecta'
          }
        }))
      );

      component.onChangePassword();

      expect(component.errorMessage).toBe(
        'La contraseña actual es incorrecta'
      );

      expect(component.successMessage).toBe('');
      expect(component.loading).toBeFalse();
    });

    it('Debe mostrar un mensaje genérico si el servidor no proporciona uno', () => {

      component.passwordForm.setValue(validPasswords);

      userServiceMock.updatePassword.and.returnValue(
        throwError(() => ({
          status: 500,
          error: {}
        }))
      );

      component.onChangePassword();

      expect(component.errorMessage).toBe(
        'No se ha podido cambiar la contraseña. Inténtalo de nuevo.'
      );

      expect(component.loading).toBeFalse();
    });
  });

  describe('cancelChangePassword', () => {

    it('Debe emitir el evento editingPass al cancelar', () => {

      spyOn(component.editingPass, 'emit');

      component.cancelChangePassword();

      expect(component.editingPass.emit).toHaveBeenCalledTimes(1);
    });
  });

});
