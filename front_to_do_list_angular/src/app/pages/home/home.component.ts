import { Component } from '@angular/core';
import { TareasComponent } from '../../components/tareas/tareas.component';

@Component({
  selector: 'app-home',
  imports: [TareasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
