import { Component, Input } from '@angular/core';
import { getStatusLabel, getPriorityLabel, Task } from '../../../models/tarea.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarea-card',
  imports: [ CommonModule, DatePipe],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.scss'
})
export class TareaCardComponent {

  @Input()
  task!: Task; // Variable para almacenar los datos de la tarea
  expanded = false;

  constructor(private router: Router) {
  }

  abrirTarea() {
    this.router.navigate(['/tarea', this.task.task_id]);
  }
  getStatusLabel = getStatusLabel;
  getPriorityLabel = getPriorityLabel;

  toggleDescription(event: MouseEvent) {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
}
