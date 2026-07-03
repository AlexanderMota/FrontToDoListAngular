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

  openedMenu: number | null = null;
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
        console.log(res);
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

    this.comServ.createComment(this.idTarea, this.newComment).subscribe({
      next: (res) => {
        this.comentarios.push(res.comment!);
      },
      error : (err) => {
        console.log(err);
      }
    });

    this.newComment = '';
    this.addingComment = false;
  }
  deleteComment( id :number ){
    this.comentarios = this.comentarios.filter(
        c => c.comment_id !== id
    );
  }
  toggleMenu(id: number) {
    //console.log(id);
    this.openedMenu =
      this.openedMenu === id ? null : id;
  }
}
