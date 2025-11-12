import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
interface SidebarItem {
  id: Number;
  label: string;
  route: string;
  roles: string[];  // Specify roles that can see this menu item
  submenu?: SidebarItem[];
}
@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private url: any = environment.EnvApiUrlMaster;
  private sidebarVisible = new BehaviorSubject<boolean>(true);
  visibleSidebar$ = this.sidebarVisible.asObservable();
  private sidebarItems: any
  // = [
  //   {
  //     label: 'Lead Time Calculator',
  //     roles: ['admin', 'user'],
  //     route: '/dashboard',
  //     isActive: true,
  //     submenu: [
  //       { id: 2, label: 'LT Upload', route: '/app-upload', roles: ['admin', 'user'], isActive: false },
  //       { id: 3, label: 'LT Export', route: '/app-export', roles: ['admin', 'user'], isActive: false }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     label: 'User Management',
  //     route: '',
  //     roles: ['admin', 'user'],
  //     isActive: true,
  //     submenu: [
  //       { id: 5, label: 'View User', route: '/view-user', roles: ['admin', 'user'], isActive: false }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     label: 'Role Based Access Management',
  //     route: '',
  //     roles: ['admin', 'user'],
  //     isActive: true,
  //     submenu: [
  //       { id: 5, label: 'Create Role', route: '/create-role', roles: ['admin', 'user'], isActive: false },
  //       { id: 8, label: 'View & Edit Role', route: '/view-role', roles: ['admin', 'user'], isActive: false }
  //     ]
  //   }
  // ];

  // Simulate getting current user roles (could be fetched from a backend service)
  private currentUserRoles = ['user']; // This would be dynamic in a real app

  constructor(private http: HttpClient) { }

  // Return sidebar items based on current user roles
  getSidebarItems() {
    return this.sidebarItems.filter((item: any) =>
      item.roles.some((role: any) => this.currentUserRoles.includes(role))
    );
  }

  // getModules(): Observable<any> {
  //   // sessionStorage.setItem('userid',"18")
  //   let userId = sessionStorage.getItem('userid');
  //   //  console.log("user id in sidebar ",userId)
  //   // let userId='293';
  //   // sessionStorage.setItem('userId',userId)
  //   return this.http.post(`${this.url}sidebar/modules-based-on-roles`, { userId: userId })
  // }

  setVisible(value: boolean) {
    this.sidebarVisible.next(value);
  }

  toggle() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }

  getModules(): Observable<any> {
    let userId = sessionStorage.getItem('userid');
    return this.http.post(`${this.url}master/user-modules`, { userId: userId })
  }
}
