import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-stock-order-request',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './stock-order-request.component.html',
  styleUrl: './stock-order-request.component.css'
})
export class StockOrderRequestComponent {

  AddPartWise: FormGroup
  visible:boolean = false;

  constructor(private fb: FormBuilder, private config: PrimeNG, private messageService: MessageService) {
    this.AddPartWise = this.fb.group({
      PartNumber: (''),
      Quantity: (''),
      Remark: ('')
    })


  }

  
    first: number = 0;
    rows: number = 10;
  
    onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
    }


  private createPart(): FormGroup {
    return this.fb.group({
      PartNumber: (''),
      Quantity: (''),
      Remark: ('')

    });
  }

  selectedSalesType: any

  
  WorkShopBulkSampleExcelDownload() {

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
  CounterSaleMultiPartSampleExcelDownload() {

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

    totalSize : number = 0;

    totalSizePercent : number = 0;

    choose(event: Event, callback: () => void): void {
      callback();
    }

    onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear: any) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event: any) {
        this.files = event.currentFiles;
        this.files.forEach((file: any) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback : any) {
        callback();
    }

    formatSize(bytes: any) {
        const k = 1024;
        const dm = 3;
       const sizes = this.config?.translation?.fileSizeTypes ?? ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
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


}
