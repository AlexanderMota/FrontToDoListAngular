import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/`; // URL del backend

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}me`, { withCredentials: true }
    );
  }
  register(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}register`, {user:user}, { withCredentials: true }
    );
  }
  login(user: { email: string; password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}login`, {user:user}, { withCredentials: true }
    );
  }
  logout() {
    return this.http.post(
      `${this.apiUrl}logout`, {}, { withCredentials: true }
    );
  }
}
