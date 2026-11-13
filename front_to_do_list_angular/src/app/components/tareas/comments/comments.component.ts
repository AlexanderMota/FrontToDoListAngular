import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe, NgClass, NgIf, NgFor, CommonModule } from '@angular/common';
import { Comment, CommentTree, buildTree } from '../../../models/comment.model';
import { CommentService } from '../../../services/comment.service';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { FormsModule } from '@angular/forms';
import { CreateCommentComponent } from "./create-comment/create-comment.component";

@Component({
  selector: 'app-comments',
  imports: [NgIf, NgFor, FormsModule, CommentCardComponent, CreateCommentComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {

  private commentsFlat : Comment[]= [];
  private platformId = inject(PLATFORM_ID);

  @Input()
  task_id : string = "";

  comentarios: CommentTree[] = [];
  openedMenu: number | null = null;
  addingComment = false;

  constructor(private comServ:CommentService){ }

  ngOnInit() {
      if (!isPlatformBrowser(this.platformId)) 
          return; 
      if (this.task_id) this.loadComments();
  }

  ngOnChanges() {
    if (this.task_id) 
      this.loadComments();
  }

  loadComments(){
    this.comServ.getCommentsByIdTarea(this.task_id).subscribe({
      next: (res) => {
        this.commentsFlat = res.comments!;
        this.comentarios = buildTree(this.commentsFlat);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  saveComment(commentToSend:{content:string, parent_comment_id: number | null}){ 
    this.openedMenu = null;

    if (!commentToSend.content.trim()) 
      return;
    

    this.comServ.createComment(this.task_id, commentToSend).subscribe({
      next: (res) => {
        console.log('Comentario creado:', res);
        this.commentsFlat.push(res.comment!);
        this.comentarios = buildTree(this.commentsFlat);
      },
      error : (err) => console.log(err)
      
    });

    this.addingComment = false;
  }

  deleteComment(id:string){
    this.commentsFlat =
        this.commentsFlat.filter(
            c => c.comment_id !== Number(id)
        );

    this.comentarios = buildTree(this.commentsFlat);
  }

  cancelComment(addComment:boolean){ 
    this.addingComment = addComment;
  }

  toggleMenu(id: number) {
    this.openedMenu = this.openedMenu === id ? null : id;
  }
}
