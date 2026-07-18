import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/perfil/`; // URL del backend

  constructor(private http: HttpClient) {}


  uploadAvatar(file: File) {

    const formData = new FormData();

    formData.append("avatar", file);

    return this.http.post<UserResponse>(`${this.apiUrl}avatar`, formData, {  withCredentials: true });

  }

  getPerfil(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}ver`, { withCredentials: true });
  }

  updatePerfil(perfil:User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}`, {perfil:perfil},{ withCredentials: true });
  }
}
