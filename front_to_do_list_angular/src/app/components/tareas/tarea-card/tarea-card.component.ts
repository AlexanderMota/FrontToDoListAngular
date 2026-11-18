import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { getStatusLabel, getPriorityLabel, Task } from '../../../models/tarea.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-tarea-card',
  imports: [ CommonModule, DatePipe],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.scss'
})
export class TareaCardComponent {

  @Input()
  task!: Task;
  @Input()
  currentUser = '';
  
  expanded = false;
  openedMenu = false;

  constructor(
    private router: Router,
    private userServ: UserService,
    private elementRef: ElementRef<HTMLElement>) 
  { }

  @HostListener('document:click', ['$event'])
  cerrarMenuFuera(event: MouseEvent) {

    if (!this.openedMenu) return;

    const target = event.target;

    if (
      target instanceof Node &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.openedMenu = false;
    }
  }
  get hasPendingRequest(): boolean { return this.task.request_task?.status === 'pending'; }
  
  get isApprovalRequest(): boolean {
    return this.hasPendingRequest &&
      this.task.created_by === this.currentUser &&
      this.task.request_task?.sender_user_id === null &&
      this.task.request_task?.user_id !== this.currentUser;}
  
  get isReceivedInvitation(): boolean {
    return this.hasPendingRequest &&
      this.task.request_task?.user_id === this.currentUser &&
      this.task.request_task?.sender_user_id !== null &&
      this.task.request_task?.sender_user_id !== this.currentUser;}
  
  get isOwnRequest(): boolean {
    return this.hasPendingRequest &&
      this.task.request_task?.user_id === this.currentUser &&
      this.task.request_task?.sender_user_id === null;}

  get isOwnInvitation(): boolean {
    return this.hasPendingRequest &&
      this.task.created_by === this.currentUser &&
      this.task.request_task?.sender_user_id === this.currentUser &&
      this.task.request_task?.user_id !== this.currentUser;
  }
  abrirTarea() {
    if (this.hasPendingRequest) {
      this.openedMenu = !this.openedMenu;
      return;
    }
    this.router.navigate(['/tarea', this.task.task_id]);
  }

  aceptarColab() {
    const requestId = this.task.request_task?.request_id;

    if (!requestId) return;

    this.userServ.updateSolicitudColaboracion(requestId.toString()).subscribe({
      next: () => {
        this.task.request_task = null;
        this.openedMenu = false;
      },
      error: err => console.error('Error al aceptar la invitación:', err)
    });
  }

  cancelarColab() {
    const requestId = this.task.request_task?.request_id;

    if (!requestId) return;

    this.userServ.deleteSolicitudColaboracion(requestId.toString()).subscribe({
      next: () => {
        this.task.request_task = null;
        this.openedMenu = false;
      },
      error: err => console.error('Error al cancelar la solicitud:', err)
    });
  }

  toggleDescription(event: MouseEvent) {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
  getStatusLabel = getStatusLabel;
  getPriorityLabel = getPriorityLabel;
}
