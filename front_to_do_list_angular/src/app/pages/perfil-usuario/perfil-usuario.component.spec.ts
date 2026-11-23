
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';
import { User } from '../../models/user.model';

describe('PerfilUsuarioComponent', () => {

  let component: PerfilUsuarioComponent;
  let fixture: ComponentFixture<PerfilUsuarioComponent>;

  let userServiceMock: jasmine.SpyObj<UserService>;
  let authStateMock: jasmine.SpyObj<AuthStateService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockUser: User = {
    user_id: 'user_1',
    name: 'Usuario',
    lastname: 'Prueba',
    username: 'usuario_test',
    email: 'test@test.com',
    role: 'user',
    phone: '600000000',
    avatar_url: null,
    password: ''
  };

  beforeEach(async () => {

    userServiceMock = jasmine.createSpyObj('UserService', [
      'getPerfil',
      'updatePerfil',
      'uploadAvatar',
      'deleteFotoDePerfil',
      'deleteProfile'
    ]);

    authStateMock = jasmine.createSpyObj('AuthStateService', [
      'clearUser'
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    userServiceMock.getPerfil.and.returnValue(
      of({
        message: 'Perfil encontrado',
        user: { ...mockUser }
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [PerfilUsuarioComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: {} },
        { provide: AuthStateService, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .overrideComponent(PerfilUsuarioComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Carga del perfil', () => {

    it('Debe obtener los datos del usuario autenticado', () => {

      expect(userServiceMock.getPerfil).toHaveBeenCalledTimes(1);

      expect(component.user).toEqual(mockUser);
    });
  });

  describe('Edición del perfil', () => {

    it('Debe activar la edición y guardar una copia del usuario', () => {

      component.editProfile();

      expect(component.editing).toBeTrue();
      expect(component.backupUser).toEqual(mockUser);

      expect(component.backupUser).not.toBe(component.user);
    });

    it('Debe restaurar los datos originales al cancelar', () => {

      component.editProfile();

      component.user.username = 'nombre_modificado';

      component.cancelEdit();

      expect(component.user.username).toBe('usuario_test');
      expect(component.editing).toBeFalse();
    });

    it('Debe actualizar correctamente el perfil', () => {

      component.editProfile();
      component.user.username = 'nuevo_usuario';

      const updatedUser = { ...component.user };

      userServiceMock.updatePerfil.and.returnValue(
        of({
          message: 'Perfil actualizado.',
          user: updatedUser
        } as any)
      );

      component.saveProfile();

      expect(userServiceMock.updatePerfil)
        .toHaveBeenCalledWith(updatedUser);

      expect(component.user).toEqual(updatedUser);
      expect(component.editing).toBeFalse();
      expect(component.successMessage).toBe('Perfil actualizado.');
    });

    it('Debe rechazar un nombre de usuario demasiado corto', () => {

      component.user.username = 'ab';

      component.saveProfile();

      expect(userServiceMock.updatePerfil).not.toHaveBeenCalled();

      expect(component.errorMessage).toBe(
        'El nombre de usuario debe tener entre 3 y 44 caracteres.'
      );
    });

    it('Debe mostrar el error recibido al actualizar el perfil', () => {

      component.user.username = 'usuario_valido';

      userServiceMock.updatePerfil.and.returnValue(
        throwError(() => ({
          status: 400,
          error: {
            error: 'El nombre de usuario ya está en uso'
          }
        }))
      );

      component.saveProfile();

      expect(component.errorMessage).toBe(
        'El nombre de usuario ya está en uso'
      );
    });
  });

  describe('Avatar', () => {

    it('Debe subir una imagen y actualizar la URL del avatar', () => {

      const file = new File(
        ['imagen de prueba'],
        'avatar.png',
        { type: 'image/png' }
      );

      const event = {
        target: {
          files: [file]
        }
      } as unknown as Event;

      userServiceMock.uploadAvatar.and.returnValue(
        of({
          message: 'Avatar actualizado',
          user: {
            ...mockUser,
            avatar_url: '/uploads/avatars/avatar.png'
          }
        } as any)
      );

      component.onAvatarSelected(event);

      expect(userServiceMock.uploadAvatar).toHaveBeenCalledWith(file);

      expect(component.user.avatar_url).toBe(
        '/uploads/avatars/avatar.png'
      );
    });

    it('No debe subir ningún archivo si no se ha seleccionado una imagen', () => {

      const event = {
        target: {
          files: []
        }
      } as unknown as Event;

      component.onAvatarSelected(event);

      expect(userServiceMock.uploadAvatar).not.toHaveBeenCalled();
    });

    it('Debe eliminar la foto de perfil', () => {

      component.user.avatar_url = '/uploads/avatars/avatar.png';

      userServiceMock.deleteFotoDePerfil.and.returnValue(
        of({
          message: 'Foto eliminada'
        } as any)
      );

      component.eliminarFoto();

      expect(userServiceMock.deleteFotoDePerfil)
        .toHaveBeenCalledTimes(1);

      expect(component.user.avatar_url).toBeNull();
    });
  });

  describe('Eliminación de cuenta', () => {

    it('No debe eliminar la cuenta si el usuario cancela la confirmación', () => {

      spyOn(window, 'confirm').and.returnValue(false);

      component.confirmDeleteProfile();

      expect(userServiceMock.deleteProfile).not.toHaveBeenCalled();
      expect(authStateMock.clearUser).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('Debe eliminar la cuenta, limpiar la sesión y navegar al inicio', () => {

      spyOn(window, 'confirm').and.returnValue(true);

      userServiceMock.deleteProfile.and.returnValue(
        of({
          message: 'Perfil eliminado'
        } as any)
      );

      component.confirmDeleteProfile();

      expect(userServiceMock.deleteProfile).toHaveBeenCalledTimes(1);
      expect(authStateMock.clearUser).toHaveBeenCalledTimes(1);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

});
