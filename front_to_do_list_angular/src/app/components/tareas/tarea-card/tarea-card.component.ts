import { Component, Input } from '@angular/core';
import { Tarea } from '../../../models/tarea.model';
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
  public tarea!: Tarea; // Variable para almacenar los datos de la tarea

  constructor(private router: Router) {
  }

  abrirTarea() {
    this.router.navigate(['/tarea', this.tarea.task_id]);
  }
}
