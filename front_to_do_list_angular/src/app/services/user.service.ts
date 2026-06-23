import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = 'http://localhost:4300/perfil/'; // URL del backend

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}ver`, { withCredentials: true });
  }
}

