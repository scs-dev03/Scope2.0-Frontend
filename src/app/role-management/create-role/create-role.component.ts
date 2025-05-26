import { Component, ViewChild } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleBasedService } from '../../services/role-based.service';
import { MessageService } from 'primeng/api';
import { UtilitiesService } from '../../services/utilities.service';
import { atLeastOneCheckedValidator } from '../../shared/validators/atleastOneCheckedValidators';
import * as XLSX from 'xlsx';
import { SidebarService } from '../../services/sidebar.service';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { noWhitespaceValidator } from '../../shared/validators/noWhiteSpaceValidators';
@Component({
  selector: 'app-create-role',
  imports: [PrimengModuleModule,SharedModule,SHARED_IMPORTS],
  providers:[MessageService],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  isLoading:boolean=false;
  formData:any;
  visible:boolean=false;
  // customers = [
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   },
  //   {
  //     name: 'John Doe',
  //     industry: 'Technology',
  //     segment: 'Retail',
  //     status: 'Active',
  //     contactNo: '1234567890',
  //     address: '1234 Elm Street',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     industry: 'Finance',
  //     segment: 'Wholesale',
  //     status: 'Inactive',
  //     contactNo: '9876543210',
  //     address: '5678 Oak Avenue',
  //   }
  // ];
  modules:any;
  userId:any;
  selectedFile:any;
  roleForm:FormGroup
  token:any;
  mainModules: any = [];
  subModules: any = [];
  allModules:any=[];
  fileName:any;
  associatedBusinesses:any=[];
  selectedIds:any=[];
  isSidebarVisible:boolean=false;
  @ViewChild('fileInput') fileInput: any;
  constructor(private roleService:RoleBasedService,
    private fb:FormBuilder,private messageService:MessageService,
    private utilitiesService:UtilitiesService,
    public sidebarService: SidebarService,
    private globalBlockUiService:GlobalBlockUiService,
    private sharedService:SharedServiceService
  ){
    this.roleForm = this.fb.group({
      rolename: ['', [noWhitespaceValidator]],
      roleType:['',Validators.required],
      checkboxes: this.fb.group(
        {
          SIMS: [0],    // default is 0 (unchecked)
          AUDIT: [0],
          GAINER: [0],
          IT: [0],
          HR: [0],
          OTHERS: [0]
        },
        { validators: atLeastOneCheckedValidator } // custom validator for at least one checkbox
      
      )
    });
    this.roleForm
      .get('checkboxes')
      ?.valueChanges.subscribe(() => this.checkAtLeastOneChecked());
  
    this.userId=localStorage.getItem('userid');
   // localStorage.setItem('userid',"293");
    this.token=localStorage.getItem('usertoken');
    this.sharedService.updateModuleName('Create Role')
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    // Trigger the file input click when the icon is clicked
    fileInput.value = '';
    fileInput.click();
  }

  getModules(){
    
    this.roleService.getModules().subscribe((res:any)=>{
      this.modules=res.data;
      //console.log("modules ",this.modules)
     
    })
  }

  ngOnInit(){
    
    this.getBusinessVerticals();
    this.sidebarService.visibleSidebar$.subscribe(visible => {
      // Use `visible` to adjust layout as needed
      this.isSidebarVisible=visible;
     // console.log("is sidebar visible ",this.isSidebarVisible,visible)
    });
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    this.fileName=this.selectedFile.name;
   // console.log("this.selectedFile ",this.selectedFile)
  }

   toggleAllForModule(
  module: any,
  event: any,
  index: number | null,
  eventString: string
): void {
  const checked = event.checked;

 // console.log("module",module)
  if (index === null) {
    if (eventString === 'all') {
      module.view1 = checked;
      module.edit1 = checked;
      module.add1 = checked;
      module.delete1 = checked;
      module.all = checked;
    } else {
      module[eventString + '1'] = checked;
      module.all = false;
    }
  } else {
    const submodule = module.submodules[index];
    if (eventString === 'all') {
      submodule.view1 = checked;
      submodule.edit1 = checked;
      submodule.add1 = checked;
      submodule.delete1 = checked;
      submodule.all = checked;
    } else {
      submodule[eventString + '1'] = checked;
      submodule.all = false;
    }
  }

  // this.cdr.detectChanges();
}
 // Toggle the "All" checkbox for all submodules
//  toggleAllForModule(module: any,event:any,index:any,eventString:string): void {
  
//   module.submodules.forEach((submodule: any,i:any) => {

//     if(index==i){
//       if(eventString=='all'){
//         submodule.all = event.checked;
//         submodule.view1 = event.checked;
//         submodule.edit1 = event.checked;
//         submodule.add1 = event.checked;
//         submodule.delete1 = event.checked;
//       }
//       else{
//         submodule.all=false;
//       }
//     }
    
//   });
//   //console.log("submodules ",event,module.submodules)
// }


  organizeModules() {
    
    this.mainModules = this.modules.filter((module:any) => module?.parentId === 0);
    this.subModules = this.modules.filter((module:any) => module?.parentId !== 0);
    console.log("main and sub",this.mainModules,this.subModules)
   this.mainModules.forEach((mainModule: any) => {
    mainModule.view1=false;
    mainModule.edit1=false;
    mainModule.delete1=false;
    mainModule.add1=false;

     const businessVertical = this.associatedBusinesses.find((obj: any) => mainModule.business_vertical_id
      == obj.id);
  
      // Check if businessVertical is found, and if so, add the business_vertical name to the submodule
      if (businessVertical) {
        mainModule.businessVerticalName = businessVertical.business_vertical;
      }
    const submodulesForMainModule = this.subModules.filter((submodule: any) => submodule.parentId === mainModule.id);
  
    // Step 4: Add parent module's name to each submodule
    submodulesForMainModule.forEach((submodule: any) => {
      submodule.view1=false;
    submodule.edit1=false;
    submodule.delete1=false;
    submodule.add1=false;
      submodule.parentModuleName = mainModule.module_name; // Add parent module name to submodule
  
      // Find the business vertical by matching the business_vertical_id with the id in associatedBusinesses
      const businessVertical = this.associatedBusinesses.find((obj: any) => submodule.business_vertical_id
      == obj.id);
  
      // Check if businessVertical is found, and if so, add the business_vertical name to the submodule
      if (businessVertical) {
        submodule.businessVerticalName = businessVertical.business_vertical;
      } else {
        // Handle the case when no matching business vertical is found
        console.warn(`Business vertical not found for submodule with id: ${submodule.id}`);
      }
    });
  
    // Attach the submodules to the main module
    mainModule.submodules = submodulesForMainModule;
  });
  
   
    // Step 3: Combine main modules and their submodules into a single array
    this.allModules = this.mainModules;
    // console.log("all modules ",this.allModules)
  }

  

  checkAtLeastOneChecked() {
    const checkboxes = this.roleForm.get('checkboxes')?.value;
    const isAnyChecked = Object.values(checkboxes).some((value) => value === true);

    if (!isAnyChecked) {
      this.roleForm.get('checkboxes')?.setErrors({ atLeastOneRequired: true });
    } else {
      this.roleForm.get('checkboxes')?.setErrors(null);
    }
  }

  get checkboxes() {
    return this.roleForm.get('checkboxes') as FormGroup;
  }
  get rolename() {
    return this.roleForm.get('rolename');
  }

  get roleType(){
    return this.roleForm.get('roleType');
  }
  showDialog(){
    this.visible=true;
  }

  getBusinessVerticals(){
    this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
      // this.globalBlockUiService.stopLoading();
      this.associatedBusinesses=res.data;
      // this.getModules();
      
    },(error:any)=>{
      this.isLoading=false
    //  console.log("vertical error ",error)
    })
  }
  
  submit(){
   // console.log("modules ",this.allModules)
    if(this.roleForm.valid){

      let formValues = this.roleForm.value;
  
      this.globalBlockUiService.startLoading();
     // console.log(formValues);
    // console.log("fileName ",this.fileName)
      if(!this.fileName || this.fileName==''){
      this.roleService.createRole({...formValues,...formValues.checkboxes,userId:this.userId,token:this.token,modules:this.allModules}).subscribe((res:any)=>{
       
        this.globalBlockUiService.stopLoading();
        this.roleForm.reset();
        this.allModules=[];
       // console.log("res.err ",res.error.code)
        if(res.error?.code){
          return  this.messageService.add({severity:'error' ,summary:'Error in creating Role',life:3000})
        }
        this.messageService.add({severity:'success' ,summary:'Role has created Successfully',life:10000})
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
        this.roleForm.reset();
        this.allModules=[];
        this.messageService.add({severity:'error',detail:'There is some error in creating role..',life:3000});
      })
    }
    else{
      this.uploadRoleFormat({...formValues,...formValues.checkboxes,userId:this.userId,token:this.token});
      
    }
    }
    else{
      
      Object.keys(this.roleForm.controls).forEach(controlName => {
        const control = this.roleForm.get(controlName);
  
          // Mark regular form controls (like rolename) as touched
          control?.markAsTouched();
        
      });

      const checkboxes = this.roleForm.get('checkboxes')?.value;
  const isAnyChecked = Object.values(checkboxes).includes(true);

  // If no checkbox is selected, manually set the 'atLeastOneRequired' error
  if (!isAnyChecked) {
    this.roleForm.get('checkboxes')?.setErrors({ atLeastOneRequired: true });
  } else {
    // If at least one checkbox is selected, clear the error (if it exists)
    this.roleForm.get('checkboxes')?.setErrors(null);
  }
     
    }
  }


  getAccessSettings(){
   // console.log("role form ",this.roleForm.value)
    if(this.roleForm.valid){

      let formValues = this.roleForm.value;
  
    // Loop through the form values
    for (const key in formValues.checkboxes) {
      if (formValues.checkboxes[key]) {
        // Push the mapped ID for each checked checkbox
        const selectedItem = this.associatedBusinesses.find((item:any) => item.business_vertical === key);
        if (selectedItem) {
          this.selectedIds.push(selectedItem.id);  // Push the corresponding ID
        }
      }
    }
    //console.log("selected ids",selectedIds)
      this.globalBlockUiService.startLoading();
     // console.log(formValues);
      this.roleService.getModulesBasedOnBVID({vertical_ids:this.selectedIds}).subscribe((res:any)=>{
        this.modules=res.data;
        this.organizeModules();
        //console.log("allModules ",this.allModules)
        this.globalBlockUiService.stopLoading();
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
    else{
      
      this.globalBlockUiService.stopLoading();
      Object.keys(this.roleForm.controls).forEach(controlName => {
        const control = this.roleForm.get(controlName);
  
          // Mark regular form controls (like rolename) as touched
          control?.markAsTouched();
        
      });
      const checkboxes = this.roleForm.get('checkboxes')?.value;
  const isAnyChecked = Object.values(checkboxes).includes(true);

  // If no checkbox is selected, manually set the 'atLeastOneRequired' error
  if (!isAnyChecked) {
    this.roleForm.get('checkboxes')?.setErrors({ atLeastOneRequired: true });
  } else {
    // If at least one checkbox is selected, clear the error (if it exists)
    this.roleForm.get('checkboxes')?.setErrors(null);
  }

      
    }
  }

  // downloadRoleFormat(){
  //   let data=[];
  //   let data1:any[]=[];
  //   if(this.allModules.length>0){
    
  //   for(let item1 of this.allModules){
  //      data.push(item1.submodules);
      
  //   }
 
  //   for(let module of data){
  //     //console.log("modules ",module);
  //     module.map((item:any)=>{
  //       data1.push({
  //         ['Business Vertical']: item.businessVerticalName,  // The business vertical name
  //       ['Module Name']: item.parentModuleName,  // The name of the parent module
  //         ['Sub Module']:item.module_name,
  //         view:'',   // Convert boolean to 'Y' or 'N'
  //         edit:'',   // Convert boolean to 'Y' or 'N'
  //         delete:'',   // Convert boolean to 'Y' or 'N'
  //         add: ''
  //     })
  //   }
  // )
 
  //   }
  //   data1.push({Note:'Values for View, Edit, Add, Delete accepted in Y or N '})
  // }
  //   if(this.allModules.length==0){
  //     data1=[{message:'You have not selected Business Verticals'}]
  //   }
  //  //console.log("data ",data1)
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1);
    
  //   // Create a new workbook
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
  //   // Append the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, 'Modules');

  //   // Export the workbook to an Excel file
  //   XLSX.writeFile(wb, 'Role-Access-Settings.xlsx');
  // }
  
  downloadRoleFormat() {
  let data1: any[] = [];

  if (this.allModules.length > 0) {
    for (let item of this.allModules) {
      if (Array.isArray(item.submodules) && item.submodules.length > 0) {
        // Include each submodule as a row
        for (let sub of item.submodules) {
          data1.push({
            ['Business Vertical']: sub.businessVerticalName || item.businessVerticalName || '',
            ['Module Name']: sub.parentModuleName || item.module_name || '',
            ['Sub Module']: sub.module_name || '',
            view: '',
            edit: '',
            delete: '',
            add: ''
          });
        }
      } else if (Array.isArray(item.submodules) && item.submodules.length === 0) {
        // Include module with empty submodule
        data1.push({
          ['Business Vertical']: item.businessVerticalName || '',
          ['Module Name']: item.module_name || '',
          ['Sub Module']: '',
          view: '',
          edit: '',
          delete: '',
          add: ''
        });
      }
    }

    data1.push({ Note: 'Values for View, Edit, Add, Delete accepted in Y or N ' });
  } else {
    data1 = [{ message: 'You have not selected Business Verticals' }];
  }

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Modules');
  XLSX.writeFile(wb, 'Role-Access-Settings.xlsx');
}


  uploadRoleFormat(data:any){
    this.globalBlockUiService.startLoading();
    // if (!this.selectedFile) {
    //   alert('Please select a file first.');
    //   return;
    // }

     this.formData = new FormData();
    this.formData.append('excelFile', this.selectedFile, this.selectedFile.name);
    this.formData.append('data', JSON.stringify(data));
    this.roleService.uploadRoleFormat(this.formData).subscribe((res:any)=>{

      this.globalBlockUiService.stopLoading();
      this.roleForm.reset();
      this.selectedFile='';
      this.fileName='';
      if(res.isWrongFile){
        if(res?.isWrongFile?.empty)
        {
          return this.messageService.add({severity:'error',life:3000,summary:'Fields cannot be Blank'});
        }
        else{
          return this.messageService.add({severity:'error',life:3000,summary:'You have selected Wrong file.'});
        }
        

      }
      else{

        this.formData=new FormData();
       
        this.messageService.add({severity:'success',life:10000,summary:'Role is created Successfully!!!'})
      }
    
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
      this.roleForm.reset();
      this.formData=new FormData();
      this.selectedFile='';
      this.fileName=''
      this.messageService.add({severity:'error',life:3000,summary:'Internal Server Error!'})
    })
  }
}
