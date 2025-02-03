import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  boolFormLogIn: boolean = false;
  title = 'ToDo List';
  toggleFormLogIn(){
    this.boolFormLogIn = !this.boolFormLogIn;
  }
}
