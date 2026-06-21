import { Component } from '@angular/core';
import { TareaCardComponent } from "./tarea-card/tarea-card.component";
import { NgFor } from '@angular/common';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tareas',
  imports: [NgFor, TareaCardComponent],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {

  public tareas : Tarea[] = [
    { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1', completada: false },
    { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2', completada: true },
    { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3', completada: false }
  ];

}
