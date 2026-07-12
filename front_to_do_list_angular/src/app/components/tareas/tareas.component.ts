import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { TareaCardComponent } from "./tarea-card/tarea-card.component";
import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Task } from '../../models/tarea.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  imports: [NgIf, NgFor, TareaCardComponent],
  templateUrl:  './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {
  
  @Input()
  title = "";
  @Input()
  paragraph = "";
  @Input()
  myTasks = false;
  @Input()
  tasks : Task[] = [];

  constructor( private router: Router ) { }

  newTask(){
    this.router.navigate(['/tarea/nueva']);
  }
}
