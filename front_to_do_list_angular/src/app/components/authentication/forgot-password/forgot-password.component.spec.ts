
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../services/auth.service';

describe('ForgotPasswordComponent', () => {

  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'forgotPassword'
    ]);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .overrideComponent(ForgotPasswordComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Validaciones del formulario', () => {

    it('Debe exigir un correo electrónico', () => {

      const email = component.loginForm.get('email');

      email?.setValue('');

      expect(email?.hasError('required')).toBeTrue();
    });

    it('Debe rechazar un correo con formato incorrecto', () => {

      const email = component.loginForm.get('email');

      email?.setValue('correo_invalido');

      expect(email?.hasError('email')).toBeTrue();
    });

    it('Debe aceptar un correo electrónico válido', () => {

      const email = component.loginForm.get('email');

      email?.setValue('test@test.com');

      expect(email?.valid).toBeTrue();
    });
  });

  describe('ngOnChanges', () => {

    it('Debe actualizar el formulario cuando cambia el email recibido', () => {

      fixture.componentRef.setInput('email', 'usuario@test.com');
      fixture.detectChanges();

      expect(component.loginForm.get('email')?.value)
        .toBe('usuario@test.com');
    });
  });

  describe('onForgotPassword', () => {

    it('No debe enviar el formulario si el email es inválido', () => {

      component.loginForm.patchValue({
        email: 'correo_invalido'
      });

      component.onForgotPassword();

      expect(component.loginForm.invalid).toBeTrue();
      expect(component.loginForm.touched).toBeTrue();
      expect(authServiceMock.forgotPassword).not.toHaveBeenCalled();
    });

    it('Debe enviar el correo y mostrar el mensaje de confirmación', () => {

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      authServiceMock.forgotPassword.and.returnValue(
        of({
          message: 'Correo de recuperación enviado.',
          user: {}
        })
      );

      component.onForgotPassword();

      expect(authServiceMock.forgotPassword)
        .toHaveBeenCalledWith('test@test.com');

      expect(component.successMessage)
        .toBe('Correo de recuperación enviado.');

      expect(component.errorMessage).toBe('');
      expect(component.loading).toBeFalse();
    });

    it('Debe mostrar el error recibido del servidor', () => {

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      authServiceMock.forgotPassword.and.returnValue(
        throwError(() => ({
          status: 400,
          error: {
            error: 'Formato email incorrecto.'
          }
        }))
      );

      component.onForgotPassword();

      expect(component.errorMessage)
        .toBe('Formato email incorrecto.');

      expect(component.loading).toBeFalse();
      expect(component.successMessage).toBe('');
    });

    it('Debe mostrar un mensaje genérico si el error no contiene mensaje', () => {

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      authServiceMock.forgotPassword.and.returnValue(
        throwError(() => ({
          status: 500,
          error: {}
        }))
      );

      component.onForgotPassword();

      expect(component.errorMessage)
        .toBe('No se ha podido enviar el correo. Inténtalo de nuevo.');

      expect(component.loading).toBeFalse();
    });
  });

  describe('toggleFormLogIn', () => {

    it('Debe emitir el evento para volver al formulario de login', () => {

      spyOn(component.backToLogin, 'emit');

      component.toggleFormLogIn();

      expect(component.backToLogin.emit).toHaveBeenCalledTimes(1);
    });
  });

});
