import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Access the AuthService
  const router = inject(Router);  // Access the Router

 // console.log('AuthGuard triggered');

  if (authService.isAuthenticated()) {
  //  console.log('User is authenticated');
 // console.log('AuthGuard - isAuthenticated:');
    return true;
  } else {
    
  //  console.log('User NOT authenticated. Redirecting...');
   // Redirect to external login URL
   localStorage.clear();
    sessionStorage.clear();
       window.location.href = environment.frontendUserUrl;

    return false;
  }

  

};
