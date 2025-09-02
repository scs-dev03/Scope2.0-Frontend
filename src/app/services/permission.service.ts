import { Injectable } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private allowedRoutes: string[] = [];
  constructor(private sharedService: SharedServiceService) {

  }


  async setModules() {
    let modules: any[] = [];
    // Example: modules = [{ module_name: 'Admin', route: '/admin' }, ...]
    await this.sharedService.sidebarData.subscribe((res: any) => {
      modules = res?.items;
    })
    // console.log("modules in permission service ",modules)
    this.allowedRoutes = modules.map(m => m?.module_route?.replace(/^\/+/, '')); // clean slashes

    console.log(this.allowedRoutes);
    
  }

  isRouteAllowed(route: string): boolean {
    this.setModules();
    return this.allowedRoutes.includes(route);
    //console.log(this.allowedRoutes);
    
  }

  getAllowedRoutes(): string[] {
    return this.allowedRoutes;
  }
}
