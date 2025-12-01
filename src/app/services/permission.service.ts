
import { Injectable } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private allowedRoutes: string[] = [];
  constructor(private sharedService: SharedServiceService) {
    this.setModules();

  }

  setModules() {
    let modules: any[] = [];
    // Example: modules = [{ module_name: 'Admin', route: '/admin' }, ...]
    this.sharedService.sidebarData.subscribe((res: any) => {
      modules = res?.items;
      this.allowedRoutes = modules.map(m => m?.module_route?.replace(/^\/+/, '')); // clean slashes
    })
    //console.log("modules in permission service ", modules)

  }

  isRouteAllowed(route: string): boolean {
    this.setModules();

    // console.log("from Is route all module    " + this.allowedRoutes);
    // console.log("from isroute  " + route);




    //console.log(this.allowedRoutes.includes(route));
    return true;

  }

  getAllowedRoutes(): string[] {
    return this.allowedRoutes;
  }
}
