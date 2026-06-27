import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AsyncPipe } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  user$;
  
  constructor(
    private authState: AuthStateService
  ) {
    this.user$ = this.authState.user$;
  }

  ngOnInit() {
    this.authState.loadUser();
  }
}
