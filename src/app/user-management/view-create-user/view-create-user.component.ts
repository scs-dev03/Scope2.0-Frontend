import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { SharedServiceService } from '../../services/shared-service.service';
import * as XLSX from 'xlsx';
import { SidebarService } from '../../services/sidebar.service';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { noWhitespaceValidator } from '../../shared/validators/noWhiteSpaceValidators';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-view-create-user',
  imports: [SHARED_IMPORTS,PrimengModuleModule,SharedModule],
  providers:[MessageService],
  templateUrl: './view-create-user.component.html',
  styleUrl: './view-create-user.component.css'
})
export class ViewCreateUserComponent {

  @ViewChild('table') table!: Table; 
  users:any = [
  ]
      visible: boolean = false;
      associatedBusinesses:any=[
    ];
    isSidebarVisible:boolean=false;
    designationName:any;
    globalFilterValue: string = '';
    roleName:any;
    businessVertical:any;
    isLoading:boolean=false;
      roles:any=[];
      designations:any=[];
      actionName:any;
    editUserForm:FormGroup;
    rowId:any;
    token:any;
    userId:any;
    showErrorMessage:any;
    emailArray:any=[];
    sidebarItems:any=[];
     selectedBrandId:any=null;
     selectedDealerId:any=null;
     selectedLocationId:any=null;
     dataSubscription: Subscription|null=null;
     currentRoute:any;
    receivedData: any=[];
    brands:any=[];
    dealers:any=[];
    locations:any=[];
    showBDL:boolean=false;
    selectedDesignationId:any;
     userType:any=sessionStorage.getItem('usertype');
    userPermissions:any=[];
    allUsers:any=[];
    @ViewChild('dt') dt: any;
      statuses:any=[
        { name:'Active',id:1},
     
         {name:'Inactive',id:0}
       ]
    userTypes:any=[
      {
        name:'Admin',value:'A'
      },
      {
        name:'User',value:'D'
      },

    ]
      
      constructor(private router:Router,private utilitiesService:UtilitiesService,
        private fb:FormBuilder,private cdr:ChangeDetectorRef,
        private userService:UserService,private messageService:MessageService,
        private authService:AuthService,
        private sharedService:SharedServiceService,
        private sidebarService:SidebarService,
        private globalBlockUiService:GlobalBlockUiService
      ){
      //  ^[0-9]{10}$
   this.editUserForm= this.fb.group({
      // Define each form control with validators combined using Validator.
      brand:[''],
      dealer:[''],
      location:[[]],
      name: ['', Validators.compose([Validators.required,noWhitespaceValidator])],
      lastName:['',Validators.compose([Validators.required,noWhitespaceValidator])],
      designation: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobileNo: ['', Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]{9}$')])],
      associatedBusiness: ['', Validators.required],
      status: ['', Validators.required],
      userType:['',Validators.required]
    });
    this.currentRoute=router.url;
   // console.log(this.currentRoute)
  }
    
  onDesignationChange(){
    // this.users=[]
    // this.users=this.users.find((obj:any)=> obj.designationId==this.selectedDesignationId)
    // console.log("designation changes ",this.users)
    // let allUsers=this.users;
     if (!this.selectedDesignationId) {
    // No designation selected — show all users
    this.users = [...this.allUsers];
  } else {
    // Filter by selected designation
    this.users = this.allUsers.filter(
      (user: any) => user.designationId === this.selectedDesignationId.toString()
    );
  }
    

 // console.log("users ",this.users)
  }
   onGlobalFilter(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(input, 'contains');
  }
  
    showDialog(action:any,rowData?:any) {
    // console.log(rowData)
      this.actionName=action;
      console.log(" action ",action,this.userType)
      if(this.actionName=='Add User'){
        this.viewUser();
        this.editUserForm.reset();
          this.editUserForm.get('brand')?.enable();
        this.editUserForm.get('dealer')?.enable();
      }else{
        
        this.rowId=rowData.userId;
     //   console.log("rowDtaa ",rowData)
        let designationObj=this.designations.find((obj:any)=>{ return obj.id==rowData.designationId})
        let roleObj=this.roles.find((obj:any)=>{return obj.id==rowData.roleId})
        let verticalObj=this.associatedBusinesses.find((obj:any)=>{return obj.id==rowData.business_vertical})
         let statusObj=this.statuses.find((obj:any)=>{return obj.name==rowData.status?'Active':'Inactive'})
       // console.log(roleObj,designationObj,verticalObj,statusObj,rowData)
        this.editUserForm.patchValue({
          name: rowData.vcFirstName,
          lastName:rowData.vcLastName,
          email: rowData.emailId,
          brand:this.selectedBrandId,
          dealer:this.selectedDealerId,
          location: rowData.location?.map((loc:any) => loc.location_id),
          designation: designationObj ? designationObj.id : null,  // Patch the ID, not the name
          role: roleObj ? roleObj.id : null,  // Patch the ID, not the name
          associatedBusiness: verticalObj ? verticalObj.id : null,  // Patch the ID, not the name
          mobileNo: rowData.mobileNo,
          userId: rowData.userId,
          status: statusObj?statusObj?.name:null,
          userType:rowData.type
        });
        if(this.actionName!='Add User'&& this.userType=='D' ){
          this.editUserForm.get('brand')?.disable();
        this.editUserForm.get('dealer')?.disable();

        }
     //   console.log("editUserForm ",this.editUserForm.value)
        Object.keys(this.editUserForm.controls).forEach((controleName:any)=>{
          this.editUserForm.get(controleName)?.markAsUntouched();
        })
      }
      this.visible = true;
      this.showErrorMessage=''
      
      // console.log(rowData)

      // console.log("edituser form ",this.editUserForm.value)
  }
      addUser(){
        this.router.navigate(['/create-user'])
      }
  
       ngOnInit(){
      
        this.getRoles();
    
      this.userId=sessionStorage.getItem('userid');
      this.token=sessionStorage.getItem('usertoken');
      this.authService.checkEmail({email:this.editUserForm.value.email}).subscribe(
        (response) => {
          this.emailArray=response.data;
          //console.log(this.emailArray)
        },
        (error) => {
         
        }
      );
  
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
        // console.log("result",this.userPermissions)
         
        }
      );

       this.sharedService.updateModuleName('View Users')

      this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
        this.isSidebarVisible=visible
      })

      this.editUserForm.get('userType')?.valueChanges.subscribe((selectedUserType)=>{
        const brand = this.editUserForm.get('brand');
  const dealer = this.editUserForm.get('dealer');
  const location = this.editUserForm.get('location');
        if(selectedUserType=='D'){
          this.showBDL=true;
          brand?.setValidators([Validators.required]);
              dealer?.setValidators([Validators.required]);
              location?.setValidators([Validators.required]);
          this.getBrands();
        }
        else{
          brand?.clearValidators();
          dealer?.clearValidators();
          location?.clearValidators();
          this.showBDL=false;
        }
        brand?.updateValueAndValidity();
  dealer?.updateValueAndValidity();
  location?.updateValueAndValidity();
       // console.log("selected user Type ",selectedUserType)
      })
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
  // const cleanedGroupedData = Object.values(groupedData).filter(item => item && typeof item === 'object');
  // const cleanedDirectParents = directParents.filter(item => item && typeof item === 'object');
  
  // const combinedResult = [...cleanedGroupedData, ...cleanedDirectParents];
  
//  console.log("combined result ",groupedData)
  //console.log("combined Result ",combinedResult)
  this.sidebarItems = combinedResult;
  //console.log("sidebar ",this.sidebarItems)
  //this.sendDataToUser(this.sidebarItems);
  // this.filteredItems = [...this.sidebarItems];
  // console.log("filtered items ",this.filteredItems)
  return combinedResult;
}

 onBrandChange(event:any,action?:any){

  // const newValue = event.value;
  // this.selectedBrandId = newValue;
  if(this.userType=='D' && action=='model'){{
     this.selectedDealerId=null;
    this.selectedLocationId=null;
    this.selectedDesignationId=null;
  //  console.log("brand id ",this.selectedBrandId)
     this.utilitiesService.getDealers({brand_id:this.selectedBrandId}).subscribe((res:any)=>{
     
      if(res?.data?.error){
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Dealers!'})
      }
      else{
        this.dealers=res.data;
        
      }
      this.users=[]
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
  }
   }
else{
   this.utilitiesService.getDealers({brand_id:this.editUserForm.value.brand}).subscribe((res:any)=>{
     
      if(res?.data?.error){
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Dealers!'})
      }
      else{
        this.dealers=res.data;
      }
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })

}
 }
   onBDLSelection(){
    this.viewUser();
   }

   locationSelection(){
  //  console.log("users ",this.users[0].location[0].location_id,this.selectedLocationId)
if (!this.selectedLocationId) {
    // No designation selected — show all users
    this.users = [...this.allUsers];
  } else {
  // Filter by selected location (check inside the array)
  this.users = this.allUsers.filter(
    (user: any) =>
      user.location?.some(
        (loc: any) => loc.location_id.toString() === this.selectedLocationId.toString()
      )
  );

 // console.log("Filtered users:", this.users);
}
   }
   getBrands(){

    this.globalBlockUiService.startLoading();
    this.utilitiesService.getBrands().subscribe((res:any)=>{
     
      this.globalBlockUiService.stopLoading();
      if(res?.data?.error){
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Brands!'})
      }
      this.brands=res.data;
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
  }
   onDealerChange(event:any,action?:any){
    // console.log(this.slForm.value)
    // this.globalBlockUiService.startLoading();
   
    
    
    if(this.userType=='D' && action=='model'){
 
      this.utilitiesService.getLocations({dealer_id:this.selectedDealerId}).subscribe((res:any)=>{
        this.locations=res.data;
        this.users=[]
        this.locations = this.locations.map((loc:any) => ({
  ...loc,
  location_id: Number(loc.location_id)
}));
        this.globalBlockUiService.stopLoading();
        this.onBDLSelection();
        // console.log(this.brands)
        if(res?.data?.error){
          this.globalBlockUiService.stopLoading();
          return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Locations!'})
        }
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
   
   else{
         this.editUserForm?.get('location')?.setValue([]);
     this.utilitiesService.getLocations({dealer_id:this.editUserForm.value.dealer}).subscribe((res:any)=>{
        this.locations=res.data;
        this.globalBlockUiService.stopLoading();
        // console.log(this.brands)
        if(res?.data?.error){
          this.globalBlockUiService.stopLoading();
          return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Locations!'})
        }
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
   }
      checkEmailAvailability() {
        this.showErrorMessage = '';
    
        // Loop through the email array to check if the entered email exists
        let emailExists = false;
       // console.log("email exists ",this.emailArray);
  
        this.emailArray?.forEach((item: any) => {
          // Check if the email exists in the array
          if (item.vcEmail === this.editUserForm.value.email) {
            this.showErrorMessage = '';
            //this.userName=item.name
            emailExists = true; // Email found, set flag to true
            // console.log(item.emailId, this.editUserForm.value.email, this.emailMessage);
          }
        });
      
        // If email is not found in the array, update the message
        if (emailExists && this.editUserForm.value.email) {
          this.showErrorMessage = 'Email Id is already taken.';
          // console.log(this.emailMessage);
        }
       
      }
  
      getToggleStatus(product: any): boolean {
        return product.status === 'Active';
      }
    
      setToggleStatus(product: any, value: boolean): void {
        product.status = value ? 'Active' : 'Inactive';
      }
  
      setToggleState(product: any): boolean {
        // return product.status === 'Active'; // true if 'Active', false if 'Inactive'
       // console.log("product in set toggle state 202 ",product)
        // return product.status ==true;
        return product.status==true?true:false
      }
    
      onStatusChange(product: any,status:any) {
        // this.setToggleStatus(product, this.getToggleStatus(product));
        //let status=product.status === 'Active' ? 'Inactive' : 'Active'
        // This ensures that the status is updated correctly when toggling
       // console.log("product 209 ",product,status)
        product.status = product.status == true ? false : true;
  
       // console.log(product);
        this.globalBlockUiService.startLoading();
        this.userService.deleteUser({...product,token:this.token,loginUserId:this.userId}).subscribe((res:any)=>{
          this.globalBlockUiService.stopLoading();
          this.viewUser();
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
        })
    }
      getRoles(){
        this.globalBlockUiService.startLoading();
        this.utilitiesService.getRoles().subscribe((res:any)=>{
          // this.globalBlockUiService.stopLoading();
          this.roles=res.data;
          this.getDesignations();
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
        //  console.log("roles error ",error)
        })
      }
    
      getDesignations(){
        this.globalBlockUiService.startLoading();
        this.utilitiesService.getDesignations().subscribe((res:any)=>{
          // this.globalBlockUiService.stopLoading();;
          this.designations=res.data;
          this.getBusinessVertical();
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
          //console.log("designtion error ",error)
        })
      }
  
      getBusinessVertical(){
        this.globalBlockUiService.startLoading();
        this.utilitiesService.getBusinessVertical().subscribe((res:any)=>{
          // this.globalBlockUiService.stopLoading();
          this.associatedBusinesses=res.data;
          this.viewUser();
        },(error:any)=>{
          this.isLoading=false
          //console.log("vertical error ",error)
        })
      }
  
      cancel(){
        this.markFormControlsAsUntouched();
        this.visible=false
         this.editUserForm.reset();  // Resets form values to their initial state
        
  
      // Step 2: Trigger change detection to apply changes
      this.cdr.detectChanges();      
        // this.editUserForm.markAsUntouched(); // Marks all controls as untouched
        // this.editUserForm.markAsPristine(); // Marks all controls as pristine
    
      }
       
  
      exportToExcel(): void {
  
        let data:any=[];
      

        console.log("userType ",this.users,this.userType)
           const filteredUsers = this.users.filter((item: any) =>        
  item.type == this.userType
);


filteredUsers.forEach((item: any) => {
  console.log("item:", item);

  // Base columns for every row
  const row: any = {
    Name: item.name,
    Role: item.roleName,
    Designation: item.designationName,
    'Email Id': item.emailId,
    'Mobile No': item.mobileNo,
    'Business Vertical': item.associatedBusiness,
    'User Type': item.type === 'A' ? 'Admin' : 'User'
  };

  // For type 'D', add Brand, Dealer, Location
  if (item.type === 'D') {
    let brandObj=this.brands.find((obj:any)=>  {return this.selectedBrandId==obj.brand_id})
    let dealerObj=this.dealers.find((obj:any)=>  {return this.selectedDealerId==obj.dealer_id})
   row.Location = item.location?.map((loc: any) => loc.location_name).join(', ');
    row.Brand = brandObj?.brand;
    row.Dealer = dealerObj?.dealer_name;
    
  }

  data.push(row);
});

 // console.log("data ",data)
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Convert JSON data to worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append worksheet to workbook
    
        // Export the workbook to a file
        XLSX.writeFile(wb, 'Users List.xlsx');
      }
      private markFormControlsAsUntouched() {
        Object.keys(this.editUserForm.controls).forEach(controlName => {
          const control = this.editUserForm.get(controlName);
          if (control) {
            control.markAsUntouched();
            control.markAsPristine();
          }
        });
      }
    
      viewUser(event?:any){
        
        //  sessionStorage.setItem('usertype','d');
       // console.log('user Type ',this.userType)
        if(this.userType=='D'){
          this.users=[];
          
     // console.log("userType ",this.userType)
          this.globalBlockUiService.startLoading();
         this.getBrands();
       //  console.log(this.selectedBrandId,this.selectedDealerId,this.selectedLocationId)

          this.userService.viewUser({userType:this.userType,brandId:this.selectedBrandId,dealerId:this.selectedDealerId}).subscribe((res:any)=>{
            this.globalBlockUiService.stopLoading();
            let userArray=[];
           
            const userMap = new Map();
           for(let item of res?.data){
             //console.log(this.roles,this.associatedBusinesses,this.designations)
             let designationObj=this.designations.find((obj:any)=> {return item.designationId==obj.id})
            // console.log("designation ", item.designationId ,designationObj);
             this.designationName=designationObj?.designation_name
   
             let businessVerticalObj=this.associatedBusinesses.find((obj:any)=>  { return item.business_vertical==obj.id})
             // console.log("designation ",businessVerticalObj);
             this.businessVertical=businessVerticalObj?.business_vertical
   
             let roleObj=this.roles.find((obj:any)=>  {return item.roleId==obj.id})
             //console.log("designation ",roleObj);
             this.roleName=roleObj?.role_name
   
            const locationObj = this.locations.find((loc: any) => loc.location_id == item.locationid);

    const locationData = {
      location_id: parseInt(item.locationid,10),
      location_name: locationObj?.location_name || ''
    };
    //  const locationData = parseInt(item.locationid,10)
    if (!userMap.has(item.userId)) {
      userMap.set(item.userId, {
        ...item,
        location: [locationData],
        designationName: designationObj?.designation_name,
        roleName: roleObj?.role_name,
        associatedBusiness: businessVerticalObj?.business_vertical
      });
    } else {
      const existing = userMap.get(item.userId);
      const alreadyExists = existing.location.some((loc: any) => loc.location_id == item.locationid);
      if (!alreadyExists) {
        existing.location.push(locationData);
      }
    }
          //    userArray.push({
          //      ...item,
          //      designationName:designationObj?.designation_name,
          //      roleName:roleObj?.role_name,
          //      associatedBusiness:businessVerticalObj?.business_vertical
             
          //  })
          }


          userArray = Array.from(userMap.values());
          userArray.forEach(user => {
  const userId = user.userId;

  // get the data from Map
  const mapUser = userMap.get(userId);

  // if (mapUser) {
  //   console.log('Found user in map:', mapUser);

  //   // Patch the form for this user
  //   // this.editUserForm.patchValue({
  //   //   location: mapUser.location
  //   // });
  // } else {
  //   console.log('No user in map for ID', userId);
  // }
});

          this.users = userArray;
          this.allUsers = userArray;
        

       
  // Patch the form


  // console.log('Patching form for userId:',  'with locations:', locationIds);

// this.editUserForm.patchValue({
//   location: locationIds
// });
          this.dt?.clear()
        //  console.log('Form control value', this.editUserForm.get('location')?.value);
   
        // console.log("users ",this.users)
          
         },(error:any)=>{
           this.globalBlockUiService.stopLoading();
         })
        }
       
       else{
        this.userType='A'
        this.selectedBrandId=null;
        this.selectedDealerId=null;
        this.selectedLocationId=null;
        this.selectedDesignationId=null;
         this.globalBlockUiService.startLoading();
        this.userService.viewUser({userType:this.userType}).subscribe((res:any)=>{
            this.globalBlockUiService.stopLoading();
            let userArray=[];
 
           for(let item of res?.data){
             //console.log(this.roles,this.associatedBusinesses,this.designations)
             let designationObj=this.designations.find((obj:any)=> {return item.designationId==obj.id})
            // console.log("designation ", item.designationId ,designationObj);
             this.designationName=designationObj?.designation_name
   
             let businessVerticalObj=this.associatedBusinesses.find((obj:any)=>  { return item.business_vertical==obj.id})
             // console.log("designation ",businessVerticalObj);
             this.businessVertical=businessVerticalObj?.business_vertical
   
             let roleObj=this.roles.find((obj:any)=>  {return item.roleId==obj.id})
             //console.log("designation ",roleObj);
             this.roleName=roleObj?.role_name
   
             userArray.push({
               ...item,
               designationName:designationObj?.designation_name,
               roleName:roleObj?.role_name,
               associatedBusiness:businessVerticalObj?.business_vertical
             
           })
           
         }
         this.users=userArray;
         this.dt?.clear()
        // console.log("users ",this.users)
          
         },(error:any)=>{
           this.globalBlockUiService.stopLoading();
         })
       }
      }
  


      submit(){
  
        // this.userId=293;
        if(this.editUserForm.valid){
       //   console.log(this.editUserForm.value)
           //let link="http://localhost:4200/core/update-user-password";
        //let link="http://103.30.72.109/core/update-user-password";
       let link="http://web16.185.238.new.ocpwebserver.com/core/update-user-password";
  
          if(this.actionName=='Add User'){
            
            this.globalBlockUiService.startLoading();
           
            this.userService.createUser({...this.editUserForm.value,userId:this.userId,token:this.token,link:link}).subscribe((res:any)=>{
              this.globalBlockUiService.stopLoading();
              this.viewUser();
              this.visible = false;
              if(res.error?.code){
                return  this.messageService.add({severity:'error' ,summary:'Error in creating User',life:300000})
              }
              this.messageService.add({severity:'success',life:10000,summary:'User is created Succesfully',detail:'Email has been sent to your registered ID'})
              
              
            },(error:any)=>{
              this.globalBlockUiService.stopLoading();
              this.messageService.add({severity:'error',life:30000000,summary:'Error in creating User...'})
            })
          }
          else{
            this.globalBlockUiService.startLoading();
          //  console.log("edit user dealer id ",this.selectedDealerId,this.editUserForm.value)
          
            this.userService.editUser({...this.editUserForm.value,userId:this.rowId,updatedBy:this.userId,token:this.token}).subscribe((res:any)=>{
              this.globalBlockUiService.stopLoading();
              this.viewUser();
              this.visible = false;
              if(res.error?.code){
                return  this.messageService.add({severity:'error' ,summary:'Error in Updating User',life:300000})
              }
              this.messageService.add({severity:'success',life:10000,summary:'User is updated Succesfully.'})
            //  console.log(this.roles,this.designations)
             
            },(error:any)=>{
              this.globalBlockUiService.stopLoading();
              this.messageService.add({severity:'error',life:30000000,summary:'Error in updating User...'})
            })
          }
         
        }
        else{
          Object.keys(this.editUserForm.controls).forEach(controlName=>{
            this.editUserForm.get(controlName)?.markAsTouched()
          })
        }
      }
}
