import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, DatePipe, NgClass, NgIf } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea',
  imports: [DatePipe, NgClass, NgIf ],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.scss'
})
export class TareaComponent {
  tarea!: Tarea;
  private platformId = inject(PLATFORM_ID);
  constructor(private tarServ: TaskService, private route: ActivatedRoute) {}

 ngOnInit() {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.tarServ.getTaskById(this.route.snapshot.paramMap.get('id')!).subscribe({
      next: (response) => {
        this.tarea = response.tarea!;
      },
      error: (err) => {
        console.error('Error al obtener la tarea:', err);
      }
    });
  }
}
