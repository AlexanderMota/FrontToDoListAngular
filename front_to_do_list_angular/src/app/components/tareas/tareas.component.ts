import { Component } from '@angular/core';
import { TareaCardComponent } from "./tarea-card/tarea-card.component";
import { NgFor } from '@angular/common';
import { Tarea } from '../../models/tarea.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tareas',
  imports: [NgFor, TareaCardComponent],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {

  constructor(
      private tarServ: TaskService
    ) {
    }

  public tareas : Tarea[] = [];/* = [
    {
      task_id: 1, name: 'Tarea 1', description: 'Descripción de la tarea 1', status: "false",
      priority: '',
      created_at: undefined,
      updated_at: undefined
    },
    {
      task_id: 2, name: 'Tarea 2', description: 'Descripción de la tarea 2', status: "true",
      priority: '',
      created_at: undefined,
      updated_at: undefined
    },
    {
      task_id: 3, name: 'Tarea 3', description: 'Descripción de la tarea 3', status: "false",
      priority: '',
      created_at: undefined,
      updated_at: undefined
    }
  ];*/

  ngOnInit() {
    this.tarServ.getAll().subscribe({
      next: (response) => {
        this.tareas = response; // Asignar las tareas obtenidas a la propiedad tareas
      },
      error: (err) => {
        console.error('Error al obtener las tareas:', err);
      }
    }); 
  }
}
