import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import FileSaver from 'file-saver';
import { SharedModule, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { PrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { PaginatorState } from 'primeng/paginator';
import { CreateOrderViewServiceService } from '../../../services/Auto-Approvals/create-order-view-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { WorkshopSaleService } from '../../../services/Auto-Approvals/workshop-sale.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { Table } from 'primeng/table';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";

@Component({
  selector: 'app-workshop-sale',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './workshop-sale.component.html',
  styleUrl: './workshop-sale.component.css'
})
export class WorkshopSaleComponent {
  TableViewData: any = [];


  ngOnInit(): void {
    this.addParts()
    this.fetchOrderType()
    this.fetchlocation()
  }


  AddPartWise: FormGroup
  visible: boolean = false;
  Result: any

  constructor(private fb: FormBuilder, private config: PrimeNG, private globalBlockUiService: GlobalBlockUiService, private messageService: MessageService, private createorderviewservice: CreateOrderViewServiceService, private workshopeservice: WorkshopSaleService) {
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
        "VehicleNumber": "",
        "VehicleModel": "",
        "JobCardNumber": "",
        "JobType": "",
        "OrderType": "",
        "PartNumber": "",
        "Qty": "",
        "Remarks": "",
        "AdvanceValue": "",
        "Estimate": "",
        "Advisor": ""
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

      this.workshopeservice.SingleAddWorkShopSale({ BrandId: sessionStorage.getItem('brandid') || '', payload }).subscribe({
        next: (res: any) => {

          this.Result = res.message
          this.visible = true;


          this.TableViewData = res.data.result;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
          }
          this.WorkShopInputFieldData.reset();
          this.globalBlockUiService.stopLoading();
          this.AddPartWise.reset();

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


  OnClickSendWorkshopSaleBulkUpload() {
    if (this.WorkShopInputFieldDataBulkUpload.valid && this.WorkshopSaleBulkExcel) {
      this.globalBlockUiService.startLoading()

      const formData = new FormData();
      formData.append('file', this.WorkshopSaleBulkExcel);
      formData.append('userId', sessionStorage.getItem('userid') || '');
      formData.append('LocationId', this.WorkShopInputFieldDataBulkUpload.value.Location || '');
      formData.append('OrderType', this.WorkShopInputFieldDataBulkUpload.value.OrderType || '');
      formData.append('BrandId', sessionStorage.getItem('brandid') || '');

      this.workshopeservice.BulkUploadWorkShopSale(formData).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.showErrorsTable = false;

          this.TableViewData = res.data.result;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
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


}
