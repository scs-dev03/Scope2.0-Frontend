import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { Subscription } from 'rxjs';
import { RoleBasedService } from '../../services/role-based.service';
import { MessageService } from 'primeng/api';
import { SharedServiceService } from '../../services/shared-service.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-view-role',
  imports: [PrimengModuleModule,SharedModule,SHARED_IMPORTS],
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent {

  isLoading:boolean=false;
  userId:any;
 // roles:any=[]
  areCheckboxesEnabled:boolean=false;
  isSubmitEnabled:boolean=false;
 token:any;
  roles :any=[];
  visible:boolean=false;
  allModules:any=[];
  mainModules:any=[]
  modules:any=[];
  roleId:any;
  associatedVerticalsOnView:any=[];
  subModules:any=[];
  roleStatus:any;
  associatedBusinesses:any=[];
  userPermissions:any=[];
  receivedData:any;
  currentRoute:any;
  sidebarItems:any=[];
  dataSubscription:Subscription|null=null;
  isSidebarVisible:boolean=false;
  roleType:any='a'
  constructor(private roleService:RoleBasedService,private messageService:MessageService,
    private utilitiesService:UtilitiesService,private sharedService:SharedServiceService,
    private router:Router,
    private globalBlockUiService:GlobalBlockUiService,
    private sidebarService:SidebarService,
    
  ){
    this.viewRole();
    this.token=localStorage.getItem('token');
    this.userId=localStorage.getItem('userId');
    this.currentRoute=router.url;
    this.sharedService.updateModuleName('View & Edit Roles')
  }

  showDialog(){
    this.visible=false;
  }

  enableCheckboxes() {
    this.areCheckboxesEnabled = true; // Enable checkboxes when action button is clicked
    this.isSubmitEnabled = true; // Enable the submit button
  }

  setToggleState(product: any): boolean {
    return product.status === 'Active'; // true if 'Active', false if 'Inactive'
  }

  onStatusChange(product: any,status:any) {
    // this.setToggleStatus(product, this.getToggleStatus(product));
    //let status=product.status === 'Active' ? 'Inactive' : 'Active'
    // This ensures that the status is updated correctly when toggling
    product.status = product.status === 'Active' ? 'Inactive' : 'Active';

    //console.log(product);
    this.globalBlockUiService.startLoading();
    this.roleService.deleteRole({...product,loginUserId:this.userId}).subscribe((res:any)=>{
      this.globalBlockUiService.stopLoading();
      this.viewRole();
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
}
  updateRoleState(role: any, field: string, event: any) {
    role[field] = event.checked;
   // console.log(`${field} updated for ${role.name}: `, role[field],role);
  }

  selectedRow: number | null = null; // Track the selected row index
 

  ngOnInit(){

    this.getBusinessVerticals();
    this.dataSubscription = this.sharedService.sidebarData.subscribe(
      (data) => {
     //  console.log("data in view user 139",data?.items)
        this.receivedData = data?.items;
        const alreadyTransformed = this.receivedData?.some(
          (item: any) => Array.isArray(item.subchildren)
        );
      
        if (!alreadyTransformed) {
          this.receivedData = this.transformData(this.receivedData);
        }
        //console.log('Data received in User:', this.receivedData);
        if(this.receivedData!=null){

          for(let item of this.receivedData){
            const moduleItem = item.subchildren.find((child:any) => child.module_route === this.currentRoute);
  
  if (moduleItem) {
    // Extract values if module is found
    this.userPermissions = {
      view1: moduleItem.view1,
      add1: moduleItem.add1,
      delete1: moduleItem.delete1,
      edit1: moduleItem.edit1
    };
   
  }
          }
        }
     //  console.log("result",this.userPermissions)
       
      }
    );

    this.sidebarService.visibleSidebar$.subscribe(visible => {
      // Use `visible` to adjust layout as needed
      this.isSidebarVisible=visible;
     // console.log("is sidebar visible ",this.isSidebarVisible,visible)
    });
   
  }

  transformData(data: any)
 {
  const groupedData: { [key: string]: any } = {};
  const directParents: any[] = [];
// console.log("type of ",typeof data,data)
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
   // console.log("grouped data in view create user ",groupedData[parentName]?.subchildren,item)
  });

  const combinedResult = [...Object.values(groupedData), ...directParents];
  this.sidebarItems = combinedResult;
  
  return combinedResult;
}
  editRow(index: number,rowData:any) {
    this.selectedRow = index; // Set the selected row index
    this.isSubmitEnabled = true; // Enable the submit button for the selected row
    this.visible=true;
    this.roleId=rowData.id;
    this.associatedVerticalsOnView=rowData
    this.globalBlockUiService.startLoading();
    
    const selectedIds =[];
    this.roleStatus=rowData.status
   // console.log("rowData ",rowData)
    // Loop through the form values
    let rawModules=[];
    for (let key in rowData) {
      
      //console.log(key)
      if (rowData[key]) {
        // Push the mapped ID for each checked checkbox
        const selectedItem = this.associatedBusinesses.find((item:any) => item.business_vertical === key.toLocaleUpperCase());
        //console.log(selectedItem)
        if (selectedItem) {
          selectedIds.push(selectedItem.id);  // Push the corresponding ID
        }
      }
      
    }
   // console.log("role Type ",this.roleType)
    this.roleService.getEditModulesBasedOnBVID({vertical_ids:selectedIds,roleId:rowData.id,moduleType:this.roleType}).subscribe((res:any)=>{
       this.modules=res.data;
       
      this.globalBlockUiService.stopLoading();
      this.organizeModules();
      //console.log("allModules ",this.allModules)
      this.globalBlockUiService.stopLoading();
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
  }

  
  organizeModules() {

  this.mainModules = this.modules.filter((module: any) => module?.parentId === 0);
  this.subModules = this.modules.filter((module: any) => module?.parentId !== 0);
  //console.log("main and sub", this.mainModules, this.subModules);

  this.mainModules.forEach((mainModule: any) => {
    mainModule.view1 = false;
    mainModule.edit1 = false;
    mainModule.delete1 = false;
    mainModule.add1 = false;
   

    const submodulesForMainModule = this.subModules.filter(
      (submodule: any) => submodule.parentId === mainModule.id
    );

    if (submodulesForMainModule.length === 0) {
      // ✅ Set parentModuleName = module_name when no submodules exist
      mainModule.parentModuleName = mainModule.module_name;
    }

    submodulesForMainModule.forEach((submodule: any) => {
      submodule.parentModuleName = mainModule.module_name;

      const businessVertical = this.associatedBusinesses.find(
        (obj: any) => submodule.business_vertical_id === obj.id
      );

      if (businessVertical) {
        submodule.businessVerticalName = businessVertical.business_vertical;
      } else {
        console.warn(`Business vertical not found for submodule with id: ${submodule.id}`);
      }
      submodule.all = (submodule.view1 && submodule.edit1 && submodule.delete1 && submodule.add1);
    });

    mainModule.submodules = submodulesForMainModule;
   
  });

  this.allModules = this.mainModules;
  //console.log("all modules ", this.allModules);
}


  // organizeModules() {
    
  //   this.mainModules = this.modules.filter((module:any) => module?.parentId === 0);
  //   this.subModules = this.modules.filter((module:any) => module?.parentId !== 0);
  //   console.log("main and sub",this.mainModules,this.subModules)
  //  this.mainModules.forEach((mainModule: any) => {
  //   mainModule.view1=false;
  //   mainModule.edit1=false;
  //   mainModule.delete1=false;
  //   mainModule.add1=false;
  //   const submodulesForMainModule = this.subModules.filter((submodule: any) => submodule.parentId === mainModule.id);
  
  //   // Step 4: Add parent module's name to each submodule
  //   submodulesForMainModule.forEach((submodule: any) => {
  //     submodule.parentModuleName = mainModule.module_name; // Add parent module name to submodule
  
  //     // Find the business vertical by matching the business_vertical_id with the id in associatedBusinesses
  //     const businessVertical = this.associatedBusinesses.find((obj: any) => submodule.business_vertical_id
  //     == obj.id);
  
  //     // Check if businessVertical is found, and if so, add the business_vertical name to the submodule
  //     if (businessVertical) {
  //       submodule.businessVerticalName = businessVertical.business_vertical;
  //     } else {
  //       // Handle the case when no matching business vertical is found
  //       console.warn(`Business vertical not found for submodule with id: ${submodule.id}`);
  //     }
  //   });
  
  //   // Attach the submodules to the main module
  //   mainModule.submodules = submodulesForMainModule;
  // });
  
   
  //   // Step 3: Combine main modules and their submodules into a single array
  //   this.allModules = this.mainModules;
  //    console.log("all modules ",this.allModules)
  // }

  getBusinessVerticalName(id: number): string {
    const match = this.associatedBusinesses.find((b:any)=> b.id === id);
    return match ? match.business_vertical : 'Unknown';
  }
   // Toggle the "All" checkbox for all submodules
 toggleAllForModule(module: any,event:any,index:any,eventString:string): void {
  
  module.submodules.forEach((submodule: any,i:any) => {
   
    if(index==i){
      if(eventString=='all'){
        submodule.all = event.checked;
        submodule.view1 = event.checked;
        submodule.edit1 = event.checked;
        submodule.add1 = event.checked;
        submodule.delete1 = event.checked;
      }
      else{
        submodule.all=false;
      }
       console.log("eventString ",eventString,submodule)
    //   if(eventString=='view' && eventString=='add' && eventString=='delete' && eventString=='edit'){
    // submodule.all=true;        
    //   }
    }
    
  });
  //console.log("submodules ",event,module.submodules)
}
 
  getBusinessVerticals(){
    this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
      // this.globalBlockUiService.stopLoading();
      this.associatedBusinesses=res.data;
      // this.getModules();
      
    },(error:any)=>{
      this.isLoading=false
     // console.log("vertical error ",error)
    })
  }
  // Submit the selected row's data
  submit(index?:any) {
    
    // else{
      this.globalBlockUiService.startLoading();
     // console.log("modules ",this.allModules)
  //     let filteredModules=[];
  //     for(let item of this.allModules){

  //         const filteredArray = item.submodules.filter((module:any) => 
  //           !(module.view1 === false && module.edit1 === false && module.add1 === false && module.delete1 === false)
  //         );
  //         if(filteredArray.length>0){
  //           filteredModules.push(filteredArray)

  //         }
  //     }
  //  console.log("filtered modules ",filteredModules)
     
  //     this.roleService.editRole({modules:filteredModules,token:this.token,userId:this.userId,roleId:this.roleId,status:this.roleStatus,verticals:this.associatedVerticalsOnView}).subscribe((res:any)=>{
  //       this.globalBlockUiService.stopLoading();
  //       this.viewRole();
  //       this.visible=false;
  //       if(res.error?.code){
  //         return  this.messageService.add({severity:'error' ,summary:'Error in creating Role',life:300000})
  //       }
  //       this.messageService.add({severity:'success',summary:'Role updated successfully',life:10000})
      
  //     },(error:any)=>{
  //       this.globalBlockUiService.stopLoading();
  //       this.messageService.add({summary:'Error in Updating Role!!',life:3300000,severity:'error'})
  //       this.visible=false;
  //     })

  let filteredModules: any[] = [];

for (let item of this.allModules) {
  // If it has submodules, filter them based on permissions
  if (item.submodules && item.submodules.length > 0) {
    const filteredSubmodules = item.submodules.filter((module: any) =>
      module.view1 || module.edit1 || module.add1 || module.delete1
    );
    if (filteredSubmodules.length > 0) {
      filteredModules.push(...filteredSubmodules); // Flatten array instead of nested
    }
  } else {
    // Handle main modules without submodules
    if (item.view1 || item.edit1 || item.add1 || item.delete1) {
      filteredModules.push(item);
    }
  }
}

//console.log("Filtered modules to send", filteredModules);

this.roleService.editRole({
  modules: filteredModules,
  token: this.token,
  userId: this.userId,
  roleId: this.roleId,
  status: this.roleStatus,
  verticals: this.associatedVerticalsOnView
}).subscribe(
  (res: any) => {
    this.globalBlockUiService.stopLoading();
    this.viewRole();
    this.visible = false;
    if (res.error?.code) {
      return this.messageService.add({ severity: 'error', summary: 'Error in creating Role', life: 300000 });
    }
    this.messageService.add({ severity: 'success', summary: 'Role updated successfully', life: 10000 });
  },
  (error: any) => {
    this.globalBlockUiService.stopLoading();
    this.messageService.add({ summary: 'Error in Updating Role!!', life: 3300000, severity: 'error' });
    this.visible = false;
  }
);

      //console.log('Updating role:', rowData);
      this.selectedRow = null; // Reset selected row after submission
      this.isSubmitEnabled = false; // Disable submit button after submission
 //   }
  }

  viewRole(){
    this.globalBlockUiService.startLoading();
    this.roleService.viewRole().subscribe((res:any)=>{
      this.globalBlockUiService.stopLoading();
      this.roles=res.data;

      this.roles = this.roles.map((item: any) => ({
        ...item,
        status: item.status === true ? 'Active' : 'Inactive',  // Convert status to 'active' if true
        showErrorMessage: false
      }));
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
  }
}
