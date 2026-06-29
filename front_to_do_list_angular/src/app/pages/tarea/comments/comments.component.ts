import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DatePipe, NgClass, NgIf, NgFor, CommonModule } from '@angular/common';
import { Comment } from '../../../models/comment.model';
import { CommentService } from '../../../services/comment.service';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [NgIf, NgFor, CommentCardComponent, FormsModule ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {

  @Input()
  idTarea : string="";

  addingComment = false;
  newComment = '';
  comentarios:Comment[]=[];

  private platformId = inject(PLATFORM_ID);

  constructor(private comServ:CommentService){ }

  ngOnInit(){

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.comServ.getCommentsByIdTarea(this.idTarea).subscribe({
      next: (res) => {
        this.comentarios = res.comments!;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

cancelComment() {
  this.newComment = '';
  this.addingComment = false;
}

saveComment() {

  if (!this.newComment.trim()) {
    return;
  }

  console.log(this.newComment);

  // Llamar al servicio POST
  this.comentarios.push({
    comment_id:22,
    task_id:"",
    username:"amith", 
    avatar_url:"", 
    content:this.newComment, 
    created_at:new Date(),
    updated_at:new Date(), 
    parent_comment_id:0
  });
  console.log("lista comentarios act: ", this.comentarios);
  this.newComment = '';
  this.addingComment = false;
}
}
