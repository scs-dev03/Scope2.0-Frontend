import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private sidebarDataSource = new BehaviorSubject<any>(null); // Holds the data
  sidebarData = this.sidebarDataSource.asObservable(); // Expose observable for components
  hasSidebarDataLoaded = false;

  private headerData=new BehaviorSubject<any>(null);
  moduleName=this.headerData.asObservable();

  private getHomePageDataSource=new BehaviorSubject<any>(null);
  homePageData=this.getHomePageDataSource.asObservable();


  private getLocationIdForHomePageDataSource=new BehaviorSubject<any>(null);
  locationIdForHomePage=this.getLocationIdForHomePageDataSource.asObservable();

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

  updateModuleName(data:any){

    this.headerData.next(data);
  }

  updateHomePageData(data:any){
   this.getHomePageDataSource.next(data)
  }

  updateLocationIdForHomePageData(data:any){
    // console.log("✅ SharedService received locationId:", data);
    this.getLocationIdForHomePageDataSource.next(data);
  }
}
