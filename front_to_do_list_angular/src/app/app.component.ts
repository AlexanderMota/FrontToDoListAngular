import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  boolFormLogIn: boolean = false;
  title = 'ToDo List';
  toggleFormLogIn(){
    this.boolFormLogIn = !this.boolFormLogIn;
  }
}
