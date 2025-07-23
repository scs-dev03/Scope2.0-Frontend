import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { FileUpload } from 'primeng/fileupload';
import { UtilitiesService } from '../../services/utilities.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockUploadBySpmService } from '../../services/stock-upload-by-spm.service';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';
import { UserService } from '../../services/user.service';
import { SidebarService } from '../../services/sidebar.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { StockUploadByUserService } from '../../services/stock-upload-by-user.service';
@Component({
  selector: 'app-multi-location',
  imports: [PrimengModuleModule,SharedModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './multi-location.component.html',
  styleUrl: './multi-location.component.css'
})
export class MultiLocationComponent {

  @ViewChild('dataTable') dataTable: Table | undefined;
  showTable:boolean=false;
  records:any[]=[];
 mlForm:FormGroup;
 locations:any=[];
 formData=new FormData();
 locationName:any;
 addedBy:any;
 addedOn:any;
 files: any[] = [];
 partNotInMasterData:any[]=[];
 previousLocations:any[]=[];
 userId:any;
 brands:any=[];
 dealers:any=[];
 first = 0;
 locationAdd=1;
 visible:boolean=false;
response:any=[];
users:any=[];
visibleSidebar:boolean=false;
dealerId:any;
moduleType:any='multi'
file:any;
fileName:any;
blForm:FormGroup
 isDataPresentPartNotInMaster:boolean=false;
        locationSelected: Set<number> = new Set(); // To track selected locations
        @ViewChildren('fu') fu: QueryList<FileUpload> | undefined;
         @ViewChild('fu1') fu1: FileUpload | undefined;
         showUploader:boolean=true;
    constructor(private utilitiesService:UtilitiesService,
     private fb:FormBuilder,
     private stockUploadService:StockUploadBySpmService,
     private globalBlockUiService:GlobalBlockUiService,
     private messageService:MessageService,
     private userService:UserService,
     private sidebarService:SidebarService,
     private sharedService:SharedServiceService,
     private stockUploadServiceBySCSUser:StockUploadByUserService
    ){

     
        this.mlForm = this.fb.group({
          locations: this.fb.array([]),
          brand:[''],
          dealer:['']
        });
        // this.addLocation(); // Initially add one location entry

        this.blForm=this.fb.group({
          file:['',Validators.required]
        })
       this.sharedService.updateModuleName('Multi Location / Bulk Stock Upload')
      
    }

    onRadioButtonChange(event:any){
      this.showTable=false;
      this.mlForm.reset();
      this.blForm.reset();
      this.partNotInMasterData=[];
      this.initializeFormArray()
    }
     onSelectForBulk(event: any) {
    const fileControl = this.blForm.get('file'); // Get the file form control
    
    // Check if exactly one file is selected
    if (event.files && event.files.length === 1) {
      const file = event.files[0]; // Get the first selected file
      
      // If a file is selected, update the form control with the new file
      fileControl?.setValue(file);
      
      // Set class variables for further use (e.g., for displaying the file name)
      this.file = file;
      this.fileName = file.name;
    } else {
      // If no file or more than one file is selected, reset the form control
      fileControl?.setValue(null);
      this.file = null;
      this.fileName = '';
    }
  
    // Trigger form control validation to ensure the validation state is updated
    fileControl?.updateValueAndValidity();
  }
    onPageChange(event: any) {
      this.first = event.first; // Track current page number
    }
    ngOnInit(){
      // this.getLocations();
      this.getBrands();
      // this.dealerId=20210;
      
  //  localStorage.setItem('dealerid',"20141");
      // localStorage.setItem('brandid',"33")
    // this.userId=38
      this.userService.allUserData$.subscribe((users:any)=>{
        this.users=users;
      })
      // localStorage.setItem('dealerid',"20141");
      this.dealerId=localStorage.getItem('dealerid');
      this.getLocations()
       this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
    this.visibleSidebar=visible;
   })
      this.userId=localStorage.getItem('userid');
     //  this.userId=38
    }
    get locationControls() {
      return (this.mlForm.get('locations') as FormArray);
    }
  
    // Add new location entry (dropdown and file upload)
    addLocation() { 
    //  console.log("Form Array Size:", this.locationAdd, "Locations Size:", this.locations.length);
    
      if (this.locationControls.length >= this.locations.length) {
        return this.messageService.add({
          severity: 'error',
          detail: 'You cannot add more Locations!',
          life: 4000
        });
      }
    
      // Create a new form group
      const locationGroup = this.fb.group({
        location: ['', Validators.required],
        file: [null, Validators.required]
      });
    
      // Add the form group to the form array
      this.locationControls.push(locationGroup);
    }

    initializeFormArray() {
      this.locationControls.clear(); // Clear any existing form groups
    
      // Always start with only ONE form group
      this.locationControls.push(
        this.fb.group({
          location: ['', Validators.required],
          file: [null, Validators.required]
        })
      );
    }

  
    // Remove location entry
    removeLocation(index: number) {
      (this.mlForm.get('locations') as FormArray).removeAt(index);
      this.locationSelected.clear(); // Reset the set of selected locations
      this.validateLocations(); // Revalidate all locations
     // this.locationAdd--;
    }
  
    // Handle file selection
    onFileSelect(event: any, index: number) {
      const file = event.files[0]; // Only take the first file selected
      const locationGroup = (this.mlForm.get('locations') as FormArray).at(index);
      locationGroup.patchValue({ file: file });
      // console.log(locationGroup)
    }
  
    updateFormArray() {
     
  
      // Adjust form array size based on locations array
      // while (formArray.length < this.locations.length) {
      //   this.addLocation();
      // }
  
      // while (formArray.length > this.locations.length) {
      //   this.removeLocation(formArray.length - 1);
      // }
     
    }
    // Handle location change (to validate duplicate location selection)
    onLocationChange(index: number) {

    //   const locationControl = (this.mlForm.get('locations') as FormArray).at(index).get('location');
    //   const selectedLocation = locationControl?.value;
    
    //   // Clear previous errors
    //   locationControl?.setErrors(null);
    
    //   // Check if there was a previous location selected
    //   const previousLocation = this.previousLocations[index];
    
    //   // If there was a previous location and it's different, remove it from the locationSelected set
    //   if (previousLocation && previousLocation !== selectedLocation) {
    //     this.locationSelected.delete(previousLocation);
    //   }
    
    //   // Update previous location with the new one
    //   this.previousLocations[index] = selectedLocation;
    
    //   // Check for duplicate locations
    //   if (this.locationSelected.has(selectedLocation)) {
    //     locationControl?.setErrors({ duplicateLocation: true });
    //   } else {
    //     this.locationSelected.add(selectedLocation); // Mark the location as selected
        
    //   }
    //  // this.getPartNotInMasterRecords();
    this.validateLocations();
      
    }
    
    
  
    // Validate that no location is selected twice
 validateLocations() {
  const formArray = this.mlForm.get('locations') as FormArray;
  const locationIds = formArray.controls.map(control => control.get('location')?.value);

  // Step 1: Clear all duplicateLocation errors, preserve others
  formArray.controls.forEach(control => {
    const locControl = control.get('location');
    if (locControl) {
      const currentErrors = locControl.errors;
      if (currentErrors && currentErrors['duplicateLocation']) {
        delete currentErrors['duplicateLocation'];
        locControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
      }
    }
  });

  // Step 2: Mark duplicates
  locationIds.forEach((id, idx) => {
    if (!id) return;

    const isDuplicate = locationIds.filter(l => l === id).length > 1;
    if (isDuplicate) {
      const locControl = formArray.at(idx).get('location');
      if (locControl) {
        const currentErrors = locControl.errors || {};
        locControl.setErrors({ ...currentErrors, duplicateLocation: true });
      }
    }
  });
}


  
    // Handle the submit (upload)
    onUpload() {
     
    
      // let dealerId=20295;
  
      if (this.mlForm.valid) {
        this.globalBlockUiService.startLoading();
        // const formData = new FormData();
  
        const locations = this.mlForm.get('locations')?.value;
    //    console.log("locations ",locations)
      // Iterate through locations and append each file and location to FormData
      locations.forEach((location: any) => {
        if (location.file) {
           const originalName = location.file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    
    // Custom filename — you can modify this logic
    const renamedFile = `${location.location}_${originalName}_ml`;
          this.formData.append('files[]', location.file,renamedFile); // Append file
        }
        if (location.location) {
          this.formData.append('location_id', location.location); // Append location ID
        }
        this.formData.append('user_id', this.userId.toString());
        
        this.formData.append('dealer_id', this.dealerId.toString());
      });
    

        this.stockUploadService.uploadMultiLocation(this.formData).subscribe((res:any)=>{
          let uploadedLocations=[];
          uploadedLocations.push(locations);
          this.globalBlockUiService.stopLoading();
          // if(res?.headerNotPresent){
          //   this.formData=new FormData();
          //   this.clearFileUploads();
          //   return this.messageService.add({severity:'error',life:4000,summary:'Headers are not matched with the required fields!'})
          // }
          // if(res?.error){
          //   this.mlForm.reset();
          //   this.showTable=false;
          //   this.messageService.add({severity:'error',detail:'Error in uploading the file!',life:4000});
          // }
          if(res?.mappingNotPresent){
            this.mlForm.reset();
             this.formData=new FormData();
          this.clearFileUploads();
            this.messageService.add({severity:'error',detail:'Brand Mapping is not available!!',life:4000});
          }
           if(res?.isEmptyFile){
             this.mlForm.reset();
          this.file=null;
          this.formData=new FormData();
          this.clearFileUploads();
          this.showTable=false;
          return this.messageService.add({severity:'error',life:4000,summary:'File cannot be Blank!'});
        }
          else{
            this.showTable=true;
            if (this.dataTable) {
              this.dataTable.reset(); // Reset the paginator after data changes
            }
           this.getRecords();

           if(res?.error){
            this.messageService.add({severity:'error',life:4000,detail:'Error is uploaded File!'});
           }else{
            this.visible=true;
            let responseData=res;
          //  this.getPartNotInMasterRecords();
         //  console.log("uploaded locations ",responseData)
            uploadedLocations[0].map((item: any) => {
         //    console.log("item ", item);
             let locationObj = this.locations.find(
               (obj: any) => obj.location_id == parseInt(item.location, 10)
             );
           //  console.log("locationObj ", locationObj);
           
             const locationId = parseInt(item.location, 10);
             const alreadyExists = this.response.some(
               (resp: any) => resp.locationId === locationId
             );
           
             let statusMsg ='';
             if (responseData?.length > 0) {
               let obj = responseData.find(
                 (obj: any) => obj.locationId == item.location
               );
            //   console.log("obj ", obj);
           
               if (obj.status) {
                 statusMsg = `❌ Data not uploaded successfully.(${obj.log})`;
               }
               else{
                statusMsg=obj.log
               }
             }
           
             // Only push if not already added
             if (!alreadyExists) {
               this.response.push({
                 locationName: locationObj?.location_name,
                 locationId,
                 status: statusMsg,
               });
             }
           
             //console.log("responses ", this.response);
             
           });

           }
                 
          
          this.formData=new FormData();
          this.clearFileUploads();
          }

        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
          this.messageService.add({key: 'upload-error',severity:'error',detail:'Error in uploading file.Please Contact Admin!',life:8000});
          this.formData=new FormData();
          // this.mlForm.get('locations')?.setValue(null);
          this.clearFileUploads();
          // this.mlForm.reset();
        })

      }
      else{
        const locations = this.mlForm.get('locations') as FormArray;

        if (locations && locations.controls.length > 0) {
          locations.controls.forEach((control: AbstractControl) => {
            if (control instanceof FormGroup) {
              control.markAllAsTouched(); // Mark all controls within each location as touched
        
              // Get the file control and mark it as touched if it's invalid
              const fileControl = control.get('file');
              if (fileControl && fileControl.invalid) {
                fileControl.markAsTouched();
                fileControl.updateValueAndValidity(); // Revalidate to trigger error messages
              }
            }
          });
        }
      }        
    }

    onBulkUpload(){
let formData1 = new FormData();
      if(this.blForm.invalid){
        Object.keys(this.blForm.controls).forEach(controlName => {
          this.blForm.get(controlName)?.markAllAsTouched()
        });
      }
      else{
         
       formData1.append('excelFile', this.file, this.fileName);
       formData1.append('dealer_id', localStorage?.getItem('dealerid')?.toString()??'');
      
       formData1.append('brand_id', localStorage?.getItem('brandid')?.toString()??'');
       formData1.append('user_id', this.userId.toString());
         this.globalBlockUiService.startLoading();
        this.stockUploadService.uploadBulkStock(formData1).subscribe((res:any)=>{
     this.globalBlockUiService.stopLoading();
      if(res?.headerNotPresent){
          this.resetBulkForm();
          if(res?.data?.missingFields){
            return this.messageService.add({severity:'error',life:4000,summary:`Required Fields for Quantity are not present ${res?.data?.missingFields}!`})
          }
          return this.messageService.add({severity:'error',life:4000,summary:'Headers are not matched with the required fields!'})
        }
         if(res?.isEmptyFile){
             this.blForm.reset();
          this.file=null;
          this.formData=new FormData();
          this.clearFileUploads();
          this.showTable=false;
          return this.messageService.add({severity:'error',life:4000,summary:'File cannot be Blank!'});
        }
        if(res?.mappingNotPresent){
          this.blForm.reset();
          this.showTable=false
           this.resetBulkForm();
         return this.messageService.add({severity:'error',detail:'Brand Mapping is not available!',life:4000});
        }
        if(res?.dealerLocationMappingNotPresent){
          this.blForm.reset();
          this.showTable=false;
           this.resetBulkForm();
          return this.messageService.add({severity:'error',detail:'Dealer Location Mapping is not available for selected Dealer!',life:4000});
        }
        
      if(res?.mappingNotPresent){
            this.blForm.reset();
            this.fu1?.clear();
             this.resetBulkForm();
          return  this.messageService.add({severity:'error',detail:'Brand Mapping is not available!!',life:4000});
          }
           if(res.length==0){
          this.blForm.get('file')?.reset();
           this.file=null;
           this.resetBulkForm();
          this.fu1?.clear();
          return this.messageService.add({severity:'success',detail:'Inventory Location Does not exists or Parts Uploaded are not in master Please contact Admin or recheck File ',life:4000})
        }
          else{
            this.showTable=true;
            if (this.dataTable) {
              this.dataTable.reset(); // Reset the paginator after data changes
            }
           this.getBulkRecords();

           if(res?.error){
             this.blForm.reset();
             this.fu1?.clear();
             this.file=null;
             this.fileName=''
             formData1=new FormData();
            return this.messageService.add({severity:'error',life:4000,detail:'Error is uploaded File!'});
           }else{
            // this.visible=true;
            let responseData=res;
             this.file=null;
             this.fileName=''
             this.resetBulkForm();
          //   console.log("inventory location ",res[0].inventoryLocationNotExist)
             if(res[0]?.inventoryLocationNotExist.length>0){
               this.messageService.add({severity:'success',detail:`Data Uploaded Succesfully! Inventory Location doesn't exist for ${res[0]?.inventoryLocationNotExist.join(', ')}`,life:10000});
             }else{
               
               this.messageService.add({severity:'success',detail:'Data Uploaded Succesfully!',life:4000});
             }
         //   this.getBulkPartNotInMasterRecords()
         //   console.log("uploaded locations ",responseData)         
           }
                 
          
           formData1=new FormData();
           this.blForm.reset();
           this.resetBulkForm();
            this.file=null;
             this.fileName=''
          this.clearFileUploads();
          }
        },(error:any)=>{

          this.fu1?.clear()
           this.globalBlockUiService.stopLoading();
           this.resetBulkForm();
            this.file=null;
             this.fileName=''
           formData1=new FormData();
            this.blForm.reset();
        })
      }
    }

    resetBulkForm(){
      this.file=null;
      this.fileName=''
      this.blForm.reset();
      this.showUploader = false;
  setTimeout(() => this.showUploader = true, 10);
    }

    clearResponse() {
      this.response = [];
    }
   
    clearFileUploads() {
      if (this.fu && this.fu.toArray().length > 0 && this.locationControls.controls.length > 0) {
        this.locationControls.controls.forEach((locationControl, index) => {
          const fileControl = locationControl.get('file');
          if (fileControl) {
            fileControl.setValue(null);
            fileControl.markAsPristine();
            fileControl.markAsUntouched();
          }
    
          const fileUpload = this.fu?.toArray()[index];
          if (fileUpload) {
            fileUpload.clear();       // Clear internal state
            fileUpload.files = [];    // Ensure files array is cleared
          }
        });
      }
    }

    getBulkRecords(){

      this.globalBlockUiService.startLoading();
        this.stockUploadServiceBySCSUser.getAllBulkRecords({dealer_id:localStorage.getItem('dealerid'),added_by:this.userId}).subscribe((res:any)=>{
          this.globalBlockUiService.stopLoading();
          this.records=[];
          this.records=res.data;
      // console.log("locations ",this.locations)
      this.addedOn=res.data.added_on;
    
     this.records= this.records.map((item:any)=>{
      
      let locationObj=this.locations.find((obj:any)=>obj.location_id==parseInt(item.location_id,10));
    //   console.log("locObj ",locationObj,item.location_id)
      let userObj=this.users.find((obj:any)=>obj.userId==item.added_by)
   // console.log("loc obj ",locationObj,this.locations)
      return{
        ...item,
        added_on: (item.added_on),
        locationName:locationObj?.location_name,
        added_by:userObj?.vcFirstName+' '+userObj.vcLastName
      }
       
       
     })
    })

   // console.log("records for bulk ",this.records)
    }
    
    getRecords(){
    
      const locations = this.mlForm.get('locations')?.value;
      
      this.globalBlockUiService.startLoading();
      this.stockUploadService.getRecordsMultiLocation({locations:locations}).subscribe((res:any)=>{
        this.records=[];
        this.records=res.data;
        this.globalBlockUiService.stopLoading();
       
      this.addedOn=res.data.added_on;
      
      // this.records=this.records[0]
      // console.log('this.records:', this.records); // Log the structure of records to check

      this.records = this.records.flat().map((item: any) => {
        // Find the location object based on location_id
        let locObj = this.locations.find((obj: any) => obj.location_id == item.location_id);
      
        let userObj=this.users.find((obj:any)=>obj.userId==item.added_by)
        // Return the updated item with formatted date, locationName, and added_by
        return {
          ...item,
          added_on: (item.added_on),  // Format the added_on date
          locationName: locObj?.location_name || '',  // Default locationName if not found
          added_by:  userObj?.vcFirstName +' '+userObj?.vcLastName  // Ensure added_by is always set, defaulting to empty string if undefined
       
        };
      });
  
      
      // console.log("records ",this.records)
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
        // this.messageService.add({severity:'error',detail:'Error in uploading the file!!',life:300000});
      })
    }

    getBulkPartNotInMasterRecords(){
      this.globalBlockUiService.startLoading();
 this.stockUploadService.getPartNotInMasterForBulk({brand_id:localStorage.getItem('brandid')}).subscribe((res:any)=>{
      this.globalBlockUiService.stopLoading();
      this.partNotInMasterData=[];
      this.partNotInMasterData=res.data;
      if(this.partNotInMasterData.length>0){
        this.isDataPresentPartNotInMaster=true;
      }else{
        this.isDataPresentPartNotInMaster=false;
      }
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
      this.messageService.add({severity:'error',summary:'Error in getting the part not in master !',life:4000})
    });
    }
    getLocations(){
      this.globalBlockUiService.startLoading();
      this.utilitiesService.getLocations({dealer_id:this.dealerId}).subscribe((res:any)=>{
        this.globalBlockUiService.stopLoading();
        this.locations=res.data;
         this.initializeFormArray();
        // console.log(this.brands)
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }

    onSelect(event:any){
      const files = event.files;
      const formArray = this.mlForm.get('files') as FormArray;
  
      files.forEach((file: File) => {
        formArray.push(this.fb.control(file));
      });
    }


    getPartNotInMasterRecords(){

      if(this.mlForm.get('locations')?.value!=''){
        this.globalBlockUiService.startLoading();
        this.stockUploadService.getPartNotInMasterMultiLocation({locations:this.mlForm.get('locations')?.value}).subscribe((res:any)=>{
           this.partNotInMasterData=[]; 
          this.partNotInMasterData=res.data;
          if(this.partNotInMasterData.length==0){
            this.isDataPresentPartNotInMaster=false;
          }
          else{
            this.isDataPresentPartNotInMaster=true;
          }
          this.globalBlockUiService.stopLoading();
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
        })
    }
  }
    exportTableData(){

       const modifiedData = this.records.map((item: any) => ({
                ['Location']: item.locationName,
                ['Previous Records']: item.prevStockUploadCount !=null?item.prevStockUploadCount:0 ,
                ['Current Records']: item.stockUploadCount !=null?item.stockUploadCount :0,
                ['Previous Sum Quantity']: item.prevQuantitySum !=null ?item.prevQuantitySum:0,
                ['Current Sum Quantity']: item.quantitySum  !=null ?item.quantitySum:0,
                ['Added On ']: this.formatDate(item.added_on),
                ['Added By ']:item.added_by
               
          
              }));
              const ws = XLSX.utils.json_to_sheet(modifiedData);
          
              // Create a workbook and append the worksheet
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
          
              // Write the workbook to a file and trigger download
              XLSX.writeFile(wb, 'exported_data.xlsx');
    }

    exportToExcel(){
   
      if(this.partNotInMasterData?.length>0){
      const ws = XLSX.utils.json_to_sheet(this.partNotInMasterData);
          
              // Create a workbook and append the worksheet
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
          
              // Write the workbook to a file and trigger download
              XLSX.writeFile(wb, 'part_not_in_master_data.xlsx');
    }
  }
    exportUploadedData(){
      this.getUploadedData();
    }

    formatDate(dateString: string): string {
      const date = new Date(dateString); // Parse the input string as a date
    
      // Check if the Date object is valid
      if (isNaN(date.getTime())) {
        return '-'; // Return a default value if the date is invalid
      }
    
      // Extract year, month, day, hours, minutes, and seconds in IST
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Use UTC methods to avoid time zone conversion
      const day = date.getUTCDate().toString().padStart(2, '0');
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      // const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
      // Combine and return the formatted string as 'DD-MM-YYYY HH:MM:SS'
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    getUploadedData(){
      const hasEmptyLocation = this.mlForm.get('locations')?.value.some((item:any) => item.location === "");
     
      if(!hasEmptyLocation){
        this.globalBlockUiService.startLoading();
        this.stockUploadService.getMultiLocationUploadedData({locations:this.mlForm.get('locations')?.value}).subscribe((blob:any)=>{
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
    
          // Set the file name and trigger the download
          link.href = url;
          link.download = 'uploaded_data.zip'; // You can set a dynamic file name here
          link.click();
    
          // Cleanup the object URL after download
          window.URL.revokeObjectURL(url);
              this.globalBlockUiService.stopLoading();
              this.messageService.add({severity:'success',detail:'File is generated succesfully for uploaded stock',life:3000})
        },(error:any)=>{
          this.globalBlockUiService.stopLoading();
          this.messageService.add({severity:'error',detail:'Error in Downloading the file',life:4000});
        })
      }
      else{
        this.messageService.add({severity:'error',detail:'Select the locations',life:4000});
      }
      
    }

    getBrands(){

      this.globalBlockUiService.startLoading();
      this.utilitiesService.getBrands().subscribe((res:any)=>{
       
        this.globalBlockUiService.stopLoading();
        if(res?.data?.error){
          // console.log("res ",res.data.error)
          this.globalBlockUiService.stopLoading();
          return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Brands!'})
        }
        
          this.brands=res.data;
      
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
  
    onBrandChange(event:any){
      // this.getPartNotInMasterRecords()

      // this.globalBlockUiService.startLoading();
      this.utilitiesService.getDealers({brand_id:this.mlForm.value.brand}).subscribe((res:any)=>{
        this.dealers=res.data;
        this.globalBlockUiService.stopLoading();
        if(res?.data?.error){
          this.globalBlockUiService.stopLoading();
          return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Dealers!'})
        }
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
  
    onDealerChange(event:any){
      // this.globalBlockUiService.startLoading();
      this.locationAdd=1;
    this.utilitiesService.getLocations({dealer_id:this.mlForm.value.dealer}).subscribe((res:any)=>{
      this.locations=res.data;
      // this.updateFormArray();
     
      this.globalBlockUiService.stopLoading();
      if(res?.data?.error){
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Locations!'})
      }
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
    })
    }

    getBulkUploadedData(){

      this.stockUploadServiceBySCSUser.getUploadedData({dealer_id:localStorage.getItem('dealerid'),user_id:this.userId}).subscribe((blob:any)=>{
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);

      // Set the file name and trigger the download
      link.href = url;
      link.download = 'uploaded_data.zip'; // You can set a dynamic file name here
      link.click();

      // Cleanup the object URL after download
      window.URL.revokeObjectURL(url);
          this.globalBlockUiService.stopLoading();
          this.messageService.add({severity:'success',detail:'File is generated succesfully for Uploaded Data',life:3000})
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
      this.messageService.add({severity:'error',detail:'Error in downloading the file',life:4000});
    }) 
    }

    getPartNotInMasterBulk(){
      this.stockUploadService.getPartNotInMasterForBulk({dealer_id:localStorage.getItem('dealerid')}).subscribe((res:any)=>{
         this.partNotInMasterData=res.data;
          if(this.partNotInMasterData.length==0){
            this.isDataPresentPartNotInMaster=false;
          }
          else{
            this.isDataPresentPartNotInMaster=true;
             if(this.partNotInMasterData?.length>0){
      const ws = XLSX.utils.json_to_sheet(this.partNotInMasterData);
          
              // Create a workbook and append the worksheet
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
          
              // Write the workbook to a file and trigger download
              XLSX.writeFile(wb, 'part_not_in_master_data.xlsx');
    }
          }
          this.globalBlockUiService.stopLoading();
      })
    }
}
