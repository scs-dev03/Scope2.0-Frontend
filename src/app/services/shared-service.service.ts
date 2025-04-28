import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private sidebarDataSource = new BehaviorSubject<any>(null); // Holds the data
  sidebarData = this.sidebarDataSource.asObservable(); // Expose observable for components

  constructor() {}

  // Method to update the data
  updateSidebarData(data: any) {
    this.sidebarDataSource.next(data);
  }
}
