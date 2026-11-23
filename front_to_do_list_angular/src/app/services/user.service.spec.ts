
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Collaborator, Invitation, User, UserResponse } from '../models/user.model';

describe('UserService', () => {

  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/perfil/`;

  const createMockResponse = (
  overrides: Partial<UserResponse> = {}
  ): UserResponse => ({
    message: 'Operación realizada correctamente',
    user: null,
    users: null,
    collaborator: null,
    collaborators: null,
    invitation: null,
    ...overrides
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getPerfil', () => {

    it('Debe obtener el perfil del usuario autenticado', () => {

      const mockUser = {
        user_id: 'user_test',
        name: 'Usuario',
        lastname: 'Prueba',
        username: 'usuario_test',
        email: 'test@test.com',
        role: 'user',
        phone: null,
        avatar_url: null,
        password: null
      } satisfies User;

      const mockResponse = createMockResponse({
        message: 'Perfil encontrado.',
        user: mockUser
      });

      service.getPerfil().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}ver`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('searchUsers', () => {

    it('Debe buscar usuarios enviando query y task_id', () => {
      
      const mockUser = {
        user_id: 'user_test',
        name: 'Usuario',
        lastname: 'Prueba',
        username: 'usuario_test',
        email: 'test@test.com',
        role: 'user',
        phone: null,
        avatar_url: null,
        password: null
      } satisfies User;

      const mockResponse = createMockResponse({
        message: 'Perfiles encontrados (1)',
        user: mockUser
      });

      service.searchUsers('usuario', '3').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        request =>
          request.url === `${apiUrl}buscar/usuario` &&
          request.params.get('task_id') === '3'
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('uploadAvatar', () => {

    it('Debe enviar la imagen mediante FormData', () => {
      
      const mockUser = {
        user_id: 'user_test',
        name: 'Usuario',
        lastname: 'Prueba',
        username: 'usuario_test',
        email: 'test@test.com',
        role: 'user',
        phone: null,
        avatar_url: 'avatar.png',
        password: null
      } satisfies User;
      
      const mockResponse = createMockResponse({
        message: 'Avatar actualizado',
        user: mockUser
      });
      const file = new File(
        ['imagen de prueba'],
        'avatar.png',
        { type: 'image/png' }
      );

      service.uploadAvatar(file).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}avatar`);

      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBeTrue();

      expect(req.request.body instanceof FormData).toBeTrue();

      const formData = req.request.body as FormData;

      expect(formData.get('avatar')).toBe(file);

      req.flush(mockResponse);
    });
  });

  describe('updatePerfil', () => {

    it('Debe enviar únicamente los campos editables del perfil', () => {
      
      const perfil = {
        user_id: 'user_test',
        name: 'Usuario',
        lastname: 'Prueba',
        username: 'usuario_test',
        phone: '600000000',
        email: 'test@test.com'
      } as User;
      
      const mockResponse = createMockResponse({
        message: 'Perfil actualizado',
        user: perfil
      });


      service.updatePerfil(perfil).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('PUT');

      expect(req.request.body).toEqual({
        perfil: {
          name: 'Usuario',
          lastname: 'Prueba',
          username: 'usuario_test',
          phone: '600000000'
        }
      });

      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('updatePassword', () => {

    it('Debe enviar la contraseña actual y la nueva', () => {
      
      
      const mockResponse = createMockResponse({
        message: 'Contraseña actualizada correctamente.',
        user: {} as User
      });
      const password = {
        currentPassword: 'password123',
        newPassword: 'password456'
      };

      service.updatePassword(password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}password`);

      expect(req.request.method).toBe('PUT');

      expect(req.request.body).toEqual({
        password
      });

      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('deleteFotoDePerfil', () => {

    it('Debe enviar la petición para eliminar el avatar', () => { {
      
      const mockUser = {
        user_id: 'user_test',
        name: 'Usuario',
        lastname: 'Prueba',
        username: 'usuario_test',
        email: 'test@test.com',
        role: 'user',
        phone: null,
        avatar_url: 'avatar.png',
        password: null
      } satisfies User;
      
      const mockResponse = createMockResponse({
        message: 'Perfil actualizado.',
        user: mockUser
      });

      service.deleteFotoDePerfil().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}avatar`);

      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    }});
  });

  describe('deleteProfile', () => {

    it('Debe enviar la petición para eliminar el perfil', () => {
      const mockResponse = createMockResponse({
        message: 'Perfil eliminado.',
        user: {} as User
      });
      service.deleteProfile().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('getInvitation', () => {

    it('Debe obtener la invitación de una tarea', () => {
      
      const mockResponse = createMockResponse({
        message: 'Invitación encontrada',
        invitation: {request_task:{task_id:3,status:'pending'}} as Invitation
      });

      service.getInvitation('3').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}invitacion/3`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('getCollabsConfirmed', () => {

    it('Debe obtener los colaboradores confirmados', () => {
      const mockResponse = createMockResponse({
        message: 'Colaboradores encontrados',
        collaborators: [{
          request_task:{
            status:"accepted",
            task_id:3,
            user_id:"id_usuario_pruebas"
          },
          user:{
            username:"usupru",
            avatar_url:"url_del_avatar"}
        }] as Collaborator[]
      });

      service.getCollabsConfirmed('3').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}colaboradores/confirmados/3`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('getCollabsPending', () => {

    it('Debe obtener las solicitudes pendientes', () => {
      const mockResponse = createMockResponse({
        message: 'Solicitudes encontradas',
        collaborators: [{
          request_task:{
            task_id:2,
            sender_user_id:"sender_id",
            user_id:"collab_id",
            status:"pending"
          },
          user:{
            username:"nickname",
            avatar_url:"avatar_del_usuario"
          }
        }] as Collaborator[]
      });
      service.getCollabsPending('3').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}colaboradores/pendientes/3`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('postSolicitudColaboracion', () => {

    it('Debe enviar una solicitud de colaboración', () => {
      const mockResponse = createMockResponse({
        message: 'Solicitud enviada'
      });

      service.postSolicitudColaboracion('user_2', '3')
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        request =>
          request.url === `${apiUrl}colaboradores/user_2` &&
          request.params.get('task_id') === '3'
      );

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('updateSolicitudColaboracion', () => {

    it('Debe actualizar una solicitud de colaboración', () => {
      const mockResponse = createMockResponse({
        message: 'Solicitud actualizada'
      });

      service.updateSolicitudColaboracion('15')
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        `${apiUrl}colaboradores/15`
      );

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('deleteSolicitudColaboracion', () => {

    it('Debe eliminar una solicitud de colaboración', () => {
      const mockResponse = createMockResponse({
        message: 'Solicitud eliminada'
      });

      service.deleteSolicitudColaboracion('15')
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(`${apiUrl}invitacion/15`);

      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

  describe('deleteColaboracion', () => {

    it('Debe eliminar una colaboración', () => {
      const mockResponse = createMockResponse({
        message: 'Colaboración eliminada'
      });

      service.deleteColaboracion('15')
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        `${apiUrl}colaboradores/15`
      );

      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });

});
