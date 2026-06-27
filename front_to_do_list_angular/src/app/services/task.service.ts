import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class TaskService {
  private apiUrl = 'http://localhost:4300/tareas/'; // URL del backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}all`, { withCredentials: true });
  }
  getTaskById(taskId: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}${taskId}`, { withCredentials: true });
  }
}
export interface TaskResponse {
  message: string;
  tarea: Tarea | Tarea[];
}
