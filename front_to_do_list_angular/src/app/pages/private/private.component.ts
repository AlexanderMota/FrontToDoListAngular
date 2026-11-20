import { Component, Inject, PLATFORM_ID  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

import { ResetPasswordComponent } from '../../components/authentication/reset-password/reset-password.component';
import { VerifyEmailComponent } from '../../components/authentication/verify-email/verify-email.component';

@Component({
  selector: 'app-private',
  imports: [
    NgIf,
    ResetPasswordComponent,
    VerifyEmailComponent
  ],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {

  constructor(private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object) {
      
    }
    ngOnInit(){
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

    }

  get isResetPassword(): boolean {
    return this.route.snapshot.routeConfig?.path === 'reset-password';
  }

  get isVerifyEmail(): boolean {
    return this.route.snapshot.routeConfig?.path === 'verify-email';
  }
}