import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TareaCardComponent } from "./tarea-card/tarea-card.component";
import { NgFor, isPlatformBrowser } from '@angular/common';
import { Task } from '../../models/tarea.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  imports: [NgFor, TareaCardComponent],
  templateUrl:  './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {

  constructor( private tarServ: TaskService, private router: Router ) { }

  
  private platformId = inject(PLATFORM_ID);
  public tasks : Task[] = [];

  ngOnInit() {
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.tarServ.getParentTasks().subscribe({
      next: (response) => {
        this.tasks = response.tasks!; // Asignar las tareas obtenidas a la propiedad tareas
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    }); 
  }
  newTask(){
    this.router.navigate(['/tarea/nueva']);
  }
}
