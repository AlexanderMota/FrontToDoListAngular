import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Comment } from '../../../../models/comment.model'
import { isPlatformBrowser, DatePipe, NgClass, NgIf, NgFor, CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../services/auth-state.service';
import { CommentService } from '../../../../services/comment.service';

@Component({
  selector: 'app-comment-card',
  imports: [DatePipe,NgIf],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {
  
  @Output() 
  menuOpened = new EventEmitter<number>();
  @Output() 
  idCommentDeleted = new EventEmitter<number>();

  @Input()
  openedMenu: number | null = null;
  @Input()
  comentario :Comment = {
    user_id:"",
    comment_id: 0, 
    task_id:"",
    username:"", 
    avatar_url:null,
    content: "", 
    created_at:null, 
    updated_at:null, 
    parent_comment_id : null
  };

  currentUser = '';

  constructor(private authState: AuthStateService, private comServ: CommentService) {}

  ngOnInit() {
    this.authState.user$.subscribe(user => {
      this.currentUser = user?.user_id ?? '';
    });
  }

  editComment(comentario: Comment){

  }

  @HostListener('document:click')
  closeMenu(){

    this.openedMenu = null;

  }

  deleteComment(id:number){
    console.log(id);
    this.comServ.deleteComment(id).subscribe({
      next : (res) => {
        console.log(res);
        this.idCommentDeleted.emit(id);
      },
      error : (err) => {
        console.error(err);
      }
    });
  }

  toggleMenu(event: MouseEvent){

    event.stopPropagation();

    this.menuOpened.emit(this.comentario.comment_id!);
  }
}
