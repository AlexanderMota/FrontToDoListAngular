import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = 'http://localhost:4300/perfil/'; // URL del backend

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}ver`, { withCredentials: true });
  }
  updatePerfil(perfil:User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}`, {perfil:perfil},{ withCredentials: true });
  }
}
