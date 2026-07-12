import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Comment, CommentTree, buildTree } from '../../../../models/comment.model'
import { isPlatformBrowser, DatePipe, NgClass, NgIf, NgFor, CommonModule } from '@angular/common';
import { AuthStateService } from '../../../../services/auth-state.service';
import { CommentService } from '../../../../services/comment.service';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-card',
  imports: [DatePipe, NgIf, NgFor, FormsModule, CreateCommentComponent],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {
  
  @Output() 
  sendComment = new EventEmitter<{content: string, parent_comment_id: number}>();
  @Output() 
  menuOpened = new EventEmitter<number>();
  @Output() 
  idCommentDeleted = new EventEmitter<string>();
  
  @Input()
  openedMenu: number | null = null;
  @Input()
  comentario! :CommentTree;

  currentUser = '';
  addingComment = false;
  expanded = false;
  expandedReplays = false;
  editingComment = false;

  constructor(private authState: AuthStateService, private comServ: CommentService) {}

  ngOnInit() {
    this.authState.user$.subscribe(user => {
      this.currentUser = user?.user_id ?? '';
    });
  }

  @HostListener('document:click')
  closeMenu(){
    this.openedMenu = null;
  }


  deleteComment(id:number){
    this.comServ.deleteComment(id.toString()).subscribe({
      next : (res) => {
        console.log(res);
      },
      error : (err) => {
        console.error(err);
      }
    });
    this.idCommentDeleted.emit(id.toString());
  }
  replayComment(content: string) {

    this.sendComment.emit({
      content,
      parent_comment_id: this.comentario.comment.comment_id
    });

    this.addingComment = false;
  }
  saveEdit(editedContent: string) {
      this.comentario.comment.content = editedContent;
    console.log('comentario editado: ', this.comentario.comment.content);

    this.comServ.updateComment(
      this.comentario.comment.comment_id.toString()!, 
      {content: editedContent}
    ).subscribe({

      next: res => {

        this.comentario.comment.updated_at = res.comment!.updated_at;

        this.editingComment = false;
      },
      error: err => {
        console.log(err);
      }
    });
    this.comentario.comment.content = editedContent;
  }

  editComment() {
    this.editingComment = true;
    this.openedMenu = null;
  }
  cancelEdit() {
    this.editingComment = false;
  }
  cancelComment(addComment:boolean){ 
    this.addingComment = addComment;
  }

  toggleReplayComment(open:boolean){
    this.addingComment = open;
  }
  toggleMenu(event: MouseEvent){

    event.stopPropagation();

    this.menuOpened.emit(this.comentario.comment.comment_id!);
  }
  toggleDescription(event: MouseEvent) {
    this.expanded = !this.expanded;
    event.stopPropagation();
  }
  toggleReplies(event: MouseEvent){
    this.expandedReplays = !this.expandedReplays;
    //console.log("expanded replays: ", this.expandedReplays);
    event.stopPropagation();
  }
}
