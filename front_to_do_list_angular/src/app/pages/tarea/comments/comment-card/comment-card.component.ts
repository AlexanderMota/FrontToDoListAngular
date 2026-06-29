import { Component, Input } from '@angular/core';
import { Comment } from '../../../../models/comment.model'
import { isPlatformBrowser, DatePipe, NgClass, NgIf, NgFor, CommonModule } from '@angular/common';



@Component({
  selector: 'app-comment-card',
  imports: [DatePipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {
  
  @Input()
  comentario :Comment = {
    comment_id: 0, 
    task_id:"",
    username:"", 
    avatar_url:null,
    content: "", 
    created_at:null, 
    updated_at:null, 
    parent_comment_id : null
  };

}
