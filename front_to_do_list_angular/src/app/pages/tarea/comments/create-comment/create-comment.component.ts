import { NgIf } from '@angular/common';
import { Component, Output,EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-comment',
  imports: [FormsModule,NgIf],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.scss'
})
export class CreateCommentComponent {
  
    @Output() 
    sendComment = new EventEmitter<string>();
    @Output() 
    cancelAddingComment = new EventEmitter<boolean>();

    @Input()
    addingComment = false;
    @Input()
    editingComment = false;
    @Input()
    newComment = '';

  cancelComment() {
    this.newComment = '';
    this.addingComment = false;
    this.cancelAddingComment.emit(this.addingComment);
  }

  saveComment() {
    if (!this.newComment.trim()) {
      return;
    }

    this.sendComment.emit(this.newComment);

    this.newComment = '';
    this.addingComment = false;
    this.editingComment = false;
  }
}
