import { Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UtilitiesService } from '../../services/utilities.service';
import { UploadService } from '../../services/upload.service';
import { ExportService } from '../../services/export.service';
import { UserService } from '../../services/user.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { MappingMasterService } from '../../services/mapping-master.service';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { brandColumnObject } from '../../core/models/brandColumns';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SidebarService } from '../../services/sidebar.service';
@Component({
  selector: 'app-upload',
  imports: [SHARED_IMPORTS,PrimengModuleModule,SharedModule],

  providers:[DatePipe,MessageService],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  isFileUploaded:boolean=false;
  updatedLogs:any= [];
 isMappedColumnPresent:boolean=false;
 isScreenCollapsed:boolean=false;
 fileNames:any=[];
  brands:any;
  formData:any;
  dealers:any;
  locations:any;
  fileName:any;
  brand:any;
  dealer:any;
  location:any;
  users:any;
  updatedDate:any;
  fetchData:any;
  isLocationWiseChecked:any;
  fileTypes:any[]=[];
  lastResponse:any=[];
  uploadLogs:any;
 // ref: DynamicDialogRef | undefined;
  showMapping:boolean=false;
  showTable:boolean=false;
  showDownloadFormat:boolean=true;
  uploadedDetails:any=[]
  uploadedData:any;
  uploadedFiles:any;
  excelCount:any;
  userId:any;
  formDataPO:any;
  updatedBy:any;
  updatedAuditLogs:any=[];
  isLoading:boolean=false;
  isSearchButton:boolean=false;
  locationFormGroup:FormGroup;
  insertedId:any;
  userName:any;
  receivedData:any=[];
  userPermissions:any=[];
  currentRoute:any;
  dataSubscription:Subscription|null=null
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  sidebarVisible:boolean=false;
  uploadForm: FormGroup = new FormGroup({

    brand: new FormControl('',[Validators.required]),
    dealer: new FormControl('',[Validators.required]),
    location: new FormControl('',[Validators.required]),
    // fileType:new FormControl('',[]),


  })

  
  constructor(private utilitiesService:UtilitiesService,
     private mappingService:MappingMasterService,
   // ,
   // public dialogService: DialogService,
     public messageService: MessageService,
    private uploadService:UploadService,private fb:FormBuilder,
    private exportService:ExportService,
    private userService:UserService,
    private datePipe: DatePipe,
    private sharedService:SharedServiceService,
    private router:Router,
    private globalBlockUiService:GlobalBlockUiService,
    private sidebarService:SidebarService

  ){
    this.locationFormGroup=this.fb.group({

      brand:['',[Validators.required]],
      // fileType:['',[Validators.required]]
    })
    this.currentRoute=this.router.url;
    //console.log(this.currentRoute)
  }

  ngOnInit(){
     this.sharedService.updateModuleName('Lead Time Upload')
   this.getBrands(); 
   this.getUsers();
   this.userName=localStorage.getItem('name');
   
   this.sidebarService.visibleSidebar$.subscribe((visible:any)=>{
    this.sidebarVisible=visible
   })
//    this.dataSubscription = this.sharedService.sidebarData.subscribe(
//     (data) => {
//       this.receivedData = data;
//      // console.log('Data received in User:', this.receivedData);
//       if(this.receivedData.length!=null){

//         for(let item of this.receivedData){
//           const moduleItem = item?.subchildren.find((child:any) => child.module_route === this.currentRoute);

// if (moduleItem) {
//   // Extract values if module is found
//   this.userPermissions = {
//     view1: moduleItem.view1,
//     add1: moduleItem.add1,
//     delete1: moduleItem.delete1,
//     edit1: moduleItem.edit1
//   };
 
// }
//         }
//       }
//     // console.log("result",this.userPermissions)
     
//     }
//   );
  }
  onBrandSelect(brand: string): void {
    this.fileTypes=[]
    this.getFileType({brand_id:brand});
    this.isFileUploaded=false;
    this.fileNames=[]
      this.showDownloadFormat=false;
    this.showTable=false;
    this.formData=new FormData();
    // if(!this.isLocationWiseChecked){
    //   this.downloadExcel(this.locationFormGroup.value)
    // }
    // else{
    //   this.downloadExcel(this.uploadForm.value)
    // }
    this.uploadForm.get('fileType')?.patchValue(2);
  }
  
  getBrands(){
    let brand_id=this.locationFormGroup.value.brand;
    this.utilitiesService.getBrands().subscribe((res:any)=>{
      this.brands=res.data;
      
    })
    
  }

  getDealers(event:any){
    let brand_id=this.uploadForm.value.brand;
    // this.getFileType({brand_id:brand_id});
    this.utilitiesService.getDealers({brand_id:brand_id}).subscribe((res:any)=>{
      this.dealers=res.data;
    })
    this.getFileType({brand_id:this.uploadForm.value.brand})
    // this.fetchMappedColumns({brand_id:brand_id,fileTypeId:this.uploadForm.value.fileType})
  }

  getLocations(event:any){
    this.utilitiesService.getLocations({brand_id:this.uploadForm.value.brand,dealer_id:this.uploadForm.value.dealer}).subscribe((res:any)=>{
      this.locations=res.data;
    })
   
  }

  onCheckboxChange(event: any): void {
    if (this.isLocationWiseChecked) {
      // Reset the table or clear its data
     this.uploadLogs=[]  // Clearing the table
     this.showTable=false;
     this.isSearchButton=false;
     this.updatedAuditLogs=[]
     this.showMapping=false;
     this.isFileUploaded=false;
     this.fileTypes=[];
     this.fileNames=[];
     this.uploadedFiles=[];
     this.showDownloadFormat=true;
     this.uploadForm.reset();
     //this.locationFormGroup.reset();

    } if(!this.isLocationWiseChecked){
      this.showTable=false;
      this.uploadLogs=[];
      this.updatedAuditLogs=[]
      this.showTable=false;
      this.isSearchButton=false;
      this.isFileUploaded=false;
      this.showMapping=false;
      this.fileTypes=[];
      this.fileNames=[];
      this.uploadedFiles=[];
      this.showDownloadFormat=true;
      this.locationFormGroup.reset();
     // this.uploadForm.reset();
    }
    }
//   onUpload(event: any) {
//     this.fileUpload.clear();
//     // console.log("files ",event);
//     const file=event.currentFiles[0]
//     this.fileName=file.name;
//      this.formData = new FormData();
//     this.formData.append('excelFile', file, this.fileName);
//     console.log(this.formData)
//     this.isFileUploaded=true;
//     // console.log(formData)
//     // this.uploadFile(formData)
//     // this.submit(formData)
// }

onUpload(event: any, fileType: any, index: number) {
  // Clear the previous file upload instance
  this.fileName=''
  //this.formData=new FormData();
  // console.log("index ",index)
  this.updatedAuditLogs=[];
  this.fileUpload.clear();

  // Get the uploaded file
  const file = event.currentFiles[0];
  this.fileName = file.name;
  
  // Create a new FormData object for each file type upload
 let formData = new FormData();
  formData.append('excelFile', file, this.fileName);

  // // Optionally, associate the uploaded file with the file type
  if (!this.uploadedFiles) {
      this.uploadedFiles = [];
  }
  

  this.uploadedFiles.length=this.fileTypes.length
  this.uploadedFiles[index] = {
      fileTypeId:fileType.id,
      fileType: fileType.fileType,
      file: formData,
      fileName:this.fileName
  };


  this.uploadedFiles.forEach((item:any, index:any) => {
    this.fileNames[index]=item.fileName;
    
  });

  // console.log("the uploaded files ",this.uploadedFiles)
  if(this.fileTypes.length !=this.uploadedFiles.length){
    // console.log("size not equal for uploaded file and file types ",this.fileTypes.length ,this.uploadedFiles.length)
   this.isFileUploaded=false;
 }
 else{
   this.isFileUploaded=true;
 }
  let validFiles = this.uploadedFiles.filter((file: any) => file && file.fileName && file.fileTypeId);
  //  console.log("valid ",validFiles)
  if(validFiles.length!=this.fileTypes.length){
    this.isFileUploaded=false;
    validFiles=[];
    // return this.messageService.add({severity:'error',detail:'You have not selected all the files ',life:10000});

  }
}


async uploadFile(data:any){

  let fileTypeObj: { fileType: any; fileTypeId: any; };
this.globalBlockUiService.startLoading();

  this.userId=localStorage.getItem('userid');
  let logs;
  let responses:any=[];
  
  let responses1:any=[];
  //  for( let item of this.uploadedFiles){
  //   this.formData=new FormData();
  //   this.fileUpload.clear();
  //  }
    for(let item of this.uploadedFiles){
    this.formData=item.file;
    fileTypeObj=item;

    // console.log("item ",fileTypeObj)
    try{

      const response= await this.mappingService.uploadFile(this.formData).toPromise();
      responses1.push({...response,item});
    }
    catch(error:any){
      this.globalBlockUiService.stopLoading();;
      // responses1.push({error:true})
      this.formData=new FormData();
      this.fileUpload.clear();
      this.fileNames=[];
      this.showTable=false;
      this.uploadedFiles=[];
      
      return this.messageService.add({severity:'error',summary:`Error in processing the file for ${item.fileType}`,life:100000})
    }
    // console.log("response 1",responses1,responses1[0]?.data,responses1[1]?.data)
  }
  //console.log(responses1)
    responses1.forEach(async (item:any, index:any) => {
      this.isFileUploaded=false
      this.uploadedData=item.data1
      this.excelCount=item.data1.length
      // console.log("this.ex" ,this.excelCount)
      this.globalBlockUiService.startLoading();;
      if(!this.isLocationWiseChecked){
        // console.log("jsfhd",fileTypeObj)
     logs=  await this.uploadData({brand_id:this.locationFormGroup.value.brand,filePath:item.filePath,mappedData:this.fetchData,fileType:item.item.fileType,fileTypeId:item.item.fileTypeId,rowCount:this.excelCount,userId:this.userId},item.item,responses,this.uploadedFiles)
        this.formData = new FormData();
        this.fileNames=[];
        this.fileUpload.clear();
        this.uploadedFiles=[];
      }else{
        // console.log("jsfhd upload",fileTypeObj)
      logs=await  this.uploadData({brand_id:this.uploadForm.value.brand,dealer_id:this.uploadForm.value.dealer,location:this.uploadForm.value.location,filePath:item.filePath,fileType:item.item.fileType,fileTypeId:item.item.fileTypeId,rowCount:this.excelCount,userId:this.userId},item.item,responses,this.uploadedFiles)
        this.formData = new FormData();
        this.fileUpload.clear();
        this.fileNames=[];
        this.uploadedFiles=[];
      }
    })

  
    //   this.mappingService.uploadFile(this.formData).subscribe(async (res:any)=>{
       
       
    //   },
    // (error)=>{
    //   this.messageService.add({severity:'error',summary:`Error in processing the file for  ${fileTypeObj.fileType}`,life:100000})
    // })
    
    // console.log("upload logs ",logs)
  
}
  


// show() {

//   // console.log('Form Submitted:', this.uploadForm.value);

//   this.ref = this.dialogService.open(MappingComponent, {
     
//         header: 'View Column Mapping',
//         width: '50vw',
//         contentStyle: { overflow: 'auto' },
//         breakpoints: {
//             '960px': '75vw',
//             '640px': '90vw'
//         },
//         data: {
//           data:this.fetchData,
//         brands:this.brands,
//         }
    
//     });
// }

 async fetchMappedColumns(data:any){
//  await this.mappingService.fetchData(data).subscribe((res:any)=>{
//     this.showMapping=true;
//     this.fetchData=res.data;
    // if(this.fetchData.length!=0){
    //   this.isMappedColumnPresent=true
      // this.fetchData.forEach((item:any) => {
      //   const file = this.fileTypes.find(fileType => fileType.id === item.file_type);
      //    item.fileTypeName = file ? file.fileType : 'Unknown File';

        
      //   // console.log(`File ID: ${item.file_type}, File Name: ${fileName}`);
      // });
      this.globalBlockUiService.startLoading();;
     
      this.uploadFile(this.formData)
      
    // }
    // else{
    //   this.globalBlockUiService.stopLoading();
    //   this.messageService.add({severity:'error',summary:'Column mapping is not available for this brand and file type',life:3000})
    // }
 
  //})
}

  async getMappedColumns(data:any){
    this.globalBlockUiService.startLoading();;
  let brandId=data.brand;
  let fileTypeId=data.fileType;
  // this.getFileType({brand_id:brandId});
 await this.fetchMappedColumns({brand_id:brandId,fileTypeId:fileTypeId})
}

search(){
  
    // this.showTable=true;
    // this.isScreenCollapsed=true;
}

  // async submit(){
  
  //   this.globalBlockUiService.startLoading();;
  // // console.log("is checked ",this.isLocationWiseChecked);
  // this.isSearchButton=false;
  // this.showTable=false;
  // this.updatedLogs=[];
  // if(!this.isLocationWiseChecked){
  //   if(this.locationFormGroup.valid){
  //      await this.getMappedColumns(this.locationFormGroup.value)
      
  //         // this.uploadService.getUploadedDetails({...this.locationFormGroup.value,mappedData:this.fetchData}).subscribe((res:any)=>{
  //         //   this.uploadedDetails=res.data
            
  //           const brandObj=this.brands.find((obj:any)=>{
  //             return obj.brand_id==this.locationFormGroup.value.brand;
  //           })
  //           this.brand=brandObj.brand;
  //           this.globalBlockUiService.startLoading();;
  //         setTimeout(()=>{
  //           this.uploadService.uploadLogs({...this.locationFormGroup.value,userId:this.userId}).subscribe({
  //           next:(res: any) => {
  //             this.isScreenCollapsed=true
  //             this.isSearchButton=true;
  //             this.uploadLogs = res.data;
  //             this.uploadLogs.forEach((item: any) => {
  //               this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
  //               console.log("updated ", this.updatedDate);
  //               let user = this.users.find((obj: any) => { return obj.userId == item.userID; });
  //               this.updatedBy = user.name;
  //               this.updatedLogs.push({
  //                 ...item,
  //                 updatedDate: this.updatedDate,
  //                 updatedBy: this.updatedBy,
  //                 // Keep the original log data too, if needed
  //               });
  //               this.isSearchButton = true;
  //               this.showTable=true;
  //               this.globalBlockUiService.stopLoading();;
  //               this.formData = new FormData();
  //             });
             
  //             // this.locationFormGroup.reset()
  //           },
  //           error:(error:any)=>{
  //             this.globalBlockUiService.stopLoading();;
  //           }
  //         })

  //          },9000)
          
  //   }
  //   else{
  //     this.globalBlockUiService.stopLoading();;
  //     Object.keys(this.locationFormGroup.controls).forEach(controlName => {
  //       this.locationFormGroup.get(controlName)?.markAsTouched();
  //     });
  //     this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
  //     console.log('Form is invalid');
  //   }
  // }
  // if(this.isLocationWiseChecked){

  //   if(this.uploadForm.valid){
  //      await this.getMappedColumns(this.uploadForm.value)
  //     // this.uploadFile(this.formData)
     
  //         const brandObj=this.brands.find((obj:any)=>{
  //           return obj.brand_id==this.uploadForm.value.brand;
  //         })
  //         this.brand=brandObj.brand;
    
  //         const dealerObj=this.dealers.find((obj:any)=>{
  //           return obj.dealer_id==this.uploadForm.value.dealer;
  //         })
  //         this.dealer=dealerObj.dealer_name;
    
  //         const locationObj=this.locations.find((obj:any)=>{
  //           return obj.Location_id==this.uploadForm.value.location;
  //         })
  //         this.location=locationObj.Location_name
  //         // Creating an array to store the mapping for each log entry
  //         this.globalBlockUiService.startLoading();;
  //          setTimeout(()=>{
  //            this.uploadService.uploadLogs({...this.uploadForm.value,userId:this.userId}).subscribe({
  //            next:(res:any)=>{
  //             this.isScreenCollapsed=true
  //             this.isSearchButton=true;
  //              this.uploadLogs=res.data;
  //              this.uploadLogs.forEach((item:any)=>{
  //                const dateObj = item.dateTime
       
  //                this.updatedDate = this.datePipe.transform(item.dateTime, 'yyyy-MM-dd')!;
  //                console.log("updated ",this.updatedDate)
  //                let user=this.users.find((obj:any)=>{return obj.userId==item.userID})
  //                this.updatedBy=user.name;
  //                this.updatedLogs.push({
  //                  ...item ,
  //                  updatedDate: this.updatedDate,
  //                  updatedBy: this.updatedBy,
  //                  // Keep the original log data too, if needed
  //              });
  //              })
  //              this.showTable=true;
  //             //  this.uploadForm.reset();
  //             this.globalBlockUiService.stopLoading();;
  //              this.formData = new FormData();
  //            },
  //           error:(erro:any)=>{
  //             this.globalBlockUiService.stopLoading();;
  //           }})

  //          },9000)
          
          
        
        
      
  //     // this.uploadService.getUploadedDetails({...this.uploadForm.value,mappedData:this.fetchData}).subscribe((res:any)=>{
  //     //   this.uploadedDetails=res.data
  //     //   // this.formData = new FormData();
  //     // })
      
     
  //   }
  //   else{
  //     this.globalBlockUiService.stopLoading();;
  //     Object.keys(this.uploadForm.controls).forEach(controlName => {
  //       this.uploadForm.get(controlName)?.markAsTouched();
  //     });
  //     this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
  //     console.log('Form is invalid');
  //   }
  // }

  // }

  async submit(){
    console.log("called this method")
   this.fileNames=[];
    this.globalBlockUiService.startLoading();;
    this.updatedAuditLogs=[];
    if(!this.isLocationWiseChecked){
      if(this.locationFormGroup.valid){
          this.globalBlockUiService.startLoading();;
          this.updatedAuditLogs=[];
          await this.uploadFile(this.formData)        
          // this.uploadedFiles=[];
          this.fileNames=[];
         
            //  this.fileTypes=[];  
        }
        else{
              this.globalBlockUiService.stopLoading();;
              Object.keys(this.locationFormGroup.controls).forEach(controlName => {
                this.locationFormGroup.get(controlName)?.markAsTouched();
              });
              // this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
             // console.log('Form is invalid');
            }
      }
        else{
          console.log("called this method")
          if(this.uploadForm.valid){
                      this.globalBlockUiService.startLoading();;   
                      this.updatedAuditLogs=[];
           let logs= await this.uploadFile(this.formData) 
           this.fileNames=[];
          //  this.uploadedFiles=[];
            // this.fileTypes=[];      

               
    }
    else{
      this.globalBlockUiService.stopLoading();;
          Object.keys(this.uploadForm.controls).forEach(controlName => {
            this.uploadForm.get(controlName)?.markAsTouched();
          });
          // this.messageService.add({severity:'error',summary:'Kindly fill all the information.',life:3000})
          // console.log('Form is invalid');
    }
  }
        
  }


  downloadExcel(){
   
    if(this.isLocationWiseChecked){
      this.uploadService.downloadBrandFormat({brand_id:this.uploadForm.value.brand}).subscribe((blob)=>{
        //this.showDownloadFormat=true;
        const brandObj=this.brands.find((obj:any)=> {return obj.brand_id==this.uploadForm.value.brand});
    let brandName=brandObj.brand;
        saveAs(blob, `${brandName}_Format.zip`);
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();;
        this.messageService.add({severity:'error',summary:'Format is not available for this brand',life:300000})
      })

    }
    else{
      this.uploadService.downloadBrandFormat({brand_id:this.locationFormGroup.value.brand}).subscribe((blob)=>{
        //this.showDownloadFormat=true;
        const brandObj=this.brands.find((obj:any)=> {return obj.brand_id==this.locationFormGroup.value.brand});
    let brandName=brandObj.brand;
        saveAs(blob, `${brandName}_Format.zip`);
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();;
        this.messageService.add({severity:'error',summary:'Format is not available for this brand',life:300000})
      })
    }
  }
  downloadWorkShopList(){
  this.globalBlockUiService.startLoading();;
  // console.log("download ")
  let data ;
  let fileObj;
  let brandName='';
  // this.utilitiesService.exportFile(data)
  if(!this.isLocationWiseChecked){
    // data=this.fetchData;
   
    let id=this.locationFormGroup.value.brand;
    data=brandColumnObject[id];
    // console.log(data);

      const brandObj=this.brands.find((obj:any)=> {return obj.brand_id==id});
       brandName=brandObj.brand;
    
   
  }
  else{

  }
  // console.log("fetch data ",this.fetchData);
  
  this.exportService.downloadFormat({data:data,brand_id:this.locationFormGroup.value.brand}).subscribe((response:Blob)=>{
    const url = window.URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = brandName+' Workshop_List.xlsx';
    // a.download = 'multi_sheets'; // Set the name of the downloaded file
    a.click();
    window.URL.revokeObjectURL(url);
    this.globalBlockUiService.stopLoading();;
  },(error:any)=>{
    this.globalBlockUiService.stopLoading();;
    // this.messageService.add({severity:'error',summary:'Erro'})
  });
}
 async uploadData(data:any,fileTypeObj:any,responses:any,uploadedFiles:any){
   try{
      this.globalBlockUiService.startLoading();;
      const response= await this.uploadService.uploadData(data).toPromise();
      responses.push(response)
  
      if (responses.length === 2) {
        await this.handleMultipleApiResponses(responses,fileTypeObj);
      }
     
    else if(responses.length==1 && uploadedFiles.length==1){
       await this.handleUploadLogsForSingleFile(responses[0])
      }

    }
    catch(error){
      this.globalBlockUiService.stopLoading();;
      this.messageService.add({severity:'error',life:3000000,summary:'Error in Uploading File..'});
    }
   
  }

  async  handleMultipleApiResponses(responses: any[],fileTypeObj:any) {
    try {
      // Extract responses from the array
      // console.log("responses",responses)
      const firstResponse = responses[0];
      const secondResponse = responses[1];
    const noResponse=[{
      data:{
        insertedId:0
      }
    }];
    //console.log(firstResponse,secondResponse,fileTypeObj)
     // Check conditions based on the first and second response
      if (firstResponse?.data?.insertResponse?.poFailed === true && secondResponse?.data?.insertResponse==false) {
        // console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for PO`, life: 100000});
        await this.handleUploadLogs(secondResponse,true);
      }
      if (secondResponse?.data?.insertResponse?.poFailed === true && firstResponse?.data?.insertResponse==false) {
        //console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for PO`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if (secondResponse?.data?.insertResponse?.poFailed === true && firstResponse?.data?.insertResponse==true) {
        //console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for PO`, life: 100000});
        this.messageService.add({severity: 'error', summary: `Part Number,Dealer and Location cannot be Blank for MRN`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if (firstResponse?.data?.insertResponse?.poFailed === true && secondResponse?.data?.insertResponse==true) {
        //console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for PO`, life: 100000});
        this.messageService.add({severity: 'error', summary: `Part Number,Dealer and Location cannot be Blank for MRN`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if (secondResponse?.data?.insertResponse?.mrnFailed === true && firstResponse?.data?.insertResponse==true) {
        //console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for MRN`, life: 100000});
        this.messageService.add({severity: 'error', summary: `Part Number,Dealer and Location cannot be Blank for PO`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if (firstResponse?.data?.insertResponse?.mrnFailed === true && secondResponse?.data?.insertResponse==true) {
        //console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for MRN`, life: 100000});
        this.messageService.add({severity: 'error', summary: `Part Number,Dealer and Location cannot be Blank for PO`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if (firstResponse?.data?.insertResponse.mrnFailed === true && secondResponse?.data?.insertResponse==false) {
       // console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for MRN`, life: 100000});
        await this.handleUploadLogs(secondResponse,true);
      }
      if (secondResponse?.data?.insertResponse?.mrnFailed === true && firstResponse?.data?.insertResponse==false) {
      //  console.log("First API - PO Failed", firstResponse);
        this.messageService.add({severity: 'error', summary: `Part Number cannot be found for MRN`, life: 100000});
        await this.handleUploadLogs(firstResponse,true);
      }
      if(firstResponse?.data?.insertResponse?.poFailed==true && secondResponse?.data?.insertResponse?.mrnFailed==true){
       // console.log("happens")
        this.messageService.add({severity: 'error', summary: 'Part Number cannot be found for PO', life: 100000});
        this.messageService.add({severity: 'error', summary: 'Part Number cannot be found for MRN', life: 100000});
        await this.handleUploadLogs(noResponse,false);
      }
      if(firstResponse?.data?.insertResponse?.mrnFailed==true && secondResponse.data?.insertResponse?.poFailed==true){
        //console.log("happens")
        this.messageService.add({severity: 'error', summary: 'Part Number cannot be found for PO', life: 100000});
        this.messageService.add({severity: 'error', summary: 'Part Number cannot be found for MRN', life: 100000});
        await this.handleUploadLogs(noResponse,false);
      }

      if(firstResponse?.data?.insertResponse==false && secondResponse.data?.insertResponse==true){
        this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for ${fileTypeObj?.fileType}`, life: 100000 });
        await this.handleUploadLogs(firstResponse,true);
      }
      if(firstResponse?.data?.insertResponse==true && secondResponse.data?.insertResponse==false){
        this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for ${fileTypeObj.fileType}`, life: 100000 });
        await this.handleUploadLogs(secondResponse,true);
      }
      if(firstResponse?.data?.insertResponse==true && secondResponse?.data?.insertResponse==true){
        this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for PO`, life: 100000 });
        this.messageService.add({ severity: 'error', summary:`Part No ,Dealer and Location cannot be blank for MRN`, life: 100000 });
        await this.handleUploadLogs(noResponse,true);
      }
      if(firstResponse.data?.insertResponse==false && secondResponse?.data?.insertResponse==false){
        this.messageService.add({ severity: 'success', summary:`Your data has been successfully uploaded`, life: 10000 });
       
        await this.handleUploadLogs(noResponse,false);
      }
     
  
      // Final action after processing both responses
      this.resetForm();
  
    } catch (error) {
      console.error('Error processing API responses:', error);
   this.globalBlockUiService.stopLoading();
    }
  }
  async handleUploadLogsForSingleFile(response:any){
    try {
      // Delete previously uploaded data if necessary
      // console.log("resoponse ",response)
      if(response.data?.insertResponse?.poFailed==true){
        this.messageService.add({ severity: 'error', summary:`Part Number cannot be found`, life: 1000000 });
      }
      if(response?.data?.insertResponse==true){
        this.messageService.add({ severity: 'error', summary:`Part Number,Dealer and Location cannot be blank`, life: 1000000 });
      }
      if(response?.data?.insertResponse==false){
        this.messageService.add({ severity: 'success', summary:`Your data has been successfully uploaded`, life: 10000 });
      }

      let uploadLogsResponse;
          console.log("isLocationwise checked ",this.isLocationWiseChecked)
            if(this.isLocationWiseChecked){
              const brandObj=this.brands.find((obj:any)=>{
                return obj.brand_id==this.uploadForm.value.brand;
              })
              this.brand=brandObj.brand;
              const dealerObj=this.dealers.find((obj:any)=>{
                return obj.dealer_id==this.uploadForm.value.dealer;
              })
              this.dealer=dealerObj.dealer_name;
        
              const locationObj=this.locations.find((obj:any)=>{
                return obj.location_id==this.uploadForm.value.location;
              })
              this.location=locationObj.location_name
              uploadLogsResponse = await this.uploadService.uploadLogs({
                brand: this.uploadForm.value.brand,
                dealer: this.uploadForm.value.dealer,
                location: this.uploadForm.value.location,
               
                userId: this.userId
              }).toPromise();
            }   
            else{        
              const brandObj=this.brands.find((obj:any)=>{
                return obj.brand_id==this.locationFormGroup.value.brand;
              })
              this.brand=brandObj.brand;
              uploadLogsResponse = await this.uploadService.uploadLogs({
                brand: this.locationFormGroup.value.brand,
                userId: this.userId
              }).toPromise();
            }      
               // After deleting data, log the upload logs
      // fileType: response.fileType,
      // Update UI with the logs response
      this.isScreenCollapsed = true;
      this.isSearchButton = true;
      this.showTable = true;
      this.uploadLogs = uploadLogsResponse.data;
      // this.updatedAuditLogs = [];           
     this.uploadLogs.forEach((item:any) => {
      let fileTypeObj=this.fileTypes.find((obj:any)=>{
        // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
      return obj.id==item?.fileTypeID;
     })
        let formattedDate = this.formatDateTime(item.dateTime);
        this.updatedAuditLogs.push({
          ...item,
          updatedDate: formattedDate,
          updatedBy: this.getUserNameById(item.userID),
          fileType:fileTypeObj?.fileType
        });
      });
  // console.log("updated audit logs ",this.updatedAuditLogs)
  
   this.globalBlockUiService.stopLoading();
      this.uploadedFiles=[];
      this.fileNames=[];
      this.formData = new FormData();
  
    } catch (error) {
   this.globalBlockUiService.stopLoading();
      console.error('Error during log handling:', error);
    }
  }
  async handleUploadLogs(response: any,isDeleted:any) {
    try {
      // Delete previously uploaded data if necessary
      // console.log("resoponse ",response)
      
      let uploadLogsResponse;

           
            if(this.isLocationWiseChecked){
              if(isDeleted){
                const deleteDataResponse = await this.uploadService.deleteUploadedData({
                  brand_id: this.uploadForm.value.brand,
                  userId: this.userId,
                  insertedId: response?.data?.insertedId
                }).toPromise();
              }
             
        
              const brandObj=this.brands.find((obj:any)=>{
                return obj.brand_id==this.uploadForm.value.brand;
              })

              this.brand=brandObj.brand;
              const dealerObj=this.dealers.find((obj:any)=>{
                return obj.dealer_id==this.uploadForm.value.dealer;
              })

              this.dealer=dealerObj.dealer_name;
        
              const locationObj=this.locations.find((obj:any)=>{
                return obj.location_id==this.uploadForm.value.location;
              })

              this.location=locationObj.location_name;
           //   console.log("location at 902 ",this.location,locationObj)
              uploadLogsResponse = await this.uploadService.uploadLogs({
                brand: this.uploadForm.value.brand,
                dealer: this.uploadForm.value.dealer,
                location: this.uploadForm.value.location,
               
                userId: this.userId
              }).toPromise();
              for(let item of this.uploadedFiles){
                this.uploadedFiles=[];
                this.fileNames=[];
                this.formData=new FormData;
              }
             
            }   
            else{
              if(isDeleted){
              const deleteDataResponse = await this.uploadService.deleteUploadedData({
                brand_id: this.locationFormGroup.value.brand,
                userId: this.userId,
                insertedId: response?.data?.insertedId
              }).toPromise();
            }
              const brandObj=this.brands.find((obj:any)=>{
                return obj.brand_id==this.locationFormGroup.value.brand;
              })
              this.brand=brandObj.brand;
              uploadLogsResponse = await this.uploadService.uploadLogs({
                brand: this.locationFormGroup.value.brand,
                userId: this.userId
              }).toPromise();
              for(let item of this.uploadedFiles){
                this.uploadedFiles=[];
                this.fileNames=[];
                this.formData=new FormData;
              }
            }      
               // After deleting data, log the upload logs
      // fileType: response.fileType,
      // Update UI with the logs response
      this.isScreenCollapsed = true;
      this.isSearchButton = true;
      this.showTable = true;
      this.uploadLogs = uploadLogsResponse.data;
      // this.updatedAuditLogs = [];           
     this.uploadLogs.forEach((item:any) => {
      let fileTypeObj=this.fileTypes.find((obj:any)=>{
        // console.log("id ",obj.id,this.locationFormGroup.value.fileType)
      return obj.id==item?.fileTypeID;
     })
        let formattedDate = this.formatDateTime(item.dateTime);
        this.updatedAuditLogs.push({
          ...item,
          updatedDate: formattedDate,
          updatedBy: this.getUserNameById(item.userID),
          fileType:fileTypeObj?.fileType
        });
      });
      this.uploadedFiles=[];
  // console.log("updated audit logs ",this.updatedAuditLogs)
  
   this.globalBlockUiService.stopLoading();
      
      this.formData = new FormData();
      this.fileUpload.clear();
      this.fileNames=[];
    } catch (error) {
   this.globalBlockUiService.stopLoading();
      this.formData = new FormData();
      this.fileUpload.clear();
      console.error('Error during log handling:', error);
    }
  }

  getRowClass(fileLength:any) {
    if(fileLength<this.fileTypes.length){
      return 'latest-rows'
    }
    return 'previous-rows'
  }
  
  resetForm() {
    this.formData = new FormData();
 this.globalBlockUiService.stopLoading();
    // this.showTable = false;
  }
  formatDateTime(dateTime: string) {
    let date = dateTime.split("T")[0];
    let time = dateTime.split("T")[1].split("Z")[0];
    let [hours, minutes] = time.split(":");
    return `${date} ${hours}:${minutes}`;
  }
  
  getUserNameById(userId: string) {
    // console.log("users ",this.users)
    const user = this.users.find((u:any) => {return u.userId == userId});
    // console.log("user",user)
    return user ? (user.vcFirstName+' '+user.vcLastName) : 'Unknown';
  }
downloadExcelFile(data?:any){
  const sheet1:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[0]);
  const sheet2:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[1]);
  const sheet3:XLSX.WorkSheet = XLSX.utils.json_to_sheet(data[2]);
  // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet1, 'Dealer & Location');
  XLSX.utils.book_append_sheet(wb, sheet2, 'Part not in Master');
  XLSX.utils.book_append_sheet(wb, sheet3, 'Rows Deleted');
  XLSX.writeFile(wb, 'logs_file.xlsx');
}

getFileType(brandId:any){
  this.utilitiesService.getFileType(brandId).subscribe((res:any)=>{
    this.fileTypes=res.data
  })
}

getUsers(){
  this.userService.getUsers().subscribe((data:any)=>{
    this.users=data.data
  })
}

collapseScreen(){
  this.isScreenCollapsed=!this.isScreenCollapsed
}
}
