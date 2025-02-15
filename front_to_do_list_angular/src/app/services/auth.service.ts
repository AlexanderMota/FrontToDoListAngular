import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = 'http://localhost:4300/auth/'; // URL del backend

  constructor(private http: HttpClient) {}

  login(user: { /*email: string; password: string*/ }): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, {user:user}, { withCredentials: true });
  }
}
