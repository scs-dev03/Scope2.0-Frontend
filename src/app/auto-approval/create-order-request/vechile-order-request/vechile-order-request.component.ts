import { Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PaginatorState } from 'primeng/paginator';
import { VehicleOrderService } from '../../../services/Auto-Approvals/vehicle-order.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';
import { format } from 'echarts';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-vechile-order-request',
  imports: [SHARED_IMPORTS,Popover, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './vechile-order-request.component.html',
  styleUrl: './vechile-order-request.component.css'
})
export class VechileOrderRequestComponent {
  ngOnInit(): void {
    this.addParts()
    this.fetchlocation()
    this.fetchOrderType()
    this.fetchJobCardType()
  }

  MultiUpload: boolean = false;
  AddPartWise: FormGroup
  VechileOrderRequestInput: FormGroup

  VechileOrderFilterDataBulk = new FormGroup({
    Location: new FormControl(null, [Validators.required]),
  })

  constructor(private fb: FormBuilder, private globalBlockUiService: GlobalBlockUiService, private vechileorderservice: VehicleOrderService) {
    this.AddPartWise = this.fb.group({
      parts: this.fb.array([])
    });

    this.VechileOrderRequestInput = this.fb.group({
      Location: [null, Validators.required],
      VechileNumber: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]],
      VechileModel: [null, Validators.required],
      JobCardNumber: [null, [Validators.pattern(/^[A-Za-z0-9]{15}$/)]],
      JobCardType: [null, Validators.required],
      AdvaceReceiptUpload: [false],
      Advisor: [null, Validators.required],
      OrderType: [null, Validators.required],
      Advance: [null],
      Estimate: [null],
    })
  }

  get parts() {
    return this.AddPartWise.get('parts') as FormArray;
  }

  addParts() {
    const part = this.fb.group({
      PartNumber: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      Quantity: [null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(1)]],
      Remark: [null,]
    })
    this.parts.push(part);
  }

  removePart(index: number) {
    this.parts.removeAt(index);
  }



  VehicleSaleBulkExcel: any = null;
  @ViewChild('fu') fu: any;

  OnSelectFileBulk(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.VehicleSaleBulkExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }

  TableViewData: any = [];
  visible: boolean = false;
  Result: any;
  VisibleNotInMaster: boolean = false;
  NotInMasterPartNumber: any = [];
  showErrorsTable: boolean = false;
  errorViewData: any = [];



  OnClickBulkUploadSend() {
    if (this.VechileOrderFilterDataBulk.valid && this.VehicleSaleBulkExcel) {
      this.globalBlockUiService.startLoading();
      const formData = new FormData();
      formData.append('file', this.VehicleSaleBulkExcel);
      formData.append('userId', sessionStorage.getItem('userid') || '');
      formData.append('LocationId', this.VechileOrderFilterDataBulk.value.Location || '');
      formData.append('BrandId', sessionStorage.getItem('brandid') || '');
      formData.append('DealerId', sessionStorage.getItem('dealerid') || '');

      this.vechileorderservice.VehicleUploadBulk(formData).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.TableViewData = res.data.result;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.visible = false;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
          }
          this.VehicleSaleBulkExcel = null;
          this.fu.clear();
          this.VechileOrderFilterDataBulk.reset();
          this.globalBlockUiService.stopLoading();
        },
        error: (err: any) => {

          console.error("Upload failed:", err);
          this.VehicleSaleBulkExcel = null;
          this.fu.clear();
          this.VechileOrderFilterDataBulk.reset();
          this.globalBlockUiService.stopLoading();
          if (err?.error?.message) {
            this.showErrorsTable = false;
            let ErrorMessage = err?.error?.errors[0];
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
            else if (err?.error?.message == "Data validation failed") {
              this.Result = ErrorMessage.message
              this.visible = true;
              this.showErrorsTable = true
              this.errorViewData = ErrorMessage.data



            }
            else {
              this.Result = err.error.message;
              this.visible = true;
              //this.showErrorsTable = false;
              console.log("triggered");

            }

          } else {
            this.Result = "Something went wrong while Uploading data.";
          }
        }
      })
    }
    else {
      this.VechileOrderFilterDataBulk.markAllAsTouched();
    }
  }

  selectedRows: any[] = [];
  updateOrderValue(row: any) {
    if (row.Qty < 1 || !row.Qty) {
      row.Qty = 1;
    }
    row.OrderValue = row.Qty * row.Price;
  }

  onSelectionChange() {
    console.log('Selected Rows:', this.selectedRows);
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



  AdvanceReceiptImage: any = null;
  OnSelectAdvanceReceiptImage(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.AdvanceReceiptImage = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }

  MultiUploadExcel: any = null;

  OnSelectFileMulti(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.MultiUploadExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }


  @ViewChild('fum') fum: any;

  OnClickSaveSingleAndMulti() {
    this.globalBlockUiService.startLoading();

    if (this.AddPartWise.invalid && this.VechileOrderRequestInput.invalid) {
      this.AddPartWise.markAllAsTouched();
      this.VechileOrderRequestInput.markAllAsTouched();
    }
    if (this.MultiUpload && this.VechileOrderRequestInput.valid) {

      const formdata = new FormData();

      formdata.append('file', this.MultiUploadExcel || '');
      formdata.append('LocationId', this.VechileOrderRequestInput.value.Location || '');
      formdata.append('userId', sessionStorage.getItem('userid') || '');
      formdata.append('BrandId', sessionStorage.getItem('brandid') || '');
      formdata.append('image', this.AdvanceReceiptImage || '');
      formdata.append('DealerId', sessionStorage.getItem('dealerid') || '');
      formdata.append('VehicleNumber', this.VechileOrderRequestInput.value.VechileNumber || '');
      formdata.append('VehicleModel', this.VechileOrderRequestInput.value.VechileModel || '');
      formdata.append('JobCardNumber', this.VechileOrderRequestInput.value.JobCardNumber || '');
      formdata.append('JobType', this.VechileOrderRequestInput.value.JobCardType || '');
      formdata.append('OrderType', this.VechileOrderRequestInput.value.OrderType || '');
      formdata.append('Estimate', this.VechileOrderRequestInput.value.Estimate || '');
      formdata.append('AdvanceValue', this.VechileOrderRequestInput.value.Advance || '');
      formdata.append('Advisor', this.VechileOrderRequestInput.value.Advisor || '');

      this.vechileorderservice.sendMultiData(formdata).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.TableViewData = res.data.result;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.visible = false;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
          }
          this.VehicleSaleBulkExcel = null;
          this.fum.clear();
          this.VechileOrderRequestInput.reset();
          this.AddPartWise.reset()
          this.globalBlockUiService.stopLoading();

        },
        error: (err: any) => {

          console.error("Upload failed:", err);
          this.VehicleSaleBulkExcel = null;
          this.fum.clear();
          this.VechileOrderRequestInput.reset();
          this.AddPartWise.reset()
          this.globalBlockUiService.stopLoading();
          if (err?.error?.message) {
            this.showErrorsTable = false;
            let ErrorMessage = err?.error?.errors[0];
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
              this.showErrorsTable = false;
              //console.log("triggered");

            }

          } else {
            this.Result = "Something went wrong while sending data.";
          }
        }
      })




    }

    if (this.VechileOrderRequestInput.valid && this.AddPartWise.valid) {

      const data = this.AddPartWise.value.parts

      const payload = data.map((part: any) => {
        return {
          VehicleNumber: this.VechileOrderRequestInput.value.VechileNumber,
          LocationId: this.VechileOrderRequestInput.value.Location,
          VehicleModel: this.VechileOrderRequestInput.value.VechileModel,
          JobCardNumber: this.VechileOrderRequestInput.value.JobCardNumber,
          JobType: this.VechileOrderRequestInput.value.JobCardType,
          Advisor: this.VechileOrderRequestInput.value.Advisor,
          OrderType: this.VechileOrderRequestInput.value.OrderType,
          PartNumber: part.PartNumber,
          Qty: part.Quantity,
          Remarks: part.Remark,
          Estimate: this.VechileOrderRequestInput.value.Estimate,
          AdvanceValue: this.VechileOrderRequestInput.value.Advance,
          UserId: sessionStorage.getItem('userid') || '',
        }
      })

      const formdata = new FormData();
      formdata.append('LocationId', this.VechileOrderRequestInput.value.Location || '');
      formdata.append('userId', sessionStorage.getItem('userid') || '');
      formdata.append('BrandId', sessionStorage.getItem('brandid') || '');
      formdata.append('image', this.AdvanceReceiptImage || '');
      formdata.append('payload', JSON.stringify(payload));


      this.vechileorderservice.sendSingleAddData(formdata).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.TableViewData = res.data.result;

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.visible = false;
            this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
              return part.PartNumber
            })
          }
          this.VehicleSaleBulkExcel = null;
          this.fu.clear();
          this.VechileOrderRequestInput.reset();
          this.AddPartWise.reset()
          this.globalBlockUiService.stopLoading();

        },
        error: (err: any) => {

          console.error("Upload failed:", err);
          this.VehicleSaleBulkExcel = null;
          this.fu.clear();
          this.VechileOrderRequestInput.reset();
          this.AddPartWise.reset()
          this.globalBlockUiService.stopLoading();
          if (err?.error?.message) {
            this.showErrorsTable = false;
            let ErrorMessage = err?.error?.errors[0];
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
              this.showErrorsTable = false;
              //console.log("triggered");

            }

          } else {
            this.Result = "Something went wrong while sending data.";
          }
        }
      })

    }

  }



  SendOrderRequestData() {
     this.showErrorsTable = false;

    if (this.selectedRows.length > 0) {

      this.globalBlockUiService.startLoading();
      this.vechileorderservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'V', payload: this.selectedRows }).subscribe({
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




  blockSpecialChar(event: KeyboardEvent) {
    const allowedPattern = /^[A-Za-z0-9]$/;
    const input = event.key
    if (!allowedPattern.test(input)) {
      event.preventDefault()
    }

  }


  SampleExcelDownload() {

    const Data = [
      {
        'VehicleNumber': '',
        'VehicleModel': '',
        'JobCardNumber': '',
        'JobType': '',
        'OrderType': '',
        'PartNumber': '',
        'Qty': '',
        'Remarks': '',
        'AdvanceValue': '',
        'Estimate': '',
        'Advisor': ''

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
  SampleSingleDownload() {

    const Data = [
      {
        'Part_Number': '',
        'Quantity': '',
        'Remark': ''
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





  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.vechileorderservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
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

  OnclickLoation() {
    this.fetchAdvisorData(this.VechileOrderRequestInput.value.Location);
  }


  AdvisorData: any
  fetchAdvisorData(LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.vechileorderservice.getAdvisor({ LocationId }).subscribe({
      next: (res: any) => {

        this.AdvisorData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }


  OrderTypeData: any

  fetchOrderType() {
    this.globalBlockUiService.startLoading();
    this.vechileorderservice.getOrderType().subscribe({
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

  JobCardData: any
  fetchJobCardType() {
    this.globalBlockUiService.startLoading();
    this.vechileorderservice.getJobCardType().subscribe({
      next: (res: any) => {
        this.JobCardData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching Order Type data:", err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }


  

  preventNegative(event: KeyboardEvent) {

    const input = event.target as HTMLInputElement;

    if (event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
    setTimeout(() => {
      const value = Number(input.value);
      if (value > 1000) {
        input.value = '1000';
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

  blockZero(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value === '0' || input.value.startsWith('0')) {
      input.value = '';
    }
  }

  allowOnlyLettersAndNumber(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

  allowNumberOnly(event: KeyboardEvent) {
    const char = event.key

    const pattern = /^[0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault()
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
    this.vechileorderservice.getGroupStockData({ DealerId, PartNumber, BrandId, LocationId }).subscribe({
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

    this.vechileorderservice.getNonMovingData({ DealerId, partnumber, BrandId, LocationId }).subscribe({
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








}