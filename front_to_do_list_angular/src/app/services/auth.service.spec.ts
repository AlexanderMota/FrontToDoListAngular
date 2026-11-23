
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

describe('AuthService', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/auth/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getMe', () => {

    it('Debe obtener el usuario autenticado', () => {

      const mockResponse = {
        message: 'Usuario activo.',
        user: {
          user_id: 'user-1',
          username: 'usuario_test',
          email: 'test@test.com'
        }
      };

      service.getMe().subscribe(response => {
        expect(response.message).toBe('Usuario activo.');
        expect(response.user?.username).toBe('usuario_test');
      });

      const req = httpMock.expectOne(`${apiUrl}me`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('register', () => {

    it('Debe enviar los datos del usuario para registrarlo', () => {

      const user = {
        username: 'usuario_test',
        email: 'test@test.com',
        password: 'password123'
      } as User;

      const mockResponse = {
        message: 'Perfil creado. Revisa tu correo electrónico para verificar tu cuenta.',
        emailSent: true,
        user
      };

      service.register(user).subscribe(response => {
        expect(response.message).toBe(mockResponse.message);
      });

      const req = httpMock.expectOne(`${apiUrl}register`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user });
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('verifyEmail', () => {

    it('Debe enviar el token de verificación', () => {

      const token = 'verification-token';

      service.verifyEmail(token).subscribe(response => {
        expect(response.message).toBe(
          'Correo electrónico verificado correctamente.'
        );
      });

      const req = httpMock.expectOne(`${apiUrl}verify-email`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token });

      req.flush({
        message: 'Correo electrónico verificado correctamente.',
        user: {}
      });
    });
  });

  describe('resendVerificationEmail', () => {

    it('Debe solicitar el reenvío del correo de verificación', () => {

      const email = 'test@test.com';

      service.resendVerificationEmail(email).subscribe(response => {
        expect(response.message).toContain('recibirás un nuevo enlace');
      });

      const req = httpMock.expectOne(`${apiUrl}resend-verification`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush({
        message: 'Si existe una cuenta pendiente de verificación con ese correo, recibirás un nuevo enlace.',
        user: {}
      });
    });
  });

  describe('login', () => {

    const credentials = {
      email: 'test@test.com',
      password: 'password123',
      rememberMe: true
    };

    it('Debe enviar las credenciales correctamente', () => {

      service.login(credentials).subscribe(response => {
        expect(response.message).toBe('Login exitoso.');
      });

      const req = httpMock.expectOne(`${apiUrl}login`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        user: credentials
      });
      expect(req.request.withCredentials).toBeTrue();

      req.flush({
        message: 'Login exitoso.',
        user: { email: credentials.email }
      });
    });

    it('Debe propagar un error 401 si las credenciales son incorrectas', () => {

      let receivedError: HttpErrorResponse | undefined;

      service.login(credentials).subscribe({
        next: () => fail('El login debería fallar'),
        error: error => receivedError = error
      });

      const req = httpMock.expectOne(`${apiUrl}login`);

      req.flush(
        { error: 'Credenciales incorrectas.' },
        {
          status: 401,
          statusText: 'Unauthorized'
        }
      );

      expect(receivedError?.status).toBe(401);
      expect(receivedError?.error.error).toBe('Credenciales incorrectas.');
    });

    it('Debe propagar un error 403 si el correo no está verificado', () => {

      let receivedError: HttpErrorResponse | undefined;

      service.login(credentials).subscribe({
        next: () => fail('El login debería fallar'),
        error: error => receivedError = error
      });

      const req = httpMock.expectOne(`${apiUrl}login`);

      req.flush(
        {
          error: 'Debes verificar tu correo electrónico antes de iniciar sesión.'
        },
        {
          status: 403,
          statusText: 'Forbidden'
        }
      );

      expect(receivedError?.status).toBe(403);
      expect(receivedError?.error.error).toContain(
        'Debes verificar tu correo electrónico'
      );
    });
  });

  describe('logout', () => {

    it('Debe enviar la petición de cierre de sesión', () => {

      service.logout().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}logout`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      expect(req.request.withCredentials).toBeTrue();

      req.flush({
        message: 'Logout exitoso.',
        user: {}
      });
    });
  });

  describe('forgotPassword', () => {

    it('Debe solicitar la recuperación de contraseña', () => {

      const email = 'test@test.com';

      service.forgotPassword(email).subscribe(response => {
        expect(response.message).toContain(
          'recibirás un enlace'
        );
      });

      const req = httpMock.expectOne(`${apiUrl}forgot-password`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush({
        message: 'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.',
        user: {}
      });
    });
  });

  describe('resetPassword', () => {

    it('Debe enviar el token y la nueva contraseña', () => {

      const token = 'reset-token';
      const password = 'newPassword123';

      service.resetPassword(token, password).subscribe(response => {
        expect(response.message).toBe(
          'Contraseña actualizada correctamente.'
        );
      });

      const req = httpMock.expectOne(`${apiUrl}reset-password`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        token,
        password
      });

      req.flush({
        message: 'Contraseña actualizada correctamente.',
        user: {}
      });
    });

    it('Debe propagar un error 400 si el token ha caducado', () => {

      let receivedError: HttpErrorResponse | undefined;

      service.resetPassword('expired-token', 'password123').subscribe({
        next: () => fail('La recuperación debería fallar'),
        error: error => receivedError = error
      });

      const req = httpMock.expectOne(`${apiUrl}reset-password`);

      req.flush(
        {
          error: 'El enlace de recuperación no es válido o ha caducado.'
        },
        {
          status: 400,
          statusText: 'Bad Request'
        }
      );

      expect(receivedError?.status).toBe(400);
      expect(receivedError?.error.error).toBe(
        'El enlace de recuperación no es válido o ha caducado.'
      );
    });
  });

});
