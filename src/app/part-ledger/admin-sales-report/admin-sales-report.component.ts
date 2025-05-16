import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import * as XLSX from 'xlsx';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminReportServiceService } from '../../services/part-ledger/admin-report-service.service';
import { ProductDesctiptionTableComponent } from "../product-desctiption-table/product-desctiption-table.component";
import { ProductSaleInfoComponent } from "../product-sale-info/product-sale-info.component";
import { TotalsumComponent } from "../totalsum/totalsum.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { CommonModule } from '@angular/common';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';
@Component({
  selector: 'app-admin-sales-report',
  imports: [PrimengModuleModule, SharedModule,SHARED_IMPORTS,CommonModule, ProductDesctiptionTableComponent, ProductSaleInfoComponent, TotalsumComponent, LoaderComponent],
  templateUrl: './admin-sales-report.component.html',
  styleUrl: './admin-sales-report.component.css'
})
export class AdminSalesReportComponent {
  minDate: Date | undefined;
  maxDate: Date | undefined;
  ngOnInit(){
    this.DataType = [
      { "id": 0, "name": "WorkshopSale" },
      { "id": 1, "name": "Counter" },
      { "id": 2, "name": "StockTransferOut" },
      { "id": 3, "name": "AdjustmentOut" },
      { "id": 4, "name": "PaidSale" },
      { "id": 5, "name": "WarrantySale" },
      { "id": 6, "name": "FOCSales" },
      { "id": 7, "name": "GoodwillSale" },
      { "id": 8, "name": "NormalPurchase" },
      { "id": 9, "name": "StockTransferIn" },
      { "id": 10, "name": "JobcardReturnValue" },
      { "id": 11, "name": "CounterSaleReturn" },
      { "id": 12, "name": "EmergencyPurchase" },
      { "id": 13, "name": "VORPurchase" },
      { "id": 14, "name": "CoDlrPurchase" },
      { "id": 15, "name": "StockAdjustmentIn" },
      { "id": 16, "name": "OEMPurchase" },
      { "id": 17, "name": "idk" }, 
      { "id": 18, "name": "Others" }
    ]
    this.fetchBrandAdminData();
    
     this.sharedService.updateModuleName('Parts Ledger')
    
    this.minDate = new Date(2023, 4, 1); // Month is zero-based (4 = May)

    // Setting the maximum date to the last day of the current month
    const today = new Date();
    this.maxDate = new Date(today.getFullYear(), today.getMonth(), 0);
  }

  AdminSalesReportInputData: FormGroup = new FormGroup({
    BrandID: new FormControl('',[Validators.required]),
    DealerID: new FormControl('',[Validators.required]),
    LocationID: new FormControl(),
    FormDate: new FormControl('',[Validators.required]),
    ToDate: new FormControl('',[Validators.required]),
    DataType: new FormControl('',[Validators.required]),
    PartNumber: new FormControl('',[Validators.required])
  });

  updateFromDate: any = '';
  updateToDate: any = '';


  onSelectionChangeBrandData() {
   
    this.fetchDealerAdminData(this.AdminSalesReportInputData.value.BrandID);
    console.log(this.AdminSalesReportInputData.value)
    
  }

  onSelectionChangeDealerData() {
    this.fetchLocationAdminData(this.AdminSalesReportInputData.value.DealerID);

    // console.log(this.AdminSalesReportInputData.value);
  }


  constructor(private adminSalesReportService: AdminReportServiceService,
    private globalBlockUiService:GlobalBlockUiService,
  private sharedService:SharedServiceService) {}


  AdminSalesReportData: any = []

  BrandData: any = [];
  DealerData: any = [];
  LocationData: any = [];
  DataType: any = []
  PartDetail: any = [];
  SalesInfo: any = [];
  partNumber: any = [];
  DataTypeArray: any = [];
  isloading: boolean = false;
  showMessage: boolean = false;
  excel: any
  Result: any
  visible: boolean = false
  exportVisible: boolean = true
  SalesInfoVisible : boolean = false

  istotal: boolean = false
  

  async onSubmitAdminInputData() {

    this.DataTypeArray = this.AdminSalesReportInputData.value.DataType
  
    console.log(this.AdminSalesReportInputData.value);
    
    

    if (this.AdminSalesReportInputData.invalid) {
      this.AdminSalesReportInputData.markAllAsTouched();
      
    } 
    else{
      this.excel = 0
      this.arrayOfString(this.AdminSalesReportInputData.value.PartNumber)
      if(this.partNumber.length> 100){
        this.visible = true
        this.Result = "Limit Exceed Part Number Can't be can't be more than 100"
        console.log("Limit Exceed Part Number Can't be can't be more than 100");
        
      }
      else{
          this.fetchPartDescription(
          this.AdminSalesReportInputData.value.BrandID.toString(),
          this.partNumber,
          this.excel.toString()
          );
          this.onClickShowSaleinfo()
          this.onclicktotal()

      }
    }    
    }
  
    onClickShowSaleinfo() {
      this.DataTypeArray = this.AdminSalesReportInputData.value.DataType
      this.arrayOfString(this.AdminSalesReportInputData.value.PartNumber)
      this.excel = 0
      if (
        this.AdminSalesReportInputData.value.LocationID === '' ||
        this.AdminSalesReportInputData.value.LocationID === 'All Location'
      ) {
        this.AdminSalesReportInputData.value.LocationID = null;
      }
      //console.log(this.AdminSalesReportInputData.value.LocationID);
      
      this.fetchSalesInfo(
        
        this.AdminSalesReportInputData.value.BrandID.toString(),
        this.AdminSalesReportInputData.value.DealerID,
        this.AdminSalesReportInputData.value.LocationID,
        this.partNumber,
        this.getLastDateOfMonthForFrom(this.AdminSalesReportInputData.value.FormDate).toString(),
        this.getLastDateOfMonthForTo(this.AdminSalesReportInputData.value.ToDate).toString(),
        this.excel.toString()
      ); 
  }
  fetchBrandAdminData() {
    this.globalBlockUiService.startLoading();
    this.adminSalesReportService.getBrandData().subscribe({
      next: (res: any) => {
        this.BrandData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err:any) => {
        console.error('Error while fetching brand data:', err);
        this.globalBlockUiService.stopLoading();
        this.visible = true
        this.Result = 'Please contact IT Admin'
        // Optionally, you can also show a user-friendly message
        // this.toastr.error('Failed to load brand data. Please try again.');
      }
    });
  }
  
  
  fetchDealerAdminData(brandid: any) {
    this.globalBlockUiService.startLoading();
    this.adminSalesReportService
      .getDealerData({ brandid: brandid })
      .subscribe({
        next: (res: any) => {
          this.DealerData = res;
          console.log(this.DealerData);
          this.DealerData.sort((a: any, b: any) => {
            return a.dealer.localeCompare(b.dealer);
          });
          this.globalBlockUiService.stopLoading();
        },
        error: (err:any) => {
          console.error('Error while fetching dealer data:', err);
          this.globalBlockUiService.stopLoading();
           this.visible = true
        this.Result = 'Please contact IT Admin'
          // Optionally show toast or UI message
          // this.toastr.error('Failed to load dealer data. Please try again.');
        }
      });
  }
  

  fetchLocationAdminData(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.adminSalesReportService
      .getLocaitonData({ dealerid: dealerid })
      .subscribe({
        next: (res: any) => {
          this.LocationData = res;
          this.LocationData.sort((a: any, b: any) =>
            a.location.localeCompare(b.location)
          );
          this.globalBlockUiService.stopLoading();
        },
        error: (err:any) => {
          console.error('Error while fetching location data:', err);
          this.globalBlockUiService.stopLoading();
           this.visible = true
           this.Result = 'Please contact IT Admin'
          // Optional: Show UI alert or toast
          // this.toastr.error('Failed to load location data. Please try again.');
        }
      });
  }
  

  fetchPartDescription(brandid: any, partnumber: any, excel: any) {
    this.showMessage = false;
    this.globalBlockUiService.startLoading();
    this.adminSalesReportService
      .getPartDescription({ Brandid: brandid, Partnumber: partnumber, excel: excel })
      .subscribe({
        next: (res: any) => {
          this.PartDetail = res;
          this.globalBlockUiService.stopLoading();
          // console.log(this.PartDetail);
        },
        error: (err:any) => {
          console.error('Error while fetching part description:', err);
          this.globalBlockUiService.stopLoading();
          this.showMessage = true; // if you want to show an error message on UI
          this.visible = true
          this.Result = "Faild to Load Part Details"
          // Optional: Show toast or user-friendly error
          // this.toastr.error('Failed to load part description. Please try again.');
        }
      });
  }

  fetchSalesInfo(
    BrandID:any,
    Dealerid: any,
    Locationid: any,
    partnumber: any,
    from: any,
    to: any,
    excel: any
  ) {

    this.showMessage = false;
    this.globalBlockUiService.startLoading();
    
  
    this.adminSalesReportService
      .getSalesInfo({
        Brandid:BrandID,
        Dealerid: Dealerid,
        Locationid: Locationid,
        PartNumber: partnumber,
        from: from,
        to: to,
        excel: excel
      })
      .subscribe({
        next: (res: any) => {
          this.SalesInfo = res.Data;
          this.SalesInfoVisible = true;
          this.exportVisible = false
          this.globalBlockUiService.stopLoading();
        
          console.log(this.SalesInfo);
        },
        error: (err:any) => {
          console.error('Error while fetching sales info:', err);
          this.globalBlockUiService.stopLoading();
          this.showMessage = true;
          this.exportVisible = true;
          this.visible = true
          this.Result = 'Failed to load Sales Information'
          // Optional: Toast or user-friendly alert
          // this.toastr.error('Failed to load sales info. Please try again.');
        }
      });
  }
  
 

  exportToExcel() {
    const flatData = [...this.SalesInfo[0], ...this.SalesInfo[1]];
    const reorderedData = flatData.map(item => ({
      Partnumber: item.Partnumber,
      LocationName: item.Location,
      Month: item.Months,
      ClosingStocks: item.ClosingStocks,
      WorkshopSale: item.WorkshopSale, 
      Counter: item.Counter,
      StockTransferOut: item.StockTransferOut,
      AdjustmentOut: item.AdjustmentOut,
      PaidSale: item.PaidSale,
      WarrantySale: item.WarrantySale,
      FOCSales: item.FOCSales,
      GoodwillSale: item.GoodwillSale,
      NormalPurchase: item.NormalPurchase,
      StockTransferIn: item.StockTransferIn,
      JobcardReturnValue: item.JobcardReturnValue,
      CounterSaleReturn: item.CounterSaleReturn,
      EmergencyPurchase: item.EmergencyPurchase,
      VORPurchase: item.VORPurchase,
      CoDlrPurchase: item.CoDlrPurchase,
      StockAdjustmentIn: item.StockAdjustmentIn,
      OEMPurchase: item.OEMPurchase,
      idk: item.idk,
      Others: item.Others,
    }));
    // Convert JSON to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reorderedData);
    const partDetailsData = this.PartDetail.map((item: { partnumber: any; LatestPartno: any; partdesc: any; moq: any; category: any; landedcost: any; mrp: any; dateadded: any; }) => ({
      PartNumber: item.partnumber,
      Latest_Part_Number: item.LatestPartno,
      partdesc: item.partdesc,
      moq: item.moq,
      category: item.category,
      landedcost: item.landedcost,
      mrp: item.mrp
    }));
    console.log("this is part details",partDetailsData);
    

    const partDetailsWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(partDetailsData);

    // Create a workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { SalesInfo: worksheet,
        PartDetails: partDetailsWorksheet,
       },
      SheetNames: ['PartDetails','SalesInfo'],
    };
    // Write the workbook
    XLSX.writeFile(workbook, `Salesview.xlsx`);
  }

  getLastDateOfMonthForFrom(inputDateStr:any) {
    console.log(this.AdminSalesReportInputData.value.FormDate);
    
    const date = new Date(inputDateStr);
      // Get the year and month from the date
      const year = date.getFullYear();
      const month = date.getMonth()+1; // 0-based
      // Last day of the month = day 0 of next month
      const lastDay = new Date(year, month, 0);
      // Format to yyyy-mm-dd
      const yyyy = lastDay.getFullYear();
      const mm = String(lastDay.getMonth()+1).padStart(2, '0');
      const dd = String(lastDay.getDate()).padStart(2, '0');
      return `'${yyyy}-${mm}-${dd}'`;

  }
  getLastDateOfMonthForTo(inputDateStr:any) {
    console.log(this.AdminSalesReportInputData.value.ToDate);
    const date = new Date(inputDateStr);
      // Get the year and month from the date
      const year = date.getFullYear();
      const month = date.getMonth()+1; // 0-based
      // Last day of the month = day 0 of next month
      const lastDay = new Date(year, month, 0);
      // Format to yyyy-mm-dd
      const yyyy = lastDay.getFullYear();
      const mm = String(lastDay.getMonth()+1 ).padStart(2, '0');
      const dd = String(lastDay.getDate()).padStart(2, '0');
      return `'${yyyy}-${mm}-${dd}'`;
          
  }
    
    
    
    
    
    
  
  changeInputType(event: FocusEvent, type: string) {
    const target = event.target as HTMLInputElement;
    target.type = type;
  }

  onclicktotal(){
    if(this.istotal===false){
      this.istotal = true
    }
    else{
      this.istotal = false
    }
  }

  refreshPage(): void {
    window.location.reload();
  }


  arrayOfString(partnumber: any){
    this.partNumber = partnumber.split(',')
    .map((pn: string) => pn.replace(/[^a-zA-Z0-9/s]/g, '').toString())
    .filter((pn: string) => pn)
  }


  showupload: boolean = false
  onClickShowUpload(){
    this.showupload = true
  }

  partsExcel:any
  selectedFileName:any

  onFileSelect(event: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.partsExcel = event.files[0];
      this.selectedFileName = event.files[0].name // Pehli file select karna
      this.globalBlockUiService.stopLoading()
    }
  }

  UploadPartNumber(){
   this.globalBlockUiService.startLoading()
   this.DataTypeArray = this.AdminSalesReportInputData.value.DataType
   const formData = new FormData();
   formData.append("file", this.partsExcel);
   formData.append('Brandid', this.AdminSalesReportInputData.value.BrandID);
   formData.append('Dealerid', this.AdminSalesReportInputData.value.DealerID);
   formData.append('Locationid', this.AdminSalesReportInputData.value.LocationID);
   formData.append('from', this.getLastDateOfMonthForFrom(this.AdminSalesReportInputData.value.FormDate).toString());
   formData.append('to', this.getLastDateOfMonthForTo(this.AdminSalesReportInputData.value.ToDate).toString());
   formData.append('excel', '1');   

    this.adminSalesReportService.getPartDescription(formData).subscribe((res:any)=>{
      this.globalBlockUiService.stopLoading()
      this.PartDetail = res
      this.showupload = false
      this.partsExcel = null
    },
    (error:any) => {
      console.error("File upload failed:", error);
      this.globalBlockUiService.stopLoading()
      this.showupload = false})
    this.adminSalesReportService.getSalesInfo(formData).subscribe((res:any)=>{
      this.SalesInfoVisible = true
        this.globalBlockUiService.stopLoading()
        this.exportVisible = true
        this.SalesInfoVisible = true
        this.SalesInfo = res.Data
        this.showupload = false
        this.exportVisible = false
        this.partsExcel = undefined
      },
      (error:any) => {
        console.error("File upload failed:", error);
        this.visible = true
        this.Result =  `${error.error.message +'Part Number: '+ error.error.unmatchedParts}`
        this.globalBlockUiService.stopLoading()
        this.showupload = false

    })

  }

}
