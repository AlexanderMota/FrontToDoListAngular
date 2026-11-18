import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass, NgIf, CommonModule, isPlatformBrowser } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { PRIORITIES, STATUS, Task, VISIBILITY, getPriorityLabel, getStatusLabel, getVisibilityLabel } from '../../models/tarea.model';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from '../../components/tareas/comments/comments.component';
import { CollaboratorsComponent } from '../../components/task_requests/collaborators/collaborators.component'
import { SubtareasComponent } from '../../components/tareas/subtareas/subtareas.component';
import { AuthStateService } from '../../services/auth-state.service';
import { getAvatarUrl, User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { InvitationComponent } from '../../components/task_requests/invitation/invitation.component';

@Component({
  selector: 'app-tarea',
  imports: [
    DatePipe, 
    NgClass, 
    NgIf, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommentsComponent, 
    SubtareasComponent,
    CollaboratorsComponent,
    InvitationComponent
  ],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.scss'
})
export class TareaComponent {

  selectedUsers:User[] = [];

  task!: Task;
  editing = false;
  modoCreacion = false;
  task_id = "";
  currentUser = '';

  prioridades = PRIORITIES;
  estatus = STATUS;
  privacidad = VISIBILITY;

  private platformId = inject(PLATFORM_ID);

  canAccessParent = false;

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
  
  loadTask() {

    this.task_id = this.route.snapshot.paramMap.get('id')!;

    const parent = this.route.snapshot.queryParamMap.get('parent');

    // Restablecer el estado al cambiar de tarea
    this.modoCreacion = false;
    this.editing = false;
    this.canAccessParent = false;

    if (this.task_id === 'nueva') {

      this.modoCreacion = true;
      this.editing = true;

      this.task = {
        created_by: "",
        name: '',
        description: '',
        status: 'pending',
        priority: 'low',
        parent_task_id: parent ? parseInt(parent) : null,
        created_at: null,
        updated_at: null,
        username: null,
        avatar_url: null,
        visibility: "private"
      };

      return;
    }

    // Evitar mostrar temporalmente los datos de la tarea anterior
    this.task = undefined!;

    this.taskServ.getTaskById(this.task_id).subscribe({
      next: (response) => {

        console.log(response.message);

        this.task = response.task!;

        if (this.task.parent_task_id != null) {
          this.checkParentAccess(this.task.parent_task_id);
        }
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

    if (this.modoCreacion) {

      this.taskServ.postTask(this.task).subscribe({
        next: (res) => {
          console.log(res.message);

          const newTaskId = res.task?.task_id;

          if (newTaskId == null) {
            console.error('La respuesta no contiene el identificador de la tarea');
            return;
          }

          this.router.navigate(['/tarea', newTaskId]);
        },
        error: (err) => {
          console.error(err);
        }
      });

      return;
    }

    this.taskServ.updateTask(this.task).subscribe({
      next: (res) => {
        //console.log(res.message);
        //this.task = res.task!;
        this.editing = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  checkParentAccess(parent_task_id: number) {

    this.taskServ.getTaskById(parent_task_id.toString()).subscribe({

      next: () => {
        this.canAccessParent = true;
      },

      error: (err) => {

        this.canAccessParent = false;

        // Un 403 o 404 es un resultado esperado:
        // el usuario no tiene acceso al padre.
        if (err.status !== 403 && err.status !== 404) {
          console.error('Error comprobando acceso a la tarea padre:', err);
        }

      }

    });

  }
  deleteTask(){
    this.taskServ.deleteTask(this.task_id).subscribe({
      next: (res) =>{
        console.log(res.message);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  getPriorityLabel = getPriorityLabel;
  getStatusLabel = getStatusLabel;
  getAvatarUrl = getAvatarUrl;
  getVisibilityLabel = getVisibilityLabel;

  volverAlPadre(){

    if (!this.task.parent_task_id || !this.canAccessParent) {
      return;
    }

    this.router.navigate(['/tarea', this.task.parent_task_id]);
  }
}