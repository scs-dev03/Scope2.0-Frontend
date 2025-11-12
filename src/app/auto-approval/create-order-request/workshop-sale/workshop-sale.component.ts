import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import FileSaver from 'file-saver';
import { SharedModule, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { PrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { PaginatorState } from 'primeng/paginator';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { WorkshopSaleService } from '../../../services/Auto-Approvals/workshop-sale.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { Table } from 'primeng/table';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Popover } from 'primeng/popover';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workshop-sale',
  imports: [SHARED_IMPORTS,Popover, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './workshop-sale.component.html',
  styleUrl: './workshop-sale.component.css'
})
export class WorkshopSaleComponent {
  TableViewData: any = [];


  ngOnInit(): void {
    this.addParts()
    this.fetchOrderType()
    this.fetchlocation()
    //this.visibleTableData = true;
  }


  AddPartWise: FormGroup
  visible: boolean = false;
  Result: any

  constructor(private router: Router,private fb: FormBuilder, private config: PrimeNG, private globalBlockUiService: GlobalBlockUiService, private messageService: MessageService, private workshopeservice: WorkshopSaleService) {
    this.AddPartWise = this.fb.group({
      parts: this.fb.array([])
    });
  }


  get parts() {
    return this.AddPartWise.get('parts') as FormArray;
  }

  addParts() {
    const part = this.fb.group({
      PartNumber: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      Quantity: [null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(0)]],
      Remark: [null,]
    })

    this.parts.push(part);
  }

  removePart(index: number) {
    this.parts.removeAt(index);
  }

  blockSpecialChar(event: KeyboardEvent) {
    const allowedPattern = /^[A-Za-z0-9]$/;
    const input = event.key
    if (!allowedPattern.test(input)) {
      event.preventDefault()
    }

  }

  searchValue: string | undefined;
  @ViewChild('dt1') dt1: any;

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  onGlobalFilter(event: Event) {


    const value = (event.target as HTMLInputElement)?.value || '';
    console.log(value);

    this.dt1.filterGlobal(value, 'contains');
  }



  WorkShopInputFieldData = new FormGroup({
    Location: new FormControl(null, Validators.required),
    OrderType: new FormControl(null, Validators.required)
  })

  WorkShopInputFieldDataBulkUpload = new FormGroup({
    Location: new FormControl(null, Validators.required),
    OrderType: new FormControl(null, Validators.required)
  })



  WorkShopBulkSampleExcelDownload() {

    const Data = [
      {
        "PartNumber": "",
        "Qty": "",
        "Remarks": ""
        
      }
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Data)

    const workbook: XLSX.WorkBook = {
      Sheets: { 'SampleData': worksheet },
      SheetNames: ['SampleData']
    }

    const ExcelBuffer: any = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx'
    })

    const data: Blob = new Blob([ExcelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    });

    FileSaver.saveAs(data, 'Sample_Download.xlsx');
  }

  OrderTypeData: any

  fetchOrderType() {
    this.globalBlockUiService.startLoading();
    this.workshopeservice.getOrderType().subscribe({
      next: (res: any) => {
        this.OrderTypeData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching Order Type data:", err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }


  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.workshopeservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  //TableViewData: any
  selectedRows: any[] = [];
  showErrorsTable: boolean = false;
  errorViewData: any
  NotInMasterPartNumber: any
  VisibleNotInMaster: boolean = false
  StockAsOnDate: any

  updateOrderValue(row: any) {
    if (row.Qty < 1 || !row.Qty) {
      row.Qty = 1;
    }
    row.OrderValue = row.Qty * row.Price;
  }



  onSelectionChange(event: any) {
    console.log('Selected Rows:', this.selectedRows);
  }

  OnClickSendPartWise() {
    console.log("clicked");

    if (this.WorkShopInputFieldData.valid && this.AddPartWise.valid) {
      this.globalBlockUiService.startLoading();
      const partsArray = this.AddPartWise.get('parts') as FormArray;

      const payload = partsArray.value.map((parts: any) => {
        return {
          LocationId: this.WorkShopInputFieldData.value.Location || '',
          OrderType: this.WorkShopInputFieldData.value.OrderType || '',
          PartNumber: parts.PartNumber,
          Qty: parts.Quantity,
          Remarks: parts.Remark,
          userId: sessionStorage.getItem('userid') || ''
        }
      })

      this.workshopeservice.SingleAddWorkShopSale({DealerId : sessionStorage.getItem('dealerid'), BrandId: sessionStorage.getItem('brandid') || '', payload }).subscribe({
        next: (res: any) => {

          this.globalBlockUiService.stopLoading();
           console.log("true form nim");
          this.Result = res.message
          this.visible = true;
          if (res.data?.notinMaster.length > 0) {
            
            this.VisibleNotInMaster = true;
            this.visible = false;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
            this.visibleTableData = false
          }
          this.TableViewData = res.data.result;
          this.visibleTableData = true
           if (this.TableViewData.length > 0) {
              this.visibleTableData = true;
            }
            else{
              this.visibleTableData = false;
            }
          this.WorkShopInputFieldData.reset();
          this.AddPartWise.reset();
          this.StockAsOnDate = res.data.result[0].StockDate;

        },
        error: (err: any) => {
          console.error("Upload failed:", err);
          this.WorkShopInputFieldData.reset();
          this.globalBlockUiService.stopLoading();
          this.AddPartWise.reset();
          if (err?.error?.message) {
            this.Result = err.error.message;
            this.visible = true;

          } else {
            this.Result = "Something went wrong while sending data.";
            this.visible = true;
          }
        }

      })

    }
    else {
      this.WorkShopInputFieldData.markAllAsTouched()
      this.AddPartWise.markAllAsTouched()
      this.globalBlockUiService.stopLoading();
    }


  }
  WorkshopSaleBulkExcel: any = null;
  @ViewChild('fu') fu: any;

  OnSelectFileBulk(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.WorkshopSaleBulkExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }


    canAddMoreParts(): boolean {
    const partsArray = this.AddPartWise.get('parts') as FormArray;
    if (!partsArray || partsArray.length === 0) return false;

    const lastPart = partsArray.at(partsArray.length - 1);

    const partNumber = lastPart.get('PartNumber')?.value?.trim();
    const quantity = lastPart.get('Quantity')?.value;

    return !!partNumber && !!quantity && lastPart.valid;
  }

  

  visibleTableData:boolean=false;
  OnClickSendWorkshopSaleBulkUpload() {
    if (this.WorkShopInputFieldDataBulkUpload.valid && this.WorkshopSaleBulkExcel) {
      this.globalBlockUiService.startLoading()

      const formData = new FormData();
      formData.append('file', this.WorkshopSaleBulkExcel);
      formData.append('userId', sessionStorage.getItem('userid') || '');
      formData.append('LocationId', this.WorkShopInputFieldDataBulkUpload.value.Location || '');
      formData.append('OrderType', this.WorkShopInputFieldDataBulkUpload.value.OrderType || '');
      formData.append('BrandId', sessionStorage.getItem('brandid') || '');
      formData.append('DealerId', sessionStorage.getItem('dealerid') || '');


      this.workshopeservice.BulkUploadWorkShopSale(formData).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.showErrorsTable = false;

          this.TableViewData = res.data.result;
          this.visibleTableData = true
           if (this.TableViewData.length > 0) {
              this.visibleTableData = true;
            }
            else{
              this.visibleTableData = false;
            }
           this.StockAsOnDate = res.data.result[0].StockDate;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.visible = false;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
          }
          this.WorkshopSaleBulkExcel = null
          this.fu.clear()
          this.WorkShopInputFieldDataBulkUpload.reset()
          this.globalBlockUiService.stopLoading()

        },
        error: (err: any) => {
          this.showErrorsTable = false

          console.log("Upload failed:", err);
          this.WorkshopSaleBulkExcel = null;
          this.fu.clear();
          this.WorkShopInputFieldDataBulkUpload.reset();
          this.globalBlockUiService.stopLoading()
          let ErrorMessage = err?.error?.errors[0];

          if (err?.error?.message) {
            if (err?.error?.message == "Excel validation failed") {
                this.Result = ErrorMessage.message
                this.visible = true;
                this.showErrorsTable = true
                this.errorViewData = ErrorMessage.data

              }
              else if (err?.error?.message == "Missing headers") {
                this.Result = ErrorMessage.message
                this.visible = true;

              }
              else {
                this.Result = err.error.message;
                this.visible = true;
                //this.showErrorsTable = false;
              }

          } else {
            this.Result = "Something went wrong while Uploading data.";
          }

        }
      })
    }
    else {
      this.WorkShopInputFieldDataBulkUpload.markAllAsTouched()

    }
  }


  SendOrderRequestData() {

    if (this.selectedRows.length > 0) {

      this.globalBlockUiService.startLoading();
      this.workshopeservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'S', payload: this.selectedRows }).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;
          this.TableViewData = []
          this.visibleTableData = false
          this.selectedRows = []
          this.globalBlockUiService.stopLoading()

        },
        error: (err: any) => {
          this.globalBlockUiService.stopLoading()

          if (err?.error?.message) {
            this.Result = err.error.message;
            this.visible = true;

          } else {
            this.Result = "Something went wrong while sending data.";
            this.visible = true;
          }
        }
      })
    }
    else {
      this.Result = "Please Select Table Rows"
      this.visible = true;
    }

  }


  SendOrderRequestSingle(rowData:any){
    console.log(rowData.value);
    
    this.globalBlockUiService.startLoading();
    this.workshopeservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'S', payload: [rowData] }).subscribe({
      next: (res:any)=>{
        this.Result = res.message
        this.visible = true;
        this.selectedRows = []
        this.globalBlockUiService.stopLoading()
        this.TableViewData = this.TableViewData.filter((item:any)=> item.Id != rowData.Id)
      },
      error: (err: any) => {
          this.globalBlockUiService.stopLoading()

          if (err?.error?.message) {
            this.Result = err.error.message;
            this.visible = true;

          } else {
            this.Result = "Something went wrong while sending data.";
            this.visible = true;
          }
        }
    })

  }


  RemoveSingleRow(rowData:any){
    this.TableViewData = this.TableViewData.filter((item:any)=> item.Id != rowData.Id)
  }




  ResetSingle() {
    this.AddPartWise.reset();
    this.WorkShopInputFieldData.reset()
  }
  ResetBulk() {
    this.WorkShopInputFieldDataBulkUpload.reset();
    this.fu.clear()
  }

  blockZero(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value === '0' || input.value.startsWith('0')) {
      input.value = '';
    }
  }

  preventNegative(event: KeyboardEvent) {

    const input = event.target as HTMLInputElement;

    if (event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }

    setTimeout(() => {
      const value = Number(input.value);
      if (value > 1000) {
        input.value = '1000'; // ✅ Lock it to 1000
      }
    });
  }

  blockNegativePaste(event: ClipboardEvent) {

    const pastedInput = event.clipboardData?.getData('text') || '';
    const isValid = /^[1-9][0-9]*$/.test(pastedInput);
    if (!isValid) {
      event.preventDefault();
    }
  }



onShowGroupStock(rowData: any, event: Event, popover: any) {
    popover.toggle(event);


    this.fetchGrpupStockData(
      sessionStorage.getItem('dealerid'),
      rowData.PartNumber,
      sessionStorage.getItem('brandid'),
      rowData.LocationId
    );
  }

  GroupStockData: any
  fetchGrpupStockData(DealerId: any, PartNumber: any, BrandId: any, LocationId: any) {
    this.globalBlockUiService.startLoading();
    this.workshopeservice.getGroupStockData({ DealerId, PartNumber, BrandId, LocationId }).subscribe({
      next: (res: any) => {
        this.GroupStockData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching Group Stock data:", err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }


  onShowNonMovingData(rowData: any, event: Event, popover: any) {
    popover.toggle(event);


    this.fetchNonMovingData(
      sessionStorage.getItem('dealerid'),
      rowData.PartNumber,
      sessionStorage.getItem('brandid'),
      rowData.LocationId
    );
  }


  NonMovingData: any =  [
        {
            "LOCATION": "Kalikapur",
            "QTY": 6,
            "DISCOUNT": 25,
            "Dealer": "Auto Carriage (Royal Mahindra)"
        }
    ]
  fetchNonMovingData(DealerId: any, partnumber: any, BrandId: any, LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.workshopeservice.getNonMovingData({ DealerId, partnumber, BrandId, LocationId }).subscribe({
      next: (res: any) => {
        this.NonMovingData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching Group Stock data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }


   RedirectToNotInMaster() {
    this.router.navigate(['/auto/master/nim']);
  }


  CancleAllRequest(){
    this.TableViewData = []
    this.visibleTableData = false;
    
  }


  




}
