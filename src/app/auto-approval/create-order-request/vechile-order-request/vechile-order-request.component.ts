import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PaginatorState } from 'primeng/paginator';
import { CreateOrderViewServiceService } from '../../../services/Auto-Approvals/create-order-view-service.service';


@Component({
  selector: 'app-vechile-order-request',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './vechile-order-request.component.html',
  styleUrl: './vechile-order-request.component.css'
})
export class VechileOrderRequestComponent {
  ngOnInit(): void {
    this.addPart()
  }


  AddPartWise: FormGroup
  VechileOrderRequestInput: FormGroup

  constructor(private fb: FormBuilder,private createorderviewservice: CreateOrderViewServiceService) {
    this.AddPartWise = this.fb.group({
      parts: this.fb.array([]) 
    });

    this.VechileOrderRequestInput = this.fb.group({
      VechileNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]],
      VechileModel: ['', Validators.required],
      JobCardNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{15}$/)]],
      JobCardType: ['', Validators.required],
      Advisor: ['', Validators.required],
      OrderType: ['', Validators.required],
    })
  }

  get parts() {
    return this.AddPartWise.get('parts') as FormArray;
  }

  addPart() {
    const part = this.fb.group({
      PartNumber: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Remark: ['', [Validators.required]],
    });

    this.parts.push(part);
  }

  removePart(index: number) {
    this.parts.removeAt(index);
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



  first: number = 0;
  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  visible:boolean = false;
  OnClickAdd() {
    this.visible = true;
  }



  visibleConfig: boolean = false;
    showDialogconfig() {
    this.visibleConfig = true;
  }
  // Table headers list
tableColumns = [
  { field: 'sno', header: 'S.No' },
  { field: 'partNumber', header: 'Part Number' },
  { field: 'latestPartNumber', header: 'Latest Part Number' },
  { field: 'substituition', header: 'Substituition' },
  { field: 'lastUpdated', header: 'Last Updated' },
  { field: 'category', header: 'Category' },
  { field: 'partDescription', header: 'Part Description' },
  { field: 'moq', header: 'MOQ' },
  { field: 'qty', header: 'Qty' },
  { field: 'price', header: 'Price' },
  { field: 'originalStock', header: 'Original Stock' },
  { field: 'stockAsOnDate', header: 'Stock as on Date' },
  { field: 'groupStock', header: 'Group Stock' },
  { field: 'latestGroupStock', header: 'Latest Group Stock' },
  { field: 'nonMovingCheck', header: 'Non Moving Check' },
  { field: 'sixMonthCS', header: '6 Month CS' },
  { field: 'sixMonthWS', header: '6 Month WS' },
  { field: 'sixMonthCSBrand', header: '6 Month CS Brand' },
  { field: 'sixMonthWSBrand', header: '6 Month WS Brand' },
  { field: 'maxValue', header: 'Max Value' },
  { field: 'ooq', header: 'OOQ' },
  { field: 'orderDate', header: 'Order Date' },
  { field: 'orderValue', header: 'Order Value' },
  { field: 'orderRemarks', header: 'Order Remarks' },
  { field: 'reOrderRemark', header: 'Re Order Remark' },
  { field: 'autoApprovalLogs', header: 'Auto Approval Logs' },
  { field: 'remarksDropdown', header: 'Remarks Dropdown' },
  { field: 'actionFields', header: 'Action Fields' }
];

// Initially all columns selected
selectedColumns: string[] = this.tableColumns.map(c => c.field);


onUploadExcel(event: any) {
  const formData = new FormData();
  formData.append('file', event.files[0]);
  formData.append('userId', sessionStorage.getItem('userid') || '');
  formData.append('LocationId', sessionStorage.getItem('headerlocation') || '');



  // Backend call
  this.createorderviewservice.BulkUploadVehicle(formData).subscribe({
    next: (res) => {
      console.log("Upload Success", res);
    },
    error: (err) => {
      console.error("Upload Failed", err);
    }
  });
}


}



