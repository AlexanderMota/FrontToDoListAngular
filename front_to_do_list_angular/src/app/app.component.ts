import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private authState: AuthStateService
  ) {}

  ngOnInit() {
    this.authState.loadUser();
  }
}
