import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { UserService } from '../../../services/user.service';
import { SidebarService } from '../../../services/sidebar.service';
import { SharedServiceService } from '../../../services/shared-service.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { StockUploadBySpmService } from '../../../services/stock-upload-by-spm.service';
import { StockUploadByUserService } from '../../../services/stock-upload-by-user.service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { TocService } from '../../../services/toc.service';
@Component({
  selector: 'app-bulk-upload',
  imports: [FormsModule,CommonModule,ReactiveFormsModule,SharedModule,PrimengModuleModule],
  providers:[MessageService],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.css'
})
export class BulkUploadComponent {


  @ViewChild('dataTable') dataTable: Table | undefined;
  showTable:boolean=false;
  records:any[]=[];

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
fileUploadVisible: boolean[] = [];
userName:any;

 isDataPresentPartNotInMaster:boolean=false;
        locationSelected: Set<number> = new Set(); // To track selected locations
        @ViewChildren('fu') fu: QueryList<FileUpload> | undefined;
         @ViewChild('fu1') fu1: FileUpload | undefined;
         showUploader:boolean=true;
    constructor(private utilitiesService:UtilitiesService,
     private fb:FormBuilder,
     private globalBlockUiService:GlobalBlockUiService,
     private messageService:MessageService,
     private userService:UserService,
     private sidebarService:SidebarService,
     private sharedService:SharedServiceService,
     private tocUploadService:TocService
    
    ){

       this.blForm=this.fb.group({
          file:['',Validators.required]
        })
       this.sharedService.updateModuleName('Bulk Upload')
        this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
    this.visibleSidebar=visible;
   })
    this.userService.allUserData$.subscribe((users:any)=>{
        this.users=users;
      })
   this.userName=localStorage.getItem('username');
   this.getLocations();
    }


     getLocations(){
      this.globalBlockUiService.startLoading();
      this.utilitiesService.getLocations({dealer_id:localStorage.getItem('dealerid')}).subscribe((res:any)=>{
        this.globalBlockUiService.stopLoading();
        this.locations=res.data;
       
       //  this.initializeFormArray();
        // console.log(this.brands)
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();
      })
    }
     onPageChange(event: any) {
      this.first = event.first; // Track current page number
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
       formData1.append('updatedBy', this.userName.toString());
         this.globalBlockUiService.startLoading();
        this.tocUploadService.uploadBulkToc(formData1).subscribe((res:any)=>{
     this.globalBlockUiService.stopLoading();
        this.file=null;
          this.fu1?.clear();
         this.blForm.reset();
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

     getBulkRecords(){

      this.globalBlockUiService.startLoading();
        this.tocUploadService.getRecords({dealerId:localStorage.getItem('dealerid'),added_by:this.userId}).subscribe((res:any)=>{
          this.globalBlockUiService.stopLoading();
          this.records=[];
          this.records=res.data;
      // console.log("locations ",this.locations)
      this.addedOn=res.data.added_on;
    
     this.records= this.records.map((item:any)=>{
      
      let locationObj=this.locations.find((obj:any)=>parseInt(obj.location_id,10)==parseInt(item.locationId,10));
    //  console.log("locObj ",locationObj,item.locationId,this.locations)
      let userObj=this.users.find((obj:any)=>parseInt(obj.userId,10)==parseInt(item.userId,10))
  // console.log("loc obj ",userObj,locationObj,item.userId)
      return{
        ...item,
        added_on: (item.addedOn),
        locationName:locationObj?.location_name,
        added_by:userObj?.vcFirstName+' '+userObj?.vcLastName
      }
       
       
     })
    })

   // console.log("records for bulk ",this.records)
    }

     exportTableData(){
    
           const modifiedData = this.records.map((item: any) => ({
                    ['Location']: item.locationName,
                    ['Previous Records']: item.prevRecordsCount !=null?item.prevRecordsCount:0 ,
                    ['Current Records']: item.currentRecordsCount !=null?item.currentRecordsCount :0,
                    ['Previous Sum Quantity']: item.prevSumQuantity !=null ?item.prevSumQuantity:0,
                    ['Current Sum Quantity']: item.currentSumQuantity  !=null ?item.currentSumQuantity:0,
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

  
}
