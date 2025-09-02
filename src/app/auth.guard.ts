import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';
import { environment } from '../../environments/environment';



// export const authGuard: CanActivateFn = (route, state) => {
//   const auth = inject(AuthService);
//   const perms = inject(PermissionService);
//   const router = inject(Router);

//   // 1) Not authenticated → hard redirect (external)
//   if (!auth.isAuthenticated()) {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = environment.frontendUserUrl; // external login/home
//     return false;
//   }

//   // 2) Normalize target path safely (no crash if state/url behaves oddly)
//   const url = state?.url ?? '';
//   const cleaned = url.split('?')[0].split('#')[0].replace(/^\/+/, ''); // remove leading '/'
//   const routeKey = cleaned.split('/')[0] || '';

//   // 3) Always-allowed routes to avoid redirect loops
//   if (routeKey === '' || routeKey === 'no-access' || routeKey === 'login') {
//     return true;
//   }

//   // 4) Permission check (supports both full path & top-level key)
//   let allowed = false;
//   try {
//     allowed = perms.isRouteAllowed(cleaned) || perms.isRouteAllowed(routeKey);
//     console.log(routeKey);
    
//   } catch {
//     allowed = false;
//   }

//   // 5) Allow or redirect using UrlTree (no imperative navigate inside guard)
//   return allowed ? true : router.createUrlTree(['/no-access']);
// };


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permissionService = inject(PermissionService);

  if (authService.isAuthenticated()) {
    const routePath = state?.url?.replace(/^\//, '');
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