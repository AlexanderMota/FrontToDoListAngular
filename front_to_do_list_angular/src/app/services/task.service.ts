import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, TareaResponse } from '../models/tarea.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class TaskService {
  private apiUrl = 'http://localhost:4300/tareas/'; // URL del backend

  constructor(private http: HttpClient) { }

  getAll(): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}all`, { withCredentials: true });
  }
  getTaskById(taskId: string): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}tarea/${taskId}`, { withCredentials: true });
  }/*
  private getTaskPriorities(): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}prioridades`, { withCredentials: true });
  }
  private getTaskStatus(): Observable<TareaResponse> {
    return this.http.get<TareaResponse>(`${this.apiUrl}estatus`, { withCredentials: true });
  }*/
  postTask(tarea: Tarea): Observable<TareaResponse> {
    return this.http.post<TareaResponse>(`${this.apiUrl}`, { tarea: tarea }, { withCredentials: true });
  }
  updateTask(tarea: Tarea): Observable<TareaResponse> {
    return this.http.put<TareaResponse>(`${this.apiUrl}tarea/${tarea.task_id}`, { tarea: tarea }, { withCredentials: true });
  }
  deleteTask(taskId: string): Observable<TareaResponse> {
    return this.http.delete<TareaResponse>(`${this.apiUrl}tarea/${taskId}`, { withCredentials: true });
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