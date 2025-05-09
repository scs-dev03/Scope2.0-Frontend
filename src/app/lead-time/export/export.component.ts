import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { SharedModule } from '../../shared/shared.module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { ExportService } from '../../services/export.service';
import { MessageService } from 'primeng/api';
import { SharedServiceService } from '../../services/shared-service.service';
import { Router } from '@angular/router';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';

@Component({
  selector: 'app-export',
  imports: [SHARED_IMPORTS,SharedModule,PrimengModuleModule],
  providers:[MessageService],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {

  loading:boolean=false;
  brand:any;dealer:any;location:any;
  brands: any[] = [];
  locations: any[] = [];
  dealers: any[] = [];
  categories: any[] = [{name:'Spare Part'},{name:'Genuine Accessory'}];
  fileTypes: any[] = [{name:'Partwise OrderType'},{name:'Partwise Summary'},{name:'Overall Summary'},{name:'M1 Month'}];
  minDate: Date |undefined;
  maxDate: Date | undefined;
  currentDateTime:any;
  minDateString:any;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  maxDateString:any;
   receivedData:any=[];
    userPermissions:any=[];
    currentRoute:any;
    dataSubscription:Subscription|null=null
  exportForm: FormGroup = new FormGroup({
    brand: new FormControl('',[Validators.required]),
    dealer: new FormControl('',[]),
    location: new FormControl('',[]),
    category: new FormControl('',[Validators.required]),
    fromMonth: new FormControl('',[Validators.required]),
    toMonth: new FormControl('',[Validators.required]),
    fileType: new FormControl('',[Validators.required]),
  });
  constructor(private utilitiesService:UtilitiesService,
    private exportService:ExportService,
  private messageService:MessageService,
private sharedService:SharedServiceService,
private globalBlockUiService:GlobalBlockUiService,
private router:Router){

  this.currentRoute=router.url;
  }

  onStartDateChange(event: any) {
    if (event) {
      let selectedStartDate = new Date(event);
      
      // Set to the 1st day of the selected month
      selectedStartDate.setDate(1);
      
      // Ensure the start date is the 1st day of the month
      this.selectedStartDate = selectedStartDate;
      // console.log('Start Date:', this.selectedStartDate);
    }
  }

  // Adjust the selected month to the last day of that month (for end date)
  onEndDateChange(event: any) {
    if (event) {
      let selectedEndDate = new Date(event);
      
      // Move to the next month and then set to the last day of the selected month
      selectedEndDate.setMonth(selectedEndDate.getMonth() + 1);  // Move to next month
      selectedEndDate.setDate(0);  // Set to the last day of the previous month (selected month)

      // Ensure the end date is the last day of the selected month
      this.selectedEndDate = selectedEndDate;
     // console.log('End Date:', this.selectedEndDate);
    }
  }
   downloadExcel() {
    
    if(this.exportForm.valid){
     
      this.globalBlockUiService.startLoading();;
      const brandObj=this.brands.find((obj:any)=>{
        return obj.brand_id==this.exportForm.value.brand;
      })
      this.brand=brandObj?.brand;
      if(this.exportForm.value.dealer!=null){
        const dealerObj=this.dealers.find((obj:any)=>{
          return obj.dealer_id==this.exportForm.value.dealer;
        })
        this.dealer=dealerObj?.dealer_name;

      }
    if(this.exportForm.value.location){
      const locationObj=this.locations.find((obj:any)=>{
        return obj.location_id==this.exportForm.value.location;
      })
      this.location=locationObj.location_name
    }
      // console.log(this.selectedEndDate,this.selectedStartDate)
      if (this.selectedStartDate && this.selectedEndDate) {
        // Strip out the time part of the selectedStartDate and selectedEndDate by setting the time to 00:00:00
        const startDate = this.setStartDate(this.selectedStartDate); // Start of the month
      const endDate = this.setEndDate(this.selectedEndDate);  // End of the month
  
        // console.log("Start Date:", startDate);
        // console.log("End Date:", endDate);
        // console.log(startDate, endDate);
      
      
      let exportValue={
        fromMonth:startDate,
        toMonth:endDate,
        brand:this.exportForm.value.brand,
    dealer:this.exportForm.value.dealer ,
    location: this.exportForm.value.location,
    category: this.exportForm.value.category,
    fileType: this.exportForm.value.fileType,
      }
      this.exportService.exportExcel(exportValue).subscribe(async (response: any) => {
        // Create a URL for the blob
        // console.log(response)
        this.globalBlockUiService.stopLoading();;
        let fileName='Lead time Output_'+this.brand;
        if(this.dealer!=null){
          fileName+="_"+this.dealer+"_"
        }
        if(this.location!=null)
        {
          fileName+=this.location+'_';
        }
       fileName+=this.currentDateTime
      // Trigger the download for file1
     await this.downloadFile(response, fileName);  // Adjust the name as needed
      this.messageService.add({severity:'success',summary:'Lead Time Output File has been generated successfully',life:10000})
      this.globalBlockUiService.startLoading();;
      this.exportService.downloadLogs(exportValue).subscribe(async (res:any)=>{
        this.globalBlockUiService.stopLoading();
        if(res?.message){
        return  this.messageService.add({severity:'error',summary:'Data is empty so not able to generate file',life:3000000})
        }
        let fileName='Error_Logs_'+this.brand;
          if(this.dealer!=null){
            fileName+="_"+this.dealer+"_"
          }
          if(this.location!=null)
          {
            fileName+=this.location+'_';
          }
         fileName+=this.currentDateTime
         this.messageService.add({severity:'success',summary:'Error Logs File has been generated successfully',life:10000})
       await this.downloadFile(res, fileName);
        this.globalBlockUiService.stopLoading();;
       }
      //  , error => {
      //   this.globalBlockUiService.stopLoading();;
      //   this.messageService.add({ severity: 'error', summary: 'Error occured in processing excel file', life: 20000 });
      //   console.error('Error downloading files', error);
      // }
    )
      
    }, error => {
      this.globalBlockUiService.stopLoading();;
      this.messageService.add({ severity: 'error', summary: 'Base Data is not available for this Brand/Dealer', life: 20000 });
      console.error('Error downloading files', error);
    });
  }
    
    }
    else{
      Object.keys(this.exportForm.controls).forEach(controlName => {
        this.exportForm.get(controlName)?.markAsTouched();
      });
     // console.log('Form is invalid');
    }
  }
  async downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;  // Set the filename for the download
    a.click();
    window.URL.revokeObjectURL(url);  // Clean up after download

   
  }
  setStartDate(date: Date): string {
    const newDate = new Date(date);
    newDate.setDate(1);               // Set date to the 1st of the month
    newDate.setHours(0, 0, 0, 0);     // Set time to 00:00:00 (midnight)
    // Return the date in YYYY-MM-DD format (local time)
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1).toString().padStart(2, '0') + '-' + newDate.getDate().toString().padStart(2, '0');
  }
  
  // Utility function to set the end date to the last day of the month (local time)
  setEndDate(date: Date): string {
    const newDate = new Date(date);
    const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0); // Last day of the current month
    lastDay.setHours(23, 59, 59, 999);  // Set time to the last moment of the last day
    
    // Return the date in YYYY-MM-DD format (local time)
    return lastDay.getFullYear() + '-' + (lastDay.getMonth() + 1).toString().padStart(2, '0') + '-' + lastDay.getDate().toString().padStart(2, '0');
  }
  
  
  


  ngOnInit() {
    let today = new Date();
    this.maxDate = new Date(today);
this.maxDate.setMonth(today.getMonth() + 1);
this.maxDate.setDate(0); // Last day of the current month

// Set minDate to 15 months ago
this.minDate = new Date(today);
this.minDate.setMonth(today.getMonth() - 15);
this.minDate.setDate(1); // Set minDate to the first day of the month


const now = new Date();
    this.currentDateTime = now.toLocaleString();
//  console.log(this.currentDateTime)


// Optional: log the calculated dates for debugging
// console.log("Max Date (Last Day of Current Month):", this.maxDate);
// console.log("Min Date (Exactly 15 Months Ago, Inclusive):", this.minDate);

  

    // this.minDateString=this.minDate.toISOString().split('T')[0];
    //  this.maxDateString=this.maxDate.toISOString().split('T')[0];
    // console.log('Min Date: ', this.minDate.toISOString().split('T')[0]);
    // console.log('Max Date: ', this.maxDate.toISOString().split('T')[0]);
    this.getBrands(); 
    this.dataSubscription = this.sharedService.sidebarData.subscribe(
      (data) => {
        this.receivedData = data;
       // console.log('Data received in User:', this.receivedData);
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
  }

   formatDate(date:any) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-indexed
    let year = date.getFullYear();
  
    // Pad single digit day or month with a leading zero
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

 
   getBrands(){   
     this.utilitiesService.getBrands().subscribe((res:any)=>{
       this.brands=res.data;
       
     })
     
   }
  
   getDealers(event:any){
     let brand_id=this.exportForm.value.brand;
     
     this.utilitiesService.getDealers({brand_id:brand_id}).subscribe((res:any)=>{
       this.dealers=res.data;
     })
 

   }
 
   getLocations(event:any){
     this.utilitiesService.getLocations({brand_id:this.exportForm.value.dealer,dealer_id:this.exportForm.value.dealer}).subscribe((res:any)=>{
       this.locations=res.data;
     })
   }
  
}
