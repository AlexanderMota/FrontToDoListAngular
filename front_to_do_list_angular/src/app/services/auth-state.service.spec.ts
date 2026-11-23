
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';
import { User, UserResponse } from '../models/user.model';

describe('AuthStateService', () => {

  let service: AuthStateService;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    user_id: 'user_test',
    name: 'Usuario',
    lastname: 'Prueba',
    username: 'usuario_test',
    email: 'test@test.com',
    role: 'user',
    phone: null,
    avatar_url: null,
    password: null
  };

  beforeEach(() => {

    authServiceMock = jasmine.createSpyObj('AuthService', ['getMe']);

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthStateService);
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe comenzar sin usuario autenticado', () => {
    expect(service.currentUser).toBeNull();
  });

  it('Debe emitir null inicialmente en user$', () => {

    const receivedUsers: (User | null)[] = [];

    const subscription = service.user$.subscribe(user => {
      receivedUsers.push(user);
    });

    expect(receivedUsers).toEqual([null]);

    subscription.unsubscribe();
  });

  describe('loadUser', () => {

    it('Debe cargar el usuario autenticado correctamente', () => {

      authServiceMock.getMe.and.returnValue(
        of({
          message: 'Perfil encontrado',
          user: mockUser
        } as UserResponse)
      );

      service.loadUser();

      expect(authServiceMock.getMe).toHaveBeenCalledTimes(1);
      expect(service.currentUser).toEqual(mockUser);
    });

    it('Debe emitir el usuario cargado a través de user$', () => {

      const receivedUsers: (User | null)[] = [];

      const subscription = service.user$.subscribe(user => {
        receivedUsers.push(user);
      });

      authServiceMock.getMe.and.returnValue(
        of({
          message: 'Perfil encontrado',
          user: mockUser
        } as UserResponse)
      );

      service.loadUser();

      expect(receivedUsers).toEqual([null, mockUser]);

      subscription.unsubscribe();
    });

    it('Debe limpiar el usuario si getMe devuelve un error', () => {

      authServiceMock.getMe.and.returnValues(
        of({
          message: 'Perfil encontrado',
          user: mockUser
        } as UserResponse),

        throwError(() => ({
          status: 401,
          error: {
            error: 'Usuario no autenticado'
          }
        }))
      );

      service.loadUser();

      expect(service.currentUser).toEqual(mockUser);

      service.loadUser();

      expect(service.currentUser).toBeNull();
      expect(authServiceMock.getMe).toHaveBeenCalledTimes(2);
    });

    it('Debe mantener el estado anterior mientras la petición está pendiente', () => {

      const pendingResponse = new Subject<UserResponse>();

      authServiceMock.getMe.and.returnValue(
        pendingResponse.asObservable()
      );

      service.loadUser();

      expect(service.currentUser).toBeNull();

      pendingResponse.next({
        message: 'Perfil encontrado',
        user: mockUser
      } as UserResponse);

      expect(service.currentUser).toEqual(mockUser);

      pendingResponse.complete();
    });
  });

  describe('clearUser', () => {

    it('Debe limpiar el usuario y notificar el cambio a los suscriptores', () => {

      authServiceMock.getMe.and.returnValue(
        of({
          message: 'Perfil encontrado',
          user: mockUser
        } as UserResponse)
      );

      service.loadUser();

      const receivedUsers: (User | null)[] = [];

      const subscription = service.user$.subscribe(user => {
        receivedUsers.push(user);
      });

      service.clearUser();

      expect(service.currentUser).toBeNull();
      expect(receivedUsers).toEqual([mockUser, null]);

      subscription.unsubscribe();
    });
  });


});
describe('Comportamiento en SSR', () => {
  it('No debe solicitar el usuario cuando se ejecuta en el servidor', () => {
    const serverAuthMock = jasmine.createSpyObj('AuthService', ['getMe']);

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: AuthService, useValue: serverAuthMock },
        { provide: Router, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverService = TestBed.inject(AuthStateService);

    serverService.loadUser();

    expect(serverAuthMock.getMe).not.toHaveBeenCalled();
    expect(serverService.currentUser).toBeNull();
  });
});