import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-landing',
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [
    trigger('fadeBlur', [
      state('void', style({ opacity: 0, backdropFilter: 'blur(0px)', transform: 'scale(0.95)' })), // Estado inicial
      transition(':enter', [
        animate('400ms ease-out', style({ opacity: 1, backdropFilter: 'blur(3px)', transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, backdropFilter: 'blur(0px)', transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class LandingComponent {

  boolFormLogIn: boolean = false;
  title = 'ToDo List';
  
  toggleFormLogIn(){
    this.boolFormLogIn = true;
  }

  closeOnOutsideClick(event: Event) {
    this.boolFormLogIn = false;
setTimeout(() => {
      this.boolFormLogIn = false;
    }, 40);
  }
}
