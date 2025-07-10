import { Component, EventEmitter, Input, Output, output, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { TieredMenu } from 'primeng/tieredmenu';
import { SidebarService } from '../../services/sidebar.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { take } from 'rxjs';
import {environment} from '../../../../environments/environment'

@Component({
  selector: 'app-sidebar',
  imports: [PrimengModuleModule,SharedModule,FormsModule,ReactiveFormsModule,CommonModule,RouterModule],
  providers:[],
  templateUrl: './sidebar.component.html',
  encapsulation:ViewEncapsulation.None,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
 
  @ViewChild('menu') menu:TieredMenu |null=  null;
  @Input() visible: boolean = false; 
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  items: MenuItem[] | undefined;
  visibleSidebar: boolean = true;
  searchQuery: string = '';
  activeIndex:any;
  isVisible: boolean = true;
  sidebarItems:any=[];
  userName:any;
  profilePhoto:any;
  // sidebarItems = [
  //   {id: 1, value: "Mapping", children: [
  //       {id: 2, value: "Stock Upload Mapping", route: 'mapping/stock-upload',isActive: true},
  //       {id: 3, value: "Dealer Location Mapping", route: 'mapping/dealer-location',isActive: false}
  //     ], isExpanded: false},
  //   {id: 4, value: "Stock Upload", children: [
  //     {id: 5, value: "Single Location Upload", route: 'upload/sl',isActive: false},
  //     {id: 9, value: "Multi Location Upload", route: 'upload/ml',isActive: false},
  //     {id: 10, value: "Single Upload", route: 'stock-upload/sl',isActive: false},
  //      {id: 12, value: "Bulk Upload", route: 'stock-upload/ml',isActive: false}
  //   ], isExpanded: false}
  // ];
  
    filteredItems: any[] = [...this.sidebarItems]; // Initially, all items are visible

    // Function to filter items based on the search query
filterItems() {
  const query = this.searchQuery?.trim().toLowerCase();

  if (!query) {
    // Reset all items and collapse
    this.filteredItems = this.sidebarItems.map((item: any) => ({
      ...item,
      isOpen: false
    }));
    return;
  }

  this.filteredItems = this.sidebarItems
    .map((item: any) => {
      const matchesParent = item?.parentModuleName?.toLowerCase().includes(query);

      const filteredChildren = item.subchildren?.filter((child: any) =>
        child.module_name?.toLowerCase().includes(query)
      ) || [];

      if (matchesParent || filteredChildren.length > 0) {
        return {
          ...item,
          isOpen: true,  // 👈 Expand this item
          subchildren: filteredChildren.length > 0 ? filteredChildren : item.subchildren
        };
      }

      return null;
    })
    .filter((item: any) => item !== null);
}
 
    openSidebar() {
      this.isVisible = true;
    }
  
    toggleSidebar() {
      this.visible = !this.visible;
      this.visibleChange.emit(this.visible);  // Notify the parent about the visibility change
    }
    // Method to close the sidebar
    closeSidebar() {
      this.isVisible = false;
    }

    onButtonClick(event: any) {
      console.log('Button clicked');
      this.menu?.toggle(event);
    }
    

  setActive(subItem: any, parentItem: any) {
    this.filteredItems.forEach(item => {
      item.isActive = false;
      item.subchildren?.forEach((sub:any) => sub.isActive = false);
    });
  
    parentItem.isActive = true;
    subItem.isActive = true;
  }
  

  toggleChildren(item:any) {
    item.isExpanded = !item.isExpanded;
  
    // When expanding, reset the active state of child items
    if (item.isExpanded) {
      item.children.forEach((child:any) => child.isActive = false);  // Reset active state of children
    }
  }
  
  // Function to set an active child item
  setActiveChild(child:any) {
    // Deactivate all children in the sidebar
    this.sidebarItems.forEach((item:any) => {
      if (item.children) {
        item.children.forEach((childItem:any) => {
          if (childItem !== child) {
            childItem.isActive = false;  // Deactivate other children
          }
        });
      }
    });
  }

  ngOnInit(){
  this.items = [
  //   {
  //     label: 'Update Profile',
  //     icon: 'pi pi-user',
    
  // },
  // {
  //   label: 'Settings',
  //   icon: ' pi pi-cog',
  
  // },   
    {
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        command:()=>this.logOut()
    },
    {
        separator: true
    },
 
   
  ]
  this.userName=localStorage.getItem('username');
  
  this.sharedService.sidebarData
  .pipe(take(2))// ensure it only runs once
  .subscribe((res: any) => {
  //  console.log('Received from shared service:', res);
    if (res && res.loaded) {
     // console.log("shared service ",res.loaded)
      this.sidebarItems = Array.from(res.items);
     this.transformData(this.sidebarItems);
     
   // console.log("sidebar items ",this.sidebarItems)
    } else {
      console.warn('Sidebar data not loaded');
    }
  });
    
  this.getModules();
     this.sharedService.sidebarResetTrigger.subscribe(() => {
      this.resetSidebarState(); // Custom function to reset UI (NOT API)
    });
}

constructor(private sidebarService:SidebarService,private sharedService:SharedServiceService,
  private globalBlockUiService:GlobalBlockUiService,
 
  private router :Router
){}
   
resetSidebarState(){
  this.getModulesOnTrigger();
}
logOut(){
 
 // localStorage.setItem('usertype','d')
 //console.log(localStorage.getItem('usertype')=='A')
  if(localStorage.getItem('usertype')=='A')
  {
window.location.href = environment.frontendAdminUrl;
  }else{
    
    window.location.href = environment.frontendUserUrl;
  }
   localStorage.clear();
   sessionStorage.clear();
}

getModulesOnTrigger(){
  this.globalBlockUiService.startLoading();
  this.sidebarService.getModules().subscribe((res:any)=>{
   this.userName=localStorage.getItem('username');
// const cleaned = this.transformSidebarData(data);  // this will be dense, clean
this.sidebarItems = res.data;
 //console.log("modules api in sidebar ",this.sidebarItems)
//  this.sidebarItems=this.transformData(this.sidebarItems)
// this.filteredItems=this.transformData(this.sidebarItems);
  this.sharedService.updateSidebarData(this.sidebarItems)
  this.transformData(this.sidebarItems)
   this.globalBlockUiService.stopLoading();
  },(error:any)=>{
     this.globalBlockUiService.stopLoading();
  })
}
getModules(){
   
  this.globalBlockUiService.startLoading();
  this.sidebarService.getModules().subscribe((res:any)=>{
   
// const cleaned = this.transformSidebarData(data);  // this will be dense, clean
console.log("res .data ",res.data)
this.sidebarItems = res.data.modules;
console.log("sidebar items ",this.sidebarItems)
  this.profilePhoto=environment.uploadedProfileUrl+res.data.profile;
  console.log("profilePhoto ",this.profilePhoto,"envir ",environment.uploadedProfileUrl)
  this.sharedService.updateSidebarData(this.sidebarItems)
  //console.log("sidebar items ",this.sidebarItems)
   this.globalBlockUiService.stopLoading();
  },(error:any)=>{
     this.globalBlockUiService.stopLoading();
  })
}

transformData(data: any)
 {
  const groupedData: { [key: string]: any } = {};
  const directParents: any[] = [];
  //console.log("type of sidebar ",typeof data,data)
  data?.forEach((item: any) => {
    const parentName = item.parentModuleName;

    // ✅ Handle missing, "null", or NULL strings as direct parent
    if (!parentName || parentName.toLowerCase?.() === 'null') {
      directParents.push({
        parentModuleName: item.module_name,
        module_route: item.module_route,
        add1: item.add1,
        delete1: item.delete1,
        edit1: item.edit1,
        isActive: item.isActive,
        view1: item.view1,
        subchildren: [],     // still keep subchildren key to simplify UI logic
        isOpen: false
      });
    } else {
      if (!groupedData[parentName]) {
        groupedData[parentName] = {
          parentModuleName: parentName,
          subchildren: [],
          isOpen: false
        };
      }

      groupedData[parentName].subchildren.push({
        module_name: item.module_name,
        module_route: item.module_route,
        add1: item.add1,
        delete1: item.delete1,
        edit1: item.edit1,
        isActive: item.isActive,
        view1: item.view1
      });
    }
  });

  const combinedResult = [...Object.values(groupedData), ...directParents];
  // const cleanedGroupedData = Object.values(groupedData).filter(item => item && typeof item === 'object');
  // const cleanedDirectParents = directParents.filter(item => item && typeof item === 'object');
  
  // const combinedResult = [...cleanedGroupedData, ...cleanedDirectParents];
  
  //console.log("combined result in sidebar",groupedData)
  //console.log("combined Result ",combinedResult)
  this.sidebarItems = combinedResult;
  //console.log("sidebar ",this.sidebarItems)
  //this.sendDataToUser(this.sidebarItems);
  this.filteredItems = [...this.sidebarItems];
 // console.log("filtered items in sidebar",this.filteredItems)
  return combinedResult;
}



sendDataToUser(data:any) {
    
  this.sharedService.updateSidebarData(data);
}


toggleSubMenu(item: any) {
  // Check if the clicked submenu is already open. If so, close it; otherwise, open it.
  item.isOpen = !item.isOpen;

  // Close other submenus
  this.sidebarItems.forEach((subItem: any) => {
    if (subItem !== item) {
      subItem.isOpen = false;  // Close other submenus
    }
  });
}
}
