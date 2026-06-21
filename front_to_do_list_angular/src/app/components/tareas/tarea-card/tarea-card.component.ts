import { Component, Input } from '@angular/core';
import { Tarea } from '../../../models/tarea.model';

@Component({
  selector: 'app-tarea-card',
  imports: [],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.scss'
})
export class TareaCardComponent {

  @Input()
  public tarea!: Tarea; // Variable para almacenar los datos de la tarea
}
