
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { TareaComponent } from './tarea.component';
import { TaskService } from '../../services/task.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Task } from '../../models/tarea.model';
import { User } from '../../models/user.model';

describe('TareaComponent', () => {

  let component: TareaComponent;
  let fixture: ComponentFixture<TareaComponent>;

  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerMock: jasmine.SpyObj<Router>;

  let userSubject: BehaviorSubject<User | null>;
  let routeParams: BehaviorSubject<any>;

  let taskId = '10';
  let parentId: string | null = null;

  const mockTask: Task = {
    task_id: 10,
    created_by: 'user_1',
    name: 'Tarea de prueba',
    description: 'Descripción de prueba',
    status: 'pending',
    priority: 'low',
    parent_task_id: null,
    created_at: null,
    updated_at: null,
    username: 'usuario',
    avatar_url: null,
    visibility: 'private'
  };

  beforeEach(async () => {

    taskId = '10';
    parentId = null;

    userSubject = new BehaviorSubject<User | null>(null);
    routeParams = new BehaviorSubject(convertToParamMap({ id: taskId }));

    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'getTaskById',
      'postTask',
      'updateTask',
      'deleteTask'
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    taskServiceMock.getTaskById.and.returnValue(
      of({
        message: 'Tarea encontrada',
        task: { ...mockTask }
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [TareaComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        {
          provide: AuthStateService,
          useValue: { user$: userSubject.asObservable() }
        },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParams.asObservable(),
            snapshot: {
              get paramMap() {
                return convertToParamMap({ id: taskId });
              },
              get queryParamMap() {
                return convertToParamMap(
                  parentId ? { parent: parentId } : {}
                );
              }
            }
          }
        },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .overrideComponent(TareaComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareaComponent);
    component = fixture.componentInstance;
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {

    it('Debe cargar la tarea indicada en la URL', () => {

      fixture.detectChanges();

      expect(taskServiceMock.getTaskById)
        .toHaveBeenCalledWith('10');

      expect(component.task.name).toBe('Tarea de prueba');
      expect(component.modoCreacion).toBeFalse();
    });

    it('Debe actualizar currentUser cuando cambia el usuario autenticado', () => {

      fixture.detectChanges();

      userSubject.next({
        user_id: 'user_1'
      } as User);

      expect(component.currentUser).toBe('user_1');

      userSubject.next(null);

      expect(component.currentUser).toBe('');
    });

    it('Debe recargar la tarea cuando cambian los parámetros de la ruta', () => {

      fixture.detectChanges();

      taskId = '20';

      routeParams.next(convertToParamMap({ id: '20' }));

      expect(taskServiceMock.getTaskById)
        .toHaveBeenCalledWith('20');

      expect(taskServiceMock.getTaskById)
        .toHaveBeenCalledTimes(2);
    });
  });

  describe('Modo creación', () => {

    it('Debe inicializar una tarea nueva con los valores por defecto', () => {

      taskId = 'nueva';

      fixture.detectChanges();

      expect(component.modoCreacion).toBeTrue();
      expect(component.editing).toBeTrue();

      expect(component.task.name).toBe('');
      expect(component.task.status).toBe('pending');
      expect(component.task.priority).toBe('low');
      expect(component.task.visibility).toBe('private');
      expect(component.task.parent_task_id).toBeNull();

      expect(taskServiceMock.getTaskById)
        .not.toHaveBeenCalled();
    });

    it('Debe asignar el padre al crear una subtarea', () => {

      taskId = 'nueva';
      parentId = '15';

      fixture.detectChanges();

      expect(component.task.parent_task_id).toBe(15);
    });
  });

  describe('Edición', () => {

    it('Debe activar el modo edición', () => {

      component.editTask();

      expect(component.editing).toBeTrue();
    });

    it('Debe cancelar la edición sin navegar si es una tarea existente', () => {

      component.editing = true;
      component.modoCreacion = false;

      component.cancelEdit();

      expect(component.editing).toBeFalse();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('Debe volver a home al cancelar la creación', () => {

      component.modoCreacion = true;
      component.editing = true;

      component.cancelEdit();

      expect(routerMock.navigate)
        .toHaveBeenCalledWith(['/home']);

      expect(component.editing).toBeFalse();
    });
  });

  describe('saveTask', () => {

    it('Debe crear una tarea nueva y navegar a su detalle', () => {

      component.modoCreacion = true;
      component.task = { ...mockTask, task_id: undefined };

      taskServiceMock.postTask.and.returnValue(
        of({
          message: 'Tarea creada',
          task: { ...mockTask, task_id: 25 }
        } as any)
      );

      component.saveTask();

      expect(taskServiceMock.postTask)
        .toHaveBeenCalledWith(component.task);

      expect(routerMock.navigate)
        .toHaveBeenCalledWith(['/tarea', 25]);
    });

    it('No debe navegar si la respuesta de creación no contiene task_id', () => {

      component.modoCreacion = true;
      component.task = { ...mockTask, task_id: undefined };

      taskServiceMock.postTask.and.returnValue(
        of({
          message: 'Tarea creada',
          task: null
        } as any)
      );

      spyOn(console, 'error');

      component.saveTask();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('Debe actualizar una tarea existente y finalizar la edición', () => {

      component.modoCreacion = false;
      component.editing = true;
      component.task = { ...mockTask };

      taskServiceMock.updateTask.and.returnValue(
        of({
          message: 'Tarea actualizada',
          task: mockTask
        } as any)
      );

      component.saveTask();

      expect(taskServiceMock.updateTask)
        .toHaveBeenCalledWith(component.task);

      expect(component.editing).toBeFalse();
    });
  });

  describe('deleteTask', () => {

    it('Debe eliminar la tarea y volver a home', () => {

      component.task_id = '10';

      taskServiceMock.deleteTask.and.returnValue(
        of({
          message: 'Tarea eliminada'
        } as any)
      );

      component.deleteTask();

      expect(taskServiceMock.deleteTask)
        .toHaveBeenCalledWith('10');

      expect(routerMock.navigate)
        .toHaveBeenCalledWith(['/home']);
    });
  });

  describe('Acceso a la tarea padre', () => {

    it('Debe permitir volver al padre cuando el usuario tiene acceso', () => {

      component.task = {
        ...mockTask,
        parent_task_id: 5
      };

      component.canAccessParent = true;

      component.volverAlPadre();

      expect(routerMock.navigate)
        .toHaveBeenCalledWith(['/tarea', 5]);
    });

    it('No debe navegar al padre si el usuario no tiene acceso', () => {

      component.task = {
        ...mockTask,
        parent_task_id: 5
      };

      component.canAccessParent = false;

      component.volverAlPadre();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('Debe habilitar el acceso al padre si el servicio devuelve la tarea', () => {

      taskServiceMock.getTaskById.and.returnValue(
        of({
          message: 'Tarea encontrada',
          task: mockTask
        } as any)
      );

      component.checkParentAccess(5);

      expect(taskServiceMock.getTaskById)
        .toHaveBeenCalledWith('5');

      expect(component.canAccessParent).toBeTrue();
    });

    it('Debe denegar el acceso al padre si el servicio devuelve 403', () => {

      taskServiceMock.getTaskById.and.returnValue(
        throwError(() => ({
          status: 403
        }))
      );

      component.checkParentAccess(5);

      expect(component.canAccessParent).toBeFalse();
    });
  });

});
