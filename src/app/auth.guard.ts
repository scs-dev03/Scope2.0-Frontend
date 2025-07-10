import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { PermissionService } from './services/permission.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);  // Access the AuthService
//   const router = inject(Router);  // Access the Router
// const permissionService = inject(PermissionService);

//   if (authService.isAuthenticated()) {
//   //  console.log('User is authenticated');
//  // console.log('AuthGuard - isAuthenticated:');
//  const routePath = route.routeConfig?.path || '';
//  if (permissionService.isRouteAllowed(routePath)) {
//   console.log("route path ",routePath)
//       return true;
//     } else {
//       router.navigate(['/no-access']);
//       return false;
//     }
//     return true;
//   } else {
    
//   //  console.log('User NOT authenticated. Redirecting...');
//    // Redirect to external login URL
//    localStorage.clear();
//     sessionStorage.clear();
//        window.location.href = environment.frontendUserUrl;

//     return false;
//   }

  

// };


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permissionService = inject(PermissionService);

  if (authService.isAuthenticated()) {
    const routePath = state.url.replace(/^\//, '');
   // console.log("route. ",route.routeConfig,state.url.replace(/^\//, ''))
    if (permissionService.isRouteAllowed(routePath)) {
      return true;
    } else {
      // Only redirect if this is the actual navigation attempt
      if (state.url === '/' + routePath) {
        router.navigate(['/no-access']);
      }
      return false;
    }
  } else {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = environment.frontendUserUrl;
    return false;
  }
};
