import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = 'http://localhost:4300/auth/'; // URL del backend

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}me`, { withCredentials: true }
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

export interface UserResponse {
  message: string;
  user: {
    email: string;
    role: number;
  };
}