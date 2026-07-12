import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse } from '../models/tarea.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class TaskService {
  private apiUrl = 'http://localhost:4300/tareas/'; // URL del backend

  constructor(private http: HttpClient) { }

  /*getAll(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}all`, { withCredentials: true });
  }*/
  getParentTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}principales`, { withCredentials: true });
  }
  getSubTasks(parent_task_id : string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}derivadas/${parent_task_id}`, { withCredentials: true });
  }
  getColabTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}colaborando`, { withCredentials: true });
  }
  getTaskById(taskId: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}tarea/${taskId}`, { withCredentials: true });
  }/*
  private getTaskPriorities(): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}prioridades`, { withCredentials: true });
  }
  private getTaskStatus(): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}estatus`, { withCredentials: true });
  }*/
  postTask(task: Task): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}`, { task: task }, { withCredentials: true });
  }
  updateTask(task: Task): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}tarea/${task.task_id}`, { task: task }, { withCredentials: true });
  }
  deleteTask(taskId: string): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}tarea/${taskId}`, { withCredentials: true });
  }
  /*private loadOptions(){
    this.getTaskPriorities().subscribe({
      next: (res) => {
        this.prioridadesSubject.next(res.options!);
      }, 
      error: (err) => {
        console.log(err);
      }
    });
    this.getTaskStatus().subscribe({
      next: (res) => {
        this.estatusSubject.next(res.options!);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }*/
}