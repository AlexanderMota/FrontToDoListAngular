import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskService } from './task.service';
import { environment } from '../../enviroments/enviroment';
import { Task } from '../models/tarea.model';
import { RequestTask } from '../models/request_task.model';


describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/tareas/`;

  beforeEach(() => {
      TestBed.configureTestingModule({
      providers: [
          TaskService,
          provideHttpClient(),
          provideHttpClientTesting()
      ]
      });

      service = TestBed.inject(TaskService);
      httpMock = TestBed.inject(HttpTestingController);
  });
  

  afterEach(() => {
      httpMock.verify();
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getTaskById', () => {

    it('Debe obtener la tarea con un ID especifico', () => {

      const mockResponse = {
        message: 'Tarea encontrada.',
        task: {
          task_id: 3,
          name: 'tarea_test',
          description: 'tarea  hecho por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'private'
        } as Task
      };

      service.getTaskById(String(3)).subscribe(response => {
        expect(response.message).toBe('Tarea encontrada.');
        expect(response.task?.name).toBe('tarea_test');
      });

      const req = httpMock.expectOne(`${apiUrl}tarea/3`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  
  describe('getParentTasks', () => {

    it('Debe obtener las tareas sin padre', () => {

      const mockResponse = {
        message: 'Tareas encontradas.',
        tasks: [{
          task_id: 3,
          name: 'tarea_test',
          description: 'tarea  hecho por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'private'
        }] as Task[]
      };

      service.getParentTasks().subscribe(response => {
        expect(response.message).toBe('Tareas encontradas.');
        expect(response.tasks).toEqual(mockResponse.tasks);
      });

      const req = httpMock.expectOne(`${apiUrl}principales`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('getSubTasks', () => {

    it('Debe obtener las subtareas de una tarea padre', () => {

      const mockResponse = {
        message: 'Subtareas encontradas.',
        tasks: [{
          task_id: 4,
          name: 'tarea_test',
          description: 'tarea  hecho por un test',
          parent_task_id: 3,
          created_by: "user_id_test",
          request_task : {} as RequestTask,
          visibility:'public'
        },{
          task_id: 43,
          name: 'tarea_test2',
          description: 'tarea  hecha por un test',
          parent_task_id: 3,
          created_by: "user_id_test",
          request_task : {status:'accepted'} as RequestTask,
          visibility:'private'
        }] as Task[]
      };

      service.getSubTasks(String(3)).subscribe(response => {
        expect(response.message).toBe('Subtareas encontradas.');
        expect(response.tasks).toEqual(mockResponse.tasks);
      });

      const req = httpMock.expectOne(`${apiUrl}derivadas/3`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('getCollabTasks', () => {

    it('Debe obtener las tareas en las que colaboramos', () => {

      const mockResponse = {
        message: 'Tareas encontradas.',
        tasks: [{
          task_id: 4,
          name: 'subtarea_test',
          description: 'tarea  hecha por un test',
          parent_task_id: 3,
          created_by: "user_id_test",
          visibility:'private'
        },{
          task_id: 45,
          name: 'tarea_test2',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'private'
        }] as Task[]
      };

      service.getCollabTasks().subscribe(response => {
        expect(response.message).toBe('Tareas encontradas.');
        expect(response.tasks).toEqual(mockResponse.tasks);
      });

      const req = httpMock.expectOne(`${apiUrl}colaborando`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('getInvitedTasks', () => {

    it('Debe obtener las tareas con una solicitud o invitacion pendientes. Ya sea enviada por nosotros o por el solicitante de colaboración (Futuras notificaciones).', () => {

      const mockResponse = {
        message: 'Tareas encontradas.',
        tasks: [{
          task_id: 4,
          name: 'subtarea_test',
          description: 'tarea  hecha por un test',
          parent_task_id: 3,
          created_by: "user_id_test",
          request_task: {status:'pending'} as RequestTask,
          visibility:'private'
        },{
          task_id: 45,
          name: 'tarea_test2',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          request_task: {status:'pending'} as RequestTask,
          visibility:'private'
        }] as Task[]
      };

      service.getInvitedTasks().subscribe(response => {
        expect(response.message).toBe('Tareas encontradas.');
        expect(response.tasks).toEqual(mockResponse.tasks);
      });

      const req = httpMock.expectOne(`${apiUrl}invitaciones`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('getPublicTasks', () => {

    it('Debe obtener las tareas marcadas como públicas.', () => {

      const mockResponse = {
        message: 'Tareas encontradas.',
        tasks: [{
          task_id: 4,
          name: 'subtarea_test',
          description: 'tarea  hecha por un test',
          parent_task_id: 3,
          created_by: "user_id_test",
          request_task: {status:'accepted'} as RequestTask,
          visibility:'public'
        },{
          task_id: 45,
          name: 'tarea_test2',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          request_task: {status:'pending'} as RequestTask,
          visibility:'public'
        }] as Task[]
      };

      service.getPublicTasks().subscribe(response => {
        expect(response.message).toBe('Tareas encontradas.');
        expect(response.tasks).toEqual(mockResponse.tasks);
      });

      const req = httpMock.expectOne(`${apiUrl}publicas`);

      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
    
  });
  describe('postTask', () => {

    it('Debe enviar una tarea al back.', () => {

      const mockResponse = {
        message: 'Tarea creada exitosamente.',
        task: {
          task_id: 22,
          name: 'tarea_test',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'public'
        } as Task
      };


      service.postTask(mockResponse.task).subscribe(response => {
        expect(response.message).toBe('Tarea creada exitosamente.');
        expect(response.task).toEqual(mockResponse.task);
      });

      const req = httpMock.expectOne(`${apiUrl}`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        task: mockResponse.task
      });
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('updateTask', () => {

    it('Debe actualizar una tarea y devolcerla.', () => {

      const mockResponse = {
        message: 'Tarea actualizada exitosamente.',
        task: {
          task_id: 22,
          name: 'tarea_test_actualizada',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'public'
        } as Task
      };

      service.updateTask(mockResponse.task).subscribe(response => {
        expect(response.message).toBe('Tarea actualizada exitosamente.');
        expect(response.task).toEqual(mockResponse.task);
      });

      const req = httpMock.expectOne(`${apiUrl}tarea/22`);

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        task: mockResponse.task
      });
      
      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
  describe('deleteTask', () => {

    it('Debe eliminar una tarea.', () => {

      const mockResponse = {
        message: 'Tarea eliminada exitosamente.',
        task: {
          task_id: 22,
          name: 'tarea_test',
          description: 'tarea  hecha por un test',
          parent_task_id: null,
          created_by: "user_id_test",
          visibility:'public'
        } as Task
      };


      service.deleteTask(String(mockResponse.task.task_id)).subscribe(response => {
        expect(response.message).toBe('Tarea eliminada exitosamente.');
        expect(response.task).toBe(mockResponse.task);
      });

      const req = httpMock.expectOne(`${apiUrl}tarea/${mockResponse.task.task_id}`);

      expect(req.request.method).toBe('DELETE');

      expect(req.request.withCredentials).toBeTrue();

      req.flush(mockResponse);
    });
  });
});