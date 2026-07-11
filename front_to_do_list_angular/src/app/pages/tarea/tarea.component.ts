import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, DatePipe, NgClass, NgIf, CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { PRIORITIES, STATUS, Tarea, getPriorityLabel, getStatusLabel } from '../../models/tarea.model';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from './comments/comments.component';

@Component({
  selector: 'app-tarea',
  imports: [DatePipe, NgClass, NgIf, CommonModule, FormsModule, CommentsComponent],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.scss'
})
export class TareaComponent {

  tarea!: Tarea;
  editing = false;
  modoCreacion = false;
  task_id = "";

  prioridades = PRIORITIES;
  estatus = STATUS;

  private platformId = inject(PLATFORM_ID);

  constructor(private taskServ: TaskService, private router: Router, private route: ActivatedRoute) 
  { }

  ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.task_id = this.route.snapshot.paramMap.get('id')!;

    if (this.task_id === 'nueva') {

      this.modoCreacion = true;
      this.editing = true;

      this.tarea = {
        name: '',
        description: '',
        status: 'pending',
        priority: 'low',
        created_at: null,
        updated_at: null
      };

      return;
    }

    this.taskServ.getTaskById(this.task_id).subscribe({
      next: (response) => {
        this.tarea = response.tarea!;
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

      this.taskServ.postTask(this.tarea).subscribe({
        next: res => {
          this.tarea = res.tarea!;
          this.router.navigate([
            '/tarea',
            this.tarea.task_id
          ]);
        },
        error: err => {
          console.log(err);
        }
      });

      return;
    }

    this.taskServ.updateTask(this.tarea).subscribe({
      next: (res) => {
        //console.log(res.message);
        this.tarea = res.tarea!;
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
}

 