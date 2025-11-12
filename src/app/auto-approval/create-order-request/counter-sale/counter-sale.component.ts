import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, FormsModule } from '@angular/forms';

import { SharedModule, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PrimeNG } from 'primeng/config';
import { DividerModule } from 'primeng/divider';
import { PaginatorState } from 'primeng/paginator';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { CounterSaleService } from '../../../services/Auto-Approvals/counter-sale.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-counter-sale',
  imports: [SHARED_IMPORTS, Popover, PrimengModuleModule, SharedModule, DividerModule, FormsModule, IconField, InputIcon],
  templateUrl: './counter-sale.component.html',
  styleUrl: './counter-sale.component.css'
})
export class CounterSaleComponent {
  TableViewData: any = [];
  visibleTableData: boolean = false;

  ngOnInit(): void {
    this.addParts()
    this.fetchlocation()
    this.fetchOrderType()
    // this.TableViewData = [
    //   {
    //     "Id": "1",
    //     "LocationId": "14",
    //     "PartNumber": "0107FR0020N",
    //     "Latest": "0107FR0020N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "GROMMET BRAKE TUBE",
    //     "MOQ": "5",
    //     "Qty": 2,
    //     "Price": 2.35,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 4.7,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "2",
    //     "LocationId": "14",
    //     "PartNumber": "0107FR0030N",
    //     "Latest": "0107FR0030N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "GROMMET WIPER KIT RH",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 21.04,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 42.08,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "3",
    //     "LocationId": "14",
    //     "PartNumber": "0107FS200020N",
    //     "Latest": "0107FS200020N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "SEAL FENDER LH",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 122.1,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 244.2,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "4",
    //     "LocationId": "14",
    //     "PartNumber": "0107FS200040N",
    //     "Latest": "0107FS200040N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "SEAL FENDER RH",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 122.1,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 244.2,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "5",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0480N",
    //     "Latest": "0304DG0480N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE RADIATOR OUTLET(IFS)",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 432.86,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 865.72,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "6",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0490N",
    //     "Latest": "0304DG0490N",
    //     "isSubstitution": "Y",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE VENT DEGASSING TANK TO RADIATOR",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 56.94,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 113.88,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "7",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0510N",
    //     "Latest": "0304DG0510N",
    //     "isSubstitution": "N",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE ASSY DEGASSING TANK",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 177.86,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 355.72,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "8",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0580N",
    //     "Latest": "0304DG0580N",
    //     "isSubstitution": "Y",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE RADIATOR INLET",
    //     "MOQ": "1",
    //     "Qty": 4,
    //     "Price": 140.89,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 563.56,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "9",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0580N",
    //     "Latest": "0304DG0580N",
    //     "isSubstitution": "Y",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE RADIATOR INLET",
    //     "MOQ": "1",
    //     "Qty": 4,
    //     "Price": 140.89,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 563.56,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "10",
    //     "LocationId": "14",
    //     "PartNumber": "0304DG0580N",
    //     "Latest": "0304DG0580N",
    //     "isSubstitution": "Y",
    //     "PartType": "Spare Part",
    //     "PartDesc": "HOSE RADIATOR INLET",
    //     "MOQ": "1",
    //     "Qty": 4,
    //     "Price": 140.89,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 563.56,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "11",
    //     "LocationId": "14",
    //     "PartNumber": "0703DBA0002ST",
    //     "Latest": "0703DBA0002ST",
    //     "isSubstitution": "N",
    //     "PartType": "Tool",
    //     "PartDesc": "COUNTER SHAFT DGBB PRESSING TOOL",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 627.75,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 1255.5,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "12",
    //     "LocationId": "14",
    //     "PartNumber": "0703DBA0003ST",
    //     "Latest": "0703DBA0003ST",
    //     "isSubstitution": "N",
    //     "PartType": "Tool",
    //     "PartDesc": "COUNTER SHAFT DGBB PRESSING DOLLY",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 1668.14,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 3336.28,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "13",
    //     "LocationId": "14",
    //     "PartNumber": "100001",
    //     "Latest": "100001",
    //     "isSubstitution": "Y",
    //     "PartType": "Tool",
    //     "PartDesc": "TOOL EXTRACTOR FOR 5TH GEAR PINION ON SE",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 10261.11,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 20522.22,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "14",
    //     "LocationId": "14",
    //     "PartNumber": "101",
    //     "Latest": "101",
    //     "isSubstitution": "N",
    //     "PartType": "Consumable",
    //     "PartDesc": "TUBE TYPE BULB",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 8,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 16,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "15",
    //     "LocationId": "14",
    //     "PartNumber": "101800",
    //     "Latest": "101800",
    //     "isSubstitution": "Y",
    //     "PartType": "Tool",
    //     "PartDesc": "TOOL 8MM SQUARE SUMP DRAIN SPANNER",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 3504.52,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 7009.04,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "16",
    //     "LocationId": "14",
    //     "PartNumber": "A93500029",
    //     "Latest": "A93500029",
    //     "isSubstitution": "N",
    //     "PartType": "Genuine Accessory",
    //     "PartDesc": "BRACKET ASSEMBLY HELPER SPRING",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 0,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 0,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "17",
    //     "LocationId": "14",
    //     "PartNumber": "A93500032P1",
    //     "Latest": "A93500032P1",
    //     "isSubstitution": "Y",
    //     "PartType": "Genuine Accessory",
    //     "PartDesc": "BRKT ASSY SHOCK ABS FR LH",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 234.65,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 469.3,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "18",
    //     "LocationId": "14",
    //     "PartNumber": "A93500033",
    //     "Latest": "A93500033P1",
    //     "isSubstitution": "Y",
    //     "PartType": "Genuine Accessory",
    //     "PartDesc": "BRKT ASSY SHOCK ABS FR RH",
    //     "MOQ": "1",
    //     "Qty": 2,
    //     "Price": 211.91,
    //     "Stock": 0,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 0,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 423.82,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 0,
    //     "Remarks": "okay2"
    //   },
    //   {
    //     "Id": "19",
    //     "LocationId": "14",
    //     "PartNumber": "EOVULTRA210",
    //     "Latest": "EOVULTRA210",
    //     "isSubstitution": "N",
    //     "PartType": "Lubricant",
    //     "PartDesc": "MAXIMILE ULTRA V4 BARREL",
    //     "MOQ": "1",
    //     "Qty": 12,
    //     "Price": 313.39,
    //     "Stock": 100,
    //     "StockDate": "2025-08-08T00:00:00.000Z",
    //     "GroupStock": 3667.65,
    //     "PartyCode": "5444new",
    //     "PartyName": "Test1",
    //     "OrderType": "Normal",
    //     "OrderValue": 3760.68,
    //     "OrderDate": "2025-11-05T15:22:03.260Z",
    //     "NonMoving": 100,
    //     "Remarks": "okay1, okay2"
    //   }
    // ]

    // this.visibleTableData = true;

  }



  AddPartWise: FormGroup
  visible: boolean = false;
  Result: any

  constructor(private router: Router, private fb: FormBuilder, private config: PrimeNG, private globalBlockUiService: GlobalBlockUiService, private messageService: MessageService, private countersaleservice: CounterSaleService) {
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
        'Qty': '',
        'Remarks': '',

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
        'Qty': '',
        'Remarks': '',
        'PartyName': '',
        'PartyCode': ''
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
      formData.append('DealerId', sessionStorage.getItem('dealerid') || '');

      this.countersaleservice.BulkUploadCounterSale(formData).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;

          this.TableViewData = res.data.result;
          this.StockAsOnDate = res.data.result[0].StockDate;
          this.visibleTableData = true;

           if (this.TableViewData.length > 0) {
              this.visibleTableData = true;
            }
            else{
              this.visibleTableData = false;
            }

          if (res.data?.notinMaster.length > 0) {
            this.VisibleNotInMaster = true;
            this.visible = false;
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
  StockAsOnDate: any;


  OnClickMultiUploadAndSend() {
    if (this.AddPartWise.invalid || this.CounterSaleFilterData.invalid) {
      this.AddPartWise.markAllAsTouched()
      this.CounterSaleFilterData.markAllAsTouched()

    }
    if (this.MultiUpload) {

      if (this.CounterSaleFilterData.valid && this.CounterSaleMultiExcel) {
        this.globalBlockUiService.startLoading();
        const formData = new FormData();
        formData.append('file', this.CounterSaleMultiExcel);
        formData.append('userId', sessionStorage.getItem('userid') || '');
        formData.append('LocationId', this.CounterSaleFilterData.value.Location || '');
        formData.append('OrderType', this.CounterSaleFilterData.value.OrderType || '');
        formData.append('Bulk', '0');
        formData.append('PartyId', this.CounterSaleFilterData.value.PartyNameAndCode || '');
        formData.append('DealerId', sessionStorage.getItem('dealerid') || '');
        formData.append('BrandId', sessionStorage.getItem('brandid') || '');

        this.countersaleservice.BulkUploadCounterSale(formData).subscribe({
          next: (res: any) => {

            this.Result = res.message
            this.visible = true;


            this.TableViewData = res.data.result;
            this.StockAsOnDate = res.data.result[0].StockDate;
            console.log("Stock Date ", this.StockAsOnDate);
            this.visibleTableData = true;
            if (this.TableViewData.length > 0) {
              this.visibleTableData = true;
            }
            else{
              this.visibleTableData = false;
            }
            if (res.data?.notinMaster.length > 0) {
              this.VisibleNotInMaster = true;
              this.visible = false;

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
      // single Add in counter sale
      if (this.CounterSaleFilterData.valid && this.AddPartWise.valid) {
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
        this.countersaleservice.SingleAddCounterSale({ DealerId: sessionStorage.getItem('dealerid'), BrandId: sessionStorage.getItem('brandid') || '', payload }).subscribe({
          next: (res: any) => {

            this.Result = res.message
            this.visible = true;
            this.TableViewData = res.data.result;
            if (this.TableViewData.length > 0) {
              this.visibleTableData = true;
            }
            else{
              this.visibleTableData = false;
            }

            if (res.data?.notinMaster.length > 0) {

              this.VisibleNotInMaster = true;
              this.visible = false;

              this.NotInMasterPartNumber = res.data?.notinMaster.map((part: any) => {
                return part.PartNumber
              })
            }
            this.CounterSaleFilterData.reset();
            this.globalBlockUiService.stopLoading();
            this.AddPartWise.reset();
            this.StockAsOnDate = res.data.result[0].StockDate;

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

  canAddMoreParts(): boolean {
    const partsArray = this.AddPartWise.get('parts') as FormArray;
    if (!partsArray || partsArray.length === 0) return false;

    const lastPart = partsArray.at(partsArray.length - 1);

    const partNumber = lastPart.get('PartNumber')?.value?.trim();
    const quantity = lastPart.get('Quantity')?.value;

    return !!partNumber && !!quantity && lastPart.valid;
  }

  SendOrderRequestData() {

    if (this.selectedRows.length > 0) {

      this.globalBlockUiService.startLoading();
      this.countersaleservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'S', payload: this.selectedRows }).subscribe({
        next: (res: any) => {
          this.Result = res.message
          this.visible = true;
          this.TableViewData = []
          this.visibleTableData = false;
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

  SendOrderRequestSingle(rowData: any) {
    console.log(rowData.value);

    this.globalBlockUiService.startLoading();
    this.countersaleservice.sendOrderRequest({ userId: sessionStorage.getItem('userid'), type: 'S', payload: [rowData] }).subscribe({
      next: (res: any) => {
        this.Result = res.message
        this.visible = true;
        this.selectedRows = []
        this.globalBlockUiService.stopLoading()
        this.TableViewData = this.TableViewData.filter((item: any) => item.Id != rowData.Id)
        if(this.TableViewData.length == 0)
        {
          this.visibleTableData = false;
        }
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


  RemoveSingleRow(rowData: any) {
    this.TableViewData = this.TableViewData.filter((item: any) => item.Id != rowData.Id)
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
    this.countersaleservice.getGroupStockData({ DealerId, PartNumber, BrandId, LocationId }).subscribe({
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


  NonMovingData: any = [
    {
      "LOCATION": "Kalikapur",
      "QTY": 6,
      "DISCOUNT": 25,
      "Dealer": "Auto Carriage (Royal Mahindra)"
    }
  ]
  fetchNonMovingData(DealerId: any, partnumber: any, BrandId: any, LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.countersaleservice.getNonMovingData({ DealerId, partnumber, BrandId, LocationId }).subscribe({
      next: (res: any) => {
        this.NonMovingData
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
