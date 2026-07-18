import { AuthService } from "./auth.service";
import { BehaviorSubject } from "rxjs";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { isPlatformBrowser } from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private authService: AuthService, private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object) {}

  loadUser() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.authService.getMe().subscribe({
      next: (response) => {
        this.userSubject.next(response.user);
      },
      error: () => {
        this.userSubject.next(null);
      }
    });
  }

  get currentUser() {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }
}