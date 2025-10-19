import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule } from '@angular/forms';

import { SharedModule, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { PaginatorState } from 'primeng/paginator';
import { CreateOrderViewServiceService } from '../../../services/Auto-Approvals/create-order-view-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { CounterSaleService } from '../../../services/Auto-Approvals/counter-sale.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-counter-sale',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule, FormsModule, IconField, InputIcon],
  templateUrl: './counter-sale.component.html',
  styleUrl: './counter-sale.component.css'
})
export class CounterSaleComponent {
  TableViewData: any = [];

  ngOnInit(): void {
    this.addParts()
    this.fetchlocation()
    this.fetchOrderType()

  }



  AddPartWise: FormGroup
  visible: boolean = false;
  Result: any

  constructor(private fb: FormBuilder, private config: PrimeNG, private globalBlockUiService: GlobalBlockUiService, private messageService: MessageService, private countersaleservice: CounterSaleService) {
    this.AddPartWise = this.fb.group({
      parts: this.fb.array([])
    });
  }

  CounterSaleFilterData = new FormGroup({
    Location: new FormControl(null, [Validators.required]),
    OrderType: new FormControl(null, [Validators.required]),
    PartyNameAndCode: new FormControl(null, [Validators.required])
  })

  CounterSaleFilterDataBulk = new FormGroup({
    Location: new FormControl(null, [Validators.required]),
    OrderType: new FormControl(null, [Validators.required])
  })

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





  selectedSalesType: any

  CounterSaleMultiPartSampleExcelDownload() {

    const Data = [
      {
        'PartNumber': '',
        'Quantity': '',
        'Remark': '',

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
  CounterSaleBulkUploadSampleExcelDownload() {

    const Data = [
      {
        'PartNumber': '',
        'Quantity': '',
        'Remark': '',
        'Party Name': ''
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


  OnClickAdd() {
    this.visible = true;
  }

  files = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;


  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.countersaleservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
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

  OrderTypeData: any

  fetchOrderType() {
    this.globalBlockUiService.startLoading();
    this.countersaleservice.getOrderType().subscribe({
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



  fetchPartyData(LocationId: any) {

    this.globalBlockUiService.startLoading();

    this.countersaleservice.getPartyNameAndCode({ LocationId, Status: 1 }).subscribe({
      next: (res: any) => {
        const PartyViewData = res.data;
        this.transformPartyNameAndCodeforBinding(PartyViewData)
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  OnClickLocation() {
    this.fetchPartyData(this.CounterSaleFilterData.value.Location)
  }

  PartyAndPartyCode: any = []

  transformPartyNameAndCodeforBinding(PartyViewData: any) {

    this.PartyAndPartyCode = PartyViewData.map((item: any) => {
      let name = '';

      if (item.PartyName && item.PartyCode) {
        name = `${item.PartyName}-${item.PartyCode}`;
      } else if (item.PartyName) {
        name = item.PartyName;
      } else if (item.PartyCode) {
        name = item.PartyCode;
      }

      return {
        Name: name,
        Id: item.Id
      };
    });

    console.log(this.PartyAndPartyCode);

  }

  CounterSaleBulkExcel: any = null;
  @ViewChild('fu') fu: any;

  OnSelectFileBulk(event: any, fu: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.CounterSaleBulkExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }



  selectedRows: any[] = [];
  showErrorsTable: boolean = false;
  errorViewData: any


  updateOrderValue(row: any) {
    if (row.Qty < 1 || !row.Qty) {
      row.Qty = 1;
    }
    row.OrderValue = row.Qty * row.Price;
  }

  onSelectionChange() {
    console.log('Selected Rows:', this.selectedRows);
  }

  

  OnClickBulkUploadSend() {
    if (this.CounterSaleFilterDataBulk.valid && this.CounterSaleBulkExcel) {
      this.globalBlockUiService.startLoading();
      const formData = new FormData();
      formData.append('file', this.CounterSaleBulkExcel);
      formData.append('userId', sessionStorage.getItem('userid') || '');
      formData.append('LocationId', this.CounterSaleFilterDataBulk.value.Location || '');
      formData.append('OrderType', this.CounterSaleFilterDataBulk.value.OrderType || '');
      formData.append('Bulk', '1');
      formData.append('BrandId', sessionStorage.getItem('brandid') || '');

      this.countersaleservice.BulkUploadCounterSale(formData).subscribe({
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
          this.CounterSaleBulkExcel = null;
          this.fu.clear();
          this.CounterSaleFilterDataBulk.reset();
          this.globalBlockUiService.stopLoading();
        },
        error: (err: any) => {

          console.error("Upload failed:", err);
          this.CounterSaleBulkExcel = null;
          this.fu.clear();
          this.CounterSaleFilterDataBulk.reset();
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
              //this.showErrorsTable = false;
            }

          } else {
            this.Result = "Something went wrong while Uploading data.";
          }

        }
      })
    }
    else {
      this.CounterSaleFilterDataBulk.markAllAsTouched();
    }
  }

  @ViewChild('fum') fum: any;
  CounterSaleMultiExcel: any = null;
  OnSelectFileMulti(event: any, fum: any) {
    this.globalBlockUiService.startLoading()
    if (event.files && event.files.length > 0) {
      this.CounterSaleMultiExcel = event.files[0];
      this.globalBlockUiService.stopLoading()
    }
  }
  MultiUpload: boolean = false;
  VisibleNotInMaster: boolean = false
  NotInMasterPartNumber: any = ""


  OnClickMultiUploadAndSend() {
    if (this.AddPartWise.invalid || this.CounterSaleFilterData.invalid) {
      this.AddPartWise.markAllAsTouched()
      this.CounterSaleFilterData.markAllAsTouched()

    }
    if (this.MultiUpload) {
      //console.log(this.CounterSaleMultiExcel);

      if (this.CounterSaleFilterData.valid && this.CounterSaleMultiExcel) {
        this.globalBlockUiService.startLoading();
        const formData = new FormData();
        formData.append('file', this.CounterSaleMultiExcel);
        formData.append('userId', sessionStorage.getItem('userid') || '');
        formData.append('LocationId', this.CounterSaleFilterData.value.Location || '');
        formData.append('OrderType', this.CounterSaleFilterData.value.OrderType || '');
        formData.append('Bulk', '0');
        formData.append('PartyId', this.CounterSaleFilterData.value.PartyNameAndCode || '');
        formData.append('BrandId', sessionStorage.getItem('brandid') || '');

        this.countersaleservice.BulkUploadCounterSale(formData).subscribe({
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
            this.CounterSaleMultiExcel = null;
            this.fum.clear();
            this.CounterSaleFilterData.reset();
            this.globalBlockUiService.stopLoading();
          },
          error: (err: any) => {

            console.error("Upload failed:", err);
            this.CounterSaleMultiExcel = null;
            this.fum.clear();
            this.CounterSaleFilterData.reset();
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
                //this.showErrorsTable = false;
              }
            } else {
              this.Result = "Something went wrong while Uploading data.";
              this.visible = true;
            }
          }
        })
      }
      else {
        this.CounterSaleFilterData.markAllAsTouched();

      }
    }
    else {

      if (this.CounterSaleFilterData.valid) {
        this.globalBlockUiService.startLoading();
        const partsArray = this.AddPartWise.get('parts') as FormArray;
        console.log("single Add ", partsArray.value);

        const payload = partsArray.value.map((parts: any) => {
          return {

            LocationId: this.CounterSaleFilterData.value.Location || '',
            OrderType: this.CounterSaleFilterData.value.OrderType || '',
            PartyId: this.CounterSaleFilterData.value.PartyNameAndCode || '',
            PartNumber: parts.PartNumber,
            Qty: parts.Quantity,
            Remarks: parts.Remark,
            userId: sessionStorage.getItem('userid') || ''
          }
        })
        this.countersaleservice.SingleAddCounterSale({ BrandId: sessionStorage.getItem('brandid') || '', payload }).subscribe({
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
            this.CounterSaleFilterData.reset();
            this.globalBlockUiService.stopLoading();
            this.AddPartWise.reset();

          },
          error: (err: any) => {
            console.error("Upload failed:", err);
            this.CounterSaleFilterData.reset();
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
        this.CounterSaleFilterData.markAllAsTouched();
        this.AddPartWise.markAllAsTouched();
      }
    }
  }



  SendOrderRequestData() {

    if (this.selectedRows.length > 0) {

      this.globalBlockUiService.startLoading();
      this.countersaleservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'S', payload: this.selectedRows }).subscribe({
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
    this.CounterSaleFilterData.reset()
  }
  ResetBulk() {
    this.CounterSaleFilterDataBulk.reset();
    this.fu.clear()
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

  blockZero(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value === '0' || input.value.startsWith('0')) {
      input.value = '';
    }
  }








}
