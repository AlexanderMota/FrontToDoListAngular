import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../models/user.model';
import { Comment, CommentResponse } from '../models/comment.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class CommentService {
  private apiUrl = 'http://localhost:4300/tareas/comentarios/'; // URL del backend

  constructor(private http: HttpClient) {}

  getCommentsByIdTarea(idTarea:string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}${idTarea}`, { withCredentials: true });
  }
  createComment(comment:Comment): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}`, {comment:comment},{ withCredentials: true });
  }
}
