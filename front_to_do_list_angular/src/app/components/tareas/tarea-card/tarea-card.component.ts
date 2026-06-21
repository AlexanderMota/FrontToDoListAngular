import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tarea-card',
  imports: [],
  templateUrl: './tarea-card.component.html',
  styleUrl: './tarea-card.component.scss'
})
export class TareaCardComponent {

  @Input()
  public tarea: any; // Variable para almacenar los datos de la tarea
}
