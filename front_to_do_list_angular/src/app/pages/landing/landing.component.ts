import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/authentication/login-form/login-form.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { RegisterFormComponent } from '../../components/authentication/register-form/register-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ForgotPasswordComponent } from '../../components/authentication/forgot-password/forgot-password.component';


@Component({
  selector: 'app-landing',
  imports: [
    CommonModule, 
    LoginFormComponent, 
    RegisterFormComponent, 
    ForgotPasswordComponent,
    MatButtonModule
  ],
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
  boolFormRegister: boolean = false;
  boolFormForgotPassword: boolean = false;
  title = 'ToDo List';
  emailToRecover = '';
  
  constructor(private authState: AuthStateService, private router: Router) {}


  ngOnInit(): void {

    this.authState.user$.subscribe(user => {

      if (user) {
        this.router.navigate(['/home']);
      }

    });
  }


  toggleFormLogIn(){
    this.boolFormLogIn = true;
    this.boolFormRegister = false;
    this.boolFormForgotPassword = false;
  }

  toggleFormRegister(){
    this.boolFormRegister = true;
    this.boolFormForgotPassword = false;
    this.boolFormLogIn = false;
  }

  toggleFormForgotPassword(email: string){
    console.log('emailToRecover',email);
    this.emailToRecover = email;

    this.boolFormLogIn = false;
    this.boolFormRegister = false;
    this.boolFormForgotPassword = true;
  }

  closeOnOutsideClick(event: Event) {
    setTimeout(() => {
      this.boolFormLogIn = false;
      this.boolFormRegister = false;
    }, 40);
  }
}
