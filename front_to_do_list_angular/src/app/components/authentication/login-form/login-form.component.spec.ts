
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth-state.service';

describe('LoginFormComponent', () => {

  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let authStateMock: jasmine.SpyObj<AuthStateService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'login',
      'resendVerificationEmail'
    ]);

    authStateMock = jasmine.createSpyObj('AuthStateService', [
      'loadUser'
    ]);

    routerMock = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthStateService, useValue: authStateMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .overrideComponent(LoginFormComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Validaciones del formulario', () => {

    it('Debe exigir un email', () => {
      const email = component.loginForm.get('email');

      email?.setValue('');

      expect(email?.hasError('required')).toBeTrue();
    });

    it('Debe rechazar un email con formato incorrecto', () => {
      const email = component.loginForm.get('email');

      email?.setValue('correo_invalido');

      expect(email?.hasError('email')).toBeTrue();
    });

    it('Debe exigir una contraseña de al menos 8 caracteres', () => {
      const password = component.loginForm.get('password');

      password?.setValue('12345');

      expect(password?.hasError('minlength')).toBeTrue();

      password?.setValue('12345678');

      expect(password?.valid).toBeTrue();
    });
  });

  describe('onLogin', () => {

    it('No debe llamar al servicio si el formulario es inválido', () => {

      component.onLogin();

      expect(component.loginForm.invalid).toBeTrue();
      expect(component.loginForm.touched).toBeTrue();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('Debe enviar correctamente las credenciales', () => {

      component.loginForm.setValue({
        email: 'test@test.com',
        password: 'password123',
        rememberMe: true
      });

      authServiceMock.login.and.returnValue(
        of({
          message: 'Login exitoso.',
          user: null
        } as any)
      );

      component.onLogin();

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        rememberMe: true
      });
    });

    it('Debe actualizar el estado y navegar a home tras un login correcto', () => {

      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123'
      });

      authServiceMock.login.and.returnValue(
        of({
          message: 'Login exitoso.',
          user: null
        } as any)
      );

      component.onLogin();

      expect(authStateMock.loadUser).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
      expect(component.loading).toBeFalse();
    });

    it('Debe mostrar el mensaje de error si las credenciales son incorrectas', () => {

      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123'
      });

      authServiceMock.login.and.returnValue(
        throwError(() => ({
          status: 401,
          error: {
            error: 'Credenciales incorrectas'
          }
        }))
      );

      component.onLogin();

      expect(component.errorMessage).toBe('Credenciales incorrectas');
      expect(component.loading).toBeFalse();
      expect(authStateMock.loadUser).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('Debe permitir reenviar la verificación si el correo no está verificado', () => {

      component.loginForm.patchValue({
        email: 'test@test.com',
        password: 'password123'
      });

      authServiceMock.login.and.returnValue(
        throwError(() => ({
          status: 403,
          error: {
            error: 'Debes verificar tu correo antes de iniciar sesión'
          }
        }))
      );

      component.onLogin();

      expect(component.reverify).toBeTrue();
      expect(component.loading).toBeFalse();
    });
  });

  describe('resendVerificationEmail', () => {

    it('Debe reenviar el correo y mostrar un mensaje de confirmación', () => {

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      authServiceMock.resendVerificationEmail.and.returnValue(
        of({
          message: 'Correo de verificación enviado'
        } as any)
      );

      component.reverify = true;

      component.resendVerificationEmail();

      expect(
        authServiceMock.resendVerificationEmail
      ).toHaveBeenCalledWith('test@test.com');

      expect(component.successMessage).toBe(
        'Correo de verificación enviado'
      );

      expect(component.reverify).toBeFalse();
      expect(component.resendingVerification).toBeFalse();
    });

    it('Debe mostrar el error si falla el reenvío', () => {

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      authServiceMock.resendVerificationEmail.and.returnValue(
        throwError(() => ({
          status: 500,
          error: {
            error: 'No se pudo enviar el correo'
          }
        }))
      );

      component.resendVerificationEmail();

      expect(component.errorMessage).toBe(
        'No se pudo enviar el correo'
      );

      expect(component.resendingVerification).toBeFalse();
    });
  });

  describe('onForgotPassword', () => {

    it('Debe emitir el email al solicitar recuperar la contraseña', () => {

      spyOn(component.forgotPasswordRequested, 'emit');

      component.loginForm.patchValue({
        email: 'test@test.com'
      });

      component.onForgotPassword();

      expect(
        component.forgotPasswordRequested.emit
      ).toHaveBeenCalledWith('test@test.com');
    });
  });

});
