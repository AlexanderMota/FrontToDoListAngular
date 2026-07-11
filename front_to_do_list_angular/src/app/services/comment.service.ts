import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  CommentResponse } from '../models/comment.model';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class CommentService {
  private apiUrl = 'http://localhost:4300/tareas/comentarios/'; // URL del backend

  constructor(private http: HttpClient) {}

  getCommentsByIdTarea(task_id:string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}${task_id}`, { withCredentials: true });
  }
  createComment(task_id:string, comment:{content:string, parent_comment_id: number | null}): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}${task_id}`, {comment},{ withCredentials: true });
  }
  updateComment(comment_id:string, content:string): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}${comment_id}`, { content }, { withCredentials: true });
  }
  deleteComment(idComment: string): Observable<CommentResponse> {
    return this.http.delete<CommentResponse>(`${this.apiUrl}${idComment}`, { withCredentials: true });
  }
}
