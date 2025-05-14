import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private sidebarDataSource = new BehaviorSubject<any>(null); // Holds the data
  sidebarData = this.sidebarDataSource.asObservable(); // Expose observable for components
  hasSidebarDataLoaded = false;
  constructor() {}
  sidebarResetTrigger = new Subject<void>();

  triggerSidebarReset() {
    this.sidebarResetTrigger.next();
  }
  // Method to update the data
  updateSidebarData(data: any) {
    // this.sidebarDataSource.next(data);
    const payload = { items: data, loaded: true };
   // console.log('Updating sidebar data with:', payload);
    this.sidebarDataSource.next(payload);
  }
}
