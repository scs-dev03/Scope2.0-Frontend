import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Access the AuthService
  const router = inject(Router);  // Access the Router
  
  // console.log("guard is triggered")
    if (authService.isAuthenticated()) {
    // console.log('user is authenticated')
    return true;  // Allow access if authenticated
  } else {
    router.navigate(['/login']);  // Redirect to login if not authenticated
    return false;
  }
  return true;
};
