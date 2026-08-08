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

    return this.http.post<UserResponse>(
      `${this.apiUrl}avatar`, 
      formData, 
      { withCredentials: true }
    );
  }

  getInvitation(task_id:string){
    return this.http.get<UserResponse>(
      `${this.apiUrl}invitacion/${task_id}`, 
      { withCredentials:true }
    );
  }
  getCollabsConfirmed(task_id:string){
    return this.http.get<UserResponse>(
      `${this.apiUrl}colaboradores/confirmados/${task_id}`, 
      { withCredentials:true }
    );
  }
  getCollabsPending(task_id:string){
    return this.http.get<UserResponse>(
      `${this.apiUrl}colaboradores/pendientes/${task_id}`, 
      { withCredentials:true }
    );
  }
  getPerfil(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.apiUrl}ver`, 
      { withCredentials: true }
    );
  }
  searchUsers(query:string, task_id:string){
    return this.http.get<UserResponse>(
        `${this.apiUrl}buscar/${query}`, { 
      params: {
        task_id: task_id
      },withCredentials:true }
    );
  }

  postSolicitudColaboracion(user_id:string, task_id:string) {
    return this.http.post<UserResponse>(
      `${this.apiUrl}colaboradores/${user_id}`,{}, {
      params: {
        task_id: task_id
      }, 
      withCredentials: true 
    });
  }

  updatePerfil(perfil:User): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.apiUrl}`, 
      { perfil: perfil },
      { withCredentials: true }
    );
  }
  updatePassword(password: {
    currentPassword: string;
    newPassword: string;
  }): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.apiUrl}password`,
      { password: password },
      { withCredentials: true }
    );
  }
  updateSolicitudColaboracion(request_Id: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.apiUrl}colaboradores/${request_Id}`,{},
      { withCredentials: true }
    );
  }
  
  deleteSolicitudColaboracion(request_Id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.apiUrl}invitacion/${request_Id}`, 
      { withCredentials: true }
    );
  }
  deleteColaboracion(request_Id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.apiUrl}colaboradores/${request_Id}`, 
      { withCredentials: true }
    );
  }
  deleteFotoDePerfil(): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.apiUrl}avatar`, 
      { withCredentials: true }
    );
  }
}
