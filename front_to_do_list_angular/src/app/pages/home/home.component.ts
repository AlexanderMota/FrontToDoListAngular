import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TareasComponent } from '../../components/tareas/tareas.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/tarea.model';
import { AuthStateService } from '../../services/auth-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [NgIf, TareasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title1 = "Mis tareas";
  paragraph1 = "Gestiona tus tareas y mantén el control de tu trabajo.";
  
  title2 = "Tareas en las que estas colaborando";
  paragraph2 = "Avanza en los proyectos en los que colaboras.";

  title3 = "Colaboraciones pendientes de aprovación";
  paragraph3 = "Entra en la tarea para decidir si colaboras en ella o para cancelar tu solicitud.";

  title4 = "Tareas públicas";
  paragraph4 = "Explora y participa en tareas que están disponibles para todos.";

  myTasks : Task[] = [];
  colTasks : Task[] = [];
  reqTasks : Task[] = [];
  publicTasks : Task[] = [];
  currentUser = '';

  private userSubscription?: Subscription;
  private platformId = inject(PLATFORM_ID);

  constructor( private tarServ: TaskService,
    private authState: AuthStateService ) { }

  ngOnInit() {
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.tarServ.getParentTasks().subscribe({
      next: (response) => {
        this.myTasks = response.tasks!; 
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    }); 
     this.userSubscription = this.authState.user$.subscribe(user => {
      this.currentUser = user?.user_id ?? '';
    });
    this.tarServ.getCollabTasks().subscribe({
      next: (response) => {
        this.colTasks = response.tasks!;
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    });
    this.tarServ.getInvitedTasks().subscribe({
      next: (response) => {
        this.reqTasks = response.tasks!;
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    }); 
    this.tarServ.getPublicTasks().subscribe({
      next: (response) => {
        this.publicTasks = response.tasks!;
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    }); 
  }
  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
