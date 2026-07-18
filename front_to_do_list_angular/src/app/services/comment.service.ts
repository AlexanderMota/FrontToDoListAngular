import { CommentResponse } from '../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/tareas/comentarios/`; // URL del backend

  constructor(private http: HttpClient) {}

  getCommentsByIdTarea(task_id:string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}${task_id}`, { withCredentials: true });
  }
  createComment(task_id:string, comment:{content:string, parent_comment_id: number | null}): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}${task_id}`, {comment},{ withCredentials: true });
  }
  updateComment(comment_id:string, comment:{content:string}): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}${comment_id}`, { comment }, { withCredentials: true });
  }
  deleteComment(idComment: string): Observable<CommentResponse> {
    return this.http.delete<CommentResponse>(`${this.apiUrl}${idComment}`, { withCredentials: true });
  }
}
