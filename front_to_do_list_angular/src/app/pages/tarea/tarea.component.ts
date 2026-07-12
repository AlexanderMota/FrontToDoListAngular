import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, DatePipe, NgClass, NgIf, CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { PRIORITIES, STATUS, Task, getPriorityLabel, getStatusLabel } from '../../models/tarea.model';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from './comments/comments.component';
import { SubtareasComponent } from './subtareas/subtareas.component';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-tarea',
  imports: [DatePipe, NgClass, NgIf, CommonModule, FormsModule, CommentsComponent, SubtareasComponent],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.scss'
})
export class TareaComponent {

  task!: Task;
  editing = false;
  modoCreacion = false;
  task_id = "";
  currentUser = '';

  prioridades = PRIORITIES;
  estatus = STATUS;

  private platformId = inject(PLATFORM_ID);

  constructor(private taskServ: TaskService, 
    private authState : AuthStateService,
    private router: Router, 
    private route: ActivatedRoute) 
  { }

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.authState.user$.subscribe(user => {

      this.currentUser = user?.user_id ?? '';

    });

    this.route.paramMap.subscribe(() => {

      this.loadTask();

    });

  }
  
  loadTask(){

    this.task_id = this.route.snapshot.paramMap.get('id')!;

    const parent = this.route.snapshot.queryParamMap.get('parent');

    if (this.task_id === 'nueva') {

      this.modoCreacion = true;
      this.editing = true;

      this.task = {
        name: '',
        description: '',
        status: 'pending',
        priority: 'low',
        parent_task_id: parent ? parseInt(parent) : null,
        created_at: null,
        updated_at: null
      };

      return;
    }

    this.taskServ.getTaskById(this.task_id).subscribe({
      next: (response) => {
        this.task = response.task!;
      },
      error: (err) => {
        console.error('Error al obtener la tarea:', err);
      }
    });
  }

  editTask() {
    this.editing = true;
  }

  cancelEdit() {
    if(this.modoCreacion){
        this.router.navigate(['/home']);
    }
    this.editing = false;
  }

  saveTask() {
    this.editing = false;

    if (this.modoCreacion) {

      this.taskServ.postTask(this.task).subscribe({
        next: res => {
          this.task = res.task!;
          this.router.navigate([
            '/tarea',
            this.task.task_id
          ]);
        },
        error: err => {
          console.log(err);
        }
      });

      return;
    }

    this.taskServ.updateTask(this.task).subscribe({
      next: (res) => {
        this.task = res.task!;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteTask(){
    this.taskServ.deleteTask(this.task_id).subscribe({
      next: (res) =>{
        //console.log(res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getPriorityLabel = getPriorityLabel;
  getStatusLabel = getStatusLabel;

  volverAlPadre(){
    this.router.navigate(['/tarea/',this.task.parent_task_id]);
  }
}

 