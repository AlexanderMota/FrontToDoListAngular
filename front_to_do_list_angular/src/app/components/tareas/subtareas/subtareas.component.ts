import { Component, Input, inject,PLATFORM_ID } from '@angular/core';
import { Task } from '../../../models/tarea.model';
import { TareaCardComponent } from '../tarea-card/tarea-card.component';
import { NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subtareas',
  imports: [NgIf, NgFor, TareaCardComponent],
  templateUrl: './subtareas.component.html',
  styleUrl: './subtareas.component.scss'
})
export class SubtareasComponent {

  private platformId = inject(PLATFORM_ID);

  @Input()
  parent_task: Task | null = null;
  @Input()
  currentUser = "";
  
  addingTask = false;
  subtasks : Task[] = [];

  constructor( private taskServ: TaskService, private router: Router, private authState: AuthStateService ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.parent_task?.task_id) this.loadSubTasks();
  }

  ngOnChanges() {
    if (this.parent_task?.task_id) this.loadSubTasks();
  }
  loadSubTasks() {
  
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.taskServ.getSubTasks(String(this.parent_task?.task_id)).subscribe({
      next: (response) => this.subtasks = response.tasks!,
      error: (err) => console.error('Error al obtener la tarea:', err)
    });
  }

  createSubtask() {
    this.router.navigate(
      ['/tarea/nueva'],
      { queryParams: {parent: String(this.parent_task?.task_id)}}
    );
  }
}
