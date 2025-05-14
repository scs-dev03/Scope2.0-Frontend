import { ChangeDetectorRef, Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-view-create-user',
  imports: [SHARED_IMPORTS,PrimengModuleModule,SharedModule],
  providers:[MessageService],
  templateUrl: './view-create-user.component.html',
  styleUrl: './view-create-user.component.css'
})
export class ViewCreateUserComponent {

  users:any = [
  ]
      visible: boolean = false;
      associatedBusinesses:any=[
    ];
    isSidebarVisible:boolean=false;
    designationName:any;
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
     dataSubscription: Subscription|null=null;
     currentRoute:any;
    receivedData: any=[];
    userPermissions:any=[];
      statuses:any=[
        { name:'Active',id:1},
     
         {name:'Inactive',id:0}
       ]
      constructor(private router:Router,private utilitiesService:UtilitiesService,
        private fb:FormBuilder,private cdr:ChangeDetectorRef,
        private userService:UserService,private messageService:MessageService,
        private authService:AuthService,
        private sharedService:SharedServiceService,
        private sidebarService:SidebarService,
        private globalBlockUiService:GlobalBlockUiService
      ){
       
   this.editUserForm= this.fb.group({
      // Define each form control with validators combined using Validator.compose
      name: ['', Validators.compose([Validators.required])],
      lastName:['',Validators.compose([Validators.required])],
      designation: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobileNo: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{10}$')])],
      associatedBusiness: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.currentRoute=router.url;
   // console.log(this.currentRoute)
  }
    
  
    showDialog(action:any,rowData?:any) {
   //  console.log(rowData)
      this.actionName=action;
      if(this.actionName=='Add User'){
        this.viewUser();
        this.editUserForm.reset();
        
      }else{
        this.rowId=rowData.userId;
        let designationObj=this.designations.find((obj:any)=>{ return obj.id==rowData.designationId})
        let roleObj=this.roles.find((obj:any)=>{return obj.id==rowData.roleId})
        let verticalObj=this.associatedBusinesses.find((obj:any)=>{return obj.id==rowData.business_vertical})
         let statusObj=this.statuses.find((obj:any)=>{return obj.name==rowData.status?'Active':'Inactive'})
       // console.log(roleObj,designationObj,verticalObj,statusObj,rowData)
        this.editUserForm.patchValue({
          name: rowData.vcFirstName,
          lastName:rowData.vcLastName,
          email: rowData.emailId,
          designation: designationObj ? designationObj.id : null,  // Patch the ID, not the name
          role: roleObj ? roleObj.id : null,  // Patch the ID, not the name
          associatedBusiness: verticalObj ? verticalObj.id : null,  // Patch the ID, not the name
          mobileNo: rowData.mobileNo,
          userId: rowData.userId,
          status: statusObj?statusObj?.name:null
        });
  
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
    
      this.userId=localStorage.getItem('userId');
      this.token=localStorage.getItem('usertoken');
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
         console.log("result",this.userPermissions)
         
        }
      );

      this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
        this.isSidebarVisible=visible
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
  
  console.log("combined result ",groupedData)
  //console.log("combined Result ",combinedResult)
  this.sidebarItems = combinedResult;
  //console.log("sidebar ",this.sidebarItems)
  //this.sendDataToUser(this.sidebarItems);
  // this.filteredItems = [...this.sidebarItems];
  // console.log("filtered items ",this.filteredItems)
  return combinedResult;
}

      checkEmailAvailability() {
        this.showErrorMessage = '';
    
        // Loop through the email array to check if the entered email exists
        let emailExists = false;
       // console.log("email exists ",this.emailArray);
  
        this.emailArray.forEach((item: any) => {
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
        this.users.forEach((item:any)=>{
          data.push({
            Name:item.name,
          Role:item.roleName,
          Designation:item.designationName,
          'Email Id':item.emailId,
          'Mobile No':item.mobileNo,
          'Business Vertical':item.associatedBusiness
          })
          
        })
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
    
      viewUser(){
         this.globalBlockUiService.startLoading();
        this.userService.viewUser().subscribe((res:any)=>{
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
       // console.log("users ",this.users)
         
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
        })
      }
  
      submit(){
  
        if(this.editUserForm.valid){
       //   console.log(this.editUserForm.value)
           let link="http://localhost:4200/core/update-user-password";
        //let link="http://103.30.72.109/core/update-user-password";
       // let link="http://web17.185.238.new.ocpwebserver.com/core/update-user-password";
  
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
