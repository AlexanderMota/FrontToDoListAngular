import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = 'http://localhost:4300/perfil/'; // URL del backend

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}ver`, { withCredentials: true });
  }
}

