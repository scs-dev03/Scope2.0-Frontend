import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilitiesService } from '../../../services/utilities.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { StockUploadBySpmService } from '../../../services/stock-upload-by-spm.service';
import * as XLSX from 'xlsx';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { StockUploadByUserService } from '../../../services/stock-upload-by-user.service';
import { Table } from 'primeng/table';
import { SidebarService } from '../../../services/sidebar.service';
import { UserService } from '../../../services/user.service';
import { SharedServiceService } from '../../../services/shared-service.service';
import { TocService } from '../../../services/toc.service';
@Component({
  selector: 'app-single-upload',
 imports: [PrimengModuleModule,SharedModule,CommonModule,ReactiveFormsModule,FormsModule],
  providers:[MessageService,DatePipe],
  templateUrl: './single-upload.component.html',
  styleUrl: './single-upload.component.css'
})
export class SingleUploadComponent {
 selectedFile:any;
  isLoading:boolean=false;
  locations:any=[];
  file:any;
  fileName:any;
  slForm:FormGroup;
  records:any=[];
  currentUploadQuantity:any;
  prevCountRecords:any;
  currentCountRecords:any;
  prevUploadQuantity:any;
  showTable:any;
  locationName:any;
  addedOn:any;
  addedBy:any;
  uploadedData:any=[];
  visible:boolean=false;
  partNotInMasterRecords:any;
  brands:any=[];
  dealers:any=[];
  userId:any;
  users:any=[];
  @ViewChild('dataTable') dataTable: Table | undefined;
  isDataPresent:boolean=false;
  isDataPresentForPartNotInMaster:boolean=false
  min:any;
  max:any;
  userName:any;
  visibleSidebar:boolean=false;
  @ViewChild('fu') fu:FileUpload|null=null;
  constructor(private utilitiesService:UtilitiesService,
   private fb:FormBuilder,
   private stockUploadServiceByUser:StockUploadByUserService,
   private stockUploadService:StockUploadBySpmService,
   private globalBlockUiService:GlobalBlockUiService,
   private messageService:MessageService,
   private sidebarService:SidebarService,
   private userService:UserService,
   private sharedService:SharedServiceService,
   private tocService:TocService,
   private datePipe:DatePipe
  ){
 
   this.slForm=this.fb.group({
     location:['',Validators.required],
     brand:['',Validators.required],
     dealer:['',Validators.required],
     date:['',Validators.required],
    file:['',Validators.required]
   })
  }
 
  ngOnInit(){
    // this.getLocations();
   this.getBrands();

   this.userName=localStorage.getItem('username')
   this.max = new Date();

   // Set min date to three months ago
   this.min = new Date();
   this.min.setMonth(this.max.getMonth() - 3);

  this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
    this.visibleSidebar=visible;
  });

  this.userId=localStorage.getItem('userid');

  this.userService.allUserData$.subscribe((users:any)=>{
    this.users=users;
  })

   this.sharedService.updateModuleName('Single Stock Upload')
  }
 
  onSelect(event: any) {
    const fileControl = this.slForm.get('file'); // Get the file form control
    
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

  getBrands(){
     this.globalBlockUiService.startLoading();
    this.utilitiesService.getBrands().subscribe((res:any)=>{
      if(res?.data?.error){
        // console.log("res ",res.data.error)
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Brands!'})
      }
      this.brands=res.data;
       this.globalBlockUiService.stopLoading();
    },(error:any)=>{
      this.globalBlockUiService.stopLoading();
      this.messageService.add({severity:'error',life:4000,detail:'Error in fetching Brands'})
    })
  }

  onBrandChange(event:any){
    // this.getPartNotInMaster();
    this.utilitiesService.getDealers({brand_id:this.slForm.value.brand}).subscribe((res:any)=>{
      this.dealers=res.data;
    })
    this.slForm.get('date')?.reset();
    this.slForm.get('file')?.reset();
    this.slForm.get('location')?.reset();
    this.showTable=false;
  }

  onDealerChange(event:any){
  this.utilitiesService.getLocations({dealer_id:this.slForm.value.dealer}).subscribe((res:any)=>{
    this.locations=res.data;
  })
  }
 
   onUpload() {
 
    //  console.log("form ",this.slForm.valid)
    if(this.slForm.invalid){
 
      Object.keys(this.slForm.controls).forEach((controlName:any)=>{

        // if(controlName=='file'){
        //   return
        // }
            this.slForm.get(controlName)?.markAsTouched();
      })
    }
    
    else{
      if(this.fileName==''||this.fileName==null){
       return this.messageService.add({severity:'error',summary:'Select the File!!',life:4000});
       }

     let locationId=this.slForm.value.location;
     this.userId=localStorage.getItem('userid');
      
       let formData = new FormData();
       formData.append('files[]', this.file, this.fileName);
       formData.append('location_id', locationId.toString());
       formData.append('updatedBy', this.userName?.toString());
       formData.append('dealer_id', this.slForm.value.dealer.toString());
       formData.append('brand_id', this.slForm.value.brand.toString());
       formData.append('date',this.slForm.value.date.toString())
       this.globalBlockUiService.startLoading();
      this.tocService.uploadToc(formData).subscribe((res:any)=>{
        // this.getUploadedData();
        // this.getPartNotInMaster();
        // this.slForm.reset();
        this.globalBlockUiService.stopLoading();
        // console.log("res ",res)
        if(res?.headerNotPresent){
          this.fu?.clear();
          this.file=null;
          this.selectedFile=null;
          if(res?.data?.missingFields){
            return this.messageService.add({severity:'error',life:4000,summary:`Required Fields for Quantity are not present ${res?.data?.missingFields}!`})
          }
          return this.messageService.add({severity:'error',life:4000,summary:'Headers are not matched with the required fields!'})
        }
        if(res?.mappingNotPresent){
          this.fu?.clear();
          this.file=null;
          formData=new FormData();
          return this.messageService.add({severity:'error',life:4000,summary:'Brand Mapping is not available!!'});
        }
         if(res?.isEmptyFile){
            this.fu?.clear();
          this.file=null;
          formData=new FormData();
          return this.messageService.add({severity:'error',life:4000,summary:'File cannot be Blank!'});
        }
        if(res?.error){
          this.slForm.reset();
          this.showTable=false;
          this.file=null;
          this.fu?.clear();
          this.selectedFile=null;
          this.messageService.add({severity:'error',detail:'Internal Server Error',life:4000});
        }

        
        this.slForm.get('file')?.reset();
         this.showTable=true;
          if(res?.allPartsNotInMaster==0){
          this.showTable=true;
           this.getAllRecords();
        this.fu?.clear();
        this.file=null;
        this.selectedFile=null;
        formData=new FormData();
        this.slForm.get('file')?.reset();
         return this.messageService.add({severity:'success',life:3000,summary:'The file you are uploading contains parts that are not present in the part master. Please recheck the parts or get them updated by the admin.!'});
        }
        if(this.showTable){
          if (this.dataTable) {
            this.dataTable.reset(); // Reset the paginator after data changes
          }
          if(res?.allPartsNotInMaster!=0){
            this.messageService.add({severity:'success',summary:'TOC uploaded successfully!',life:3000})
          }
        }

        this.getAllRecords();
        this.fu?.clear();
        formData=new FormData();
        this.file=null;

       
      },(error)=>{
        // this.slForm.reset();
        this.fu?.clear();
        this.fileName='';
        formData=new FormData();
        this.file=null;
        this.slForm.get('file')?.reset();
        this.globalBlockUiService.stopLoading();
        this.messageService.add({key: 'upload-error',severity:'error',summary:'Error in Uploading file!!..',life:4000});
      })
       
    }
   }

 
  
   onLocationChange(event:any){
   
    this.getUploadedData();
   }

   getPartNotInMaster(){

    this.stockUploadServiceByUser.getPartNotInMaster({brand_id:this.slForm.value.brand}).subscribe((res:any)=>{
      this.partNotInMasterRecords=res.data;
      if(this.partNotInMasterRecords.length!=0){
        this.isDataPresentForPartNotInMaster=true;
      }
      else{
        this.isDataPresentForPartNotInMaster=false;
      }
    },(error:any)=>{

    })
   }
 
   exportToExcel(){

    if(this.partNotInMasterRecords?.length>0){
 const modifiedData = this.partNotInMasterRecords.map((item: any) => ({
     
      ['Part Number']: item.partnumber , 

    }));

    const ws = XLSX.utils.json_to_sheet(modifiedData);
    
    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

    // Write the workbook to a file and trigger download
    XLSX.writeFile(wb, 'Part_Not_In_Master.xlsx');
    }
   
    
   }


   getUploadedData(){
    this.globalBlockUiService.startLoading();
    this.stockUploadService.getUploadedData({location_id:this.slForm.value.location,userType:'admin',date:this.slForm.value.date}).subscribe((res:any)=>{
      this.uploadedData=res.data;
      this.globalBlockUiService.stopLoading();
      if(this.uploadedData.length!=0){
        this.isDataPresent=true;
      }
      else{
        this.isDataPresent=false;
      }
      
    },(error:any)=>{
      this.messageService.add({summary:'Error in getting the uploaded Data',severity:'error',life:4000})
    })  
   }

   exportUploadedData(){
    
    if(this.uploadedData?.length>0){
      let brandObj=this.brands.find((obj:any)=>{return obj.brand_id==this.slForm.value.brand});
      let dealerObj=this.dealers.find((obj:any)=>{return obj.dealer_id==this.slForm.value.dealer});
      let locationobj=this.locations.find((obj:any)=>{
        return obj.location_id==this.slForm.value.location
      })
    const modifiedData = this.uploadedData.map((item: any) => ({
     
      Brand:brandObj?.brand,
      Dealer:dealerObj?.dealer_name,
      Location:locationobj?.location_name,
      ['Part Number']: item.partNumber , 
      ['Latest Part Number']:item.LatestPartNumber,
      Description:item.partDesc,
      Category:item.PartType,
      Rate:item.LandedCost,
      MRP:item.mrp,
      MOQ:item.moq,
      ['Part Nature']:item.partNature,
      Stock:item.Quantity,
      Date:this.formatDate(item.stockDate)

    }));
    const ws = XLSX.utils.json_to_sheet(modifiedData);
  
    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Uploaded Data');

    // Write the workbook to a file and trigger download
    XLSX.writeFile(wb, 'uploaded_data.xlsx');
  }
   }

   getLocations(){
       
    // this.globalBlockUiService.startLoading();
     this.utilitiesService.getLocations({dealer_id:localStorage.getItem('dealerid')}).subscribe((res:any)=>{
      if(res?.data?.error){
        // console.log("res ",res.data.error)
        this.globalBlockUiService.stopLoading();
        return this.messageService.add({severity:'error',life:4000,summary:'Error in fetching Locations!'})
      }
       this.locations=res.data;
       // console.log(this.brands)
     },(error:any)=>{
      this.globalBlockUiService.stopLoading();
     })
   }
 
   exportTableData(){
 
   // console.log("records",this.records)
    let brandObj=this.brands.find((obj:any)=> obj.brand_id==this.slForm.value.brand)
    let dealerObj=this.dealers.find((obj:any)=>obj.dealer_id==this.slForm.value.dealer)
      const modifiedData = this.records.map((item: any) => {
      
        return{
          ['Brand']:brandObj?.brand,
          ['Dealer']:dealerObj?.dealer_name,
          ['Location']: this.locationName,
          ['Previous Records']: item.prevRecordsCount !=null ?item.prevRecordsCount :0,
          ['Current Records']: item.currentRecordsCount !=null ?item.currentRecordsCount:0,
          ['Previous Sum Quantity']: item.prevSumQuantity !=null ?item.prevSumQuantity :0,
          ['Current Sum Quantity']: item.currentSumQuantity !=null ?item.currentSumQuantity:0 ,
          ['TOC Date ']: this.datePipe.transform(item.tocDate,'dd-MM-yyyy'),
          ['Added On ']: this.formatDate(item.added_on),
          ['Added By ']:item.addedBy
         
        }
        });
        const ws = XLSX.utils.json_to_sheet(modifiedData);
    
        // Create a workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
    
        // Write the workbook to a file and trigger download
        XLSX.writeFile(wb, 'exported_data.xlsx');
   }

   getAllRecords(){

    let locObj=this.locations.find((obj:any)=> obj.location_id==this.slForm.value.location)
    this.tocService.getRecords({locations:[{locationId:this.slForm.value.location}],dealer_id:this.slForm.value.dealer,brand_id:this.slForm.value.brand}).subscribe((res:any)=>{
      this.records=res.data;
      let brandObj=this.brands.find((obj:any)=> obj.brand_id==this.slForm.value.brand)
      let dealerObj=this.dealers.find((obj:any)=>obj.dealer_id==this.slForm.value.dealer)
      this.locationName=locObj?.location_name;
      this.addedOn=res.data.added_on;
      //console.log("brands ",brandObj,this.brands)
      
     this.records= this.records.map((item:any)=>{
      let userObj=this.users.find((obj:any)=>obj.userId==item.userId)
      this.addedBy=userObj?.vcFirstName+' '+userObj?.vcLastName
        return{
          ...item,
        brandName:brandObj?.brand,
        dealerName:dealerObj?.dealer_name,
        added_on: (item.addedOn),
        addedBy:this.addedBy,
        tocDate:item.tocDate,
        //  operationType:item?.operation_type=='Single Upload for Older Days'?'Older Days':'Current Days'
        }
      })
    })
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
