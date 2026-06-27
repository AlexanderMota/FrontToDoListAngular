/*export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .getCurrentUser()
    .pipe(

      map(() => true),

      catchError(() => {

        router.navigate(['/landing']);

        return of(false);

      })

    );

};*/