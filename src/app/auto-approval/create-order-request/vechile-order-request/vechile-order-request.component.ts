import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-vechile-order-request',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './vechile-order-request.component.html',
  styleUrl: './vechile-order-request.component.css'
})
export class VechileOrderRequestComponent {

  AddPartWise: FormGroup

  constructor(private fb: FormBuilder) {
    this.AddPartWise = this.fb.group({
      PartNumber: (''),
      Quantity: (''),
      Remark: ('')
    })
  }



  SampleExcelDownload() {
  
      const Data = [
        {
          'Vehicle_Number': '',
          'Vehicle_Model': '',
          'Job_Card_Number': '',
          'Advisor': '',
          'JOb_Card_Type': '',
          'Order_Type': ''
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
}
