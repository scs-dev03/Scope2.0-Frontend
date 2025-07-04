import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock-order-request',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './stock-order-request.component.html',
  styleUrl: './stock-order-request.component.css'
})
export class StockOrderRequestComponent {

  AddPartWise: FormGroup

  constructor(private fb: FormBuilder) {
    this.AddPartWise = this.fb.group({
      PartNumber: (''),
      Quantity: (''),
      Remark: ('')
    })
  }


  private createPart(): FormGroup {
    return this.fb.group({
      PartNumber: (''),
      Quantity: (''),
      Remark: ('')

    });
  }

  selectedSalesType: any

  SampleExcelDownload() {

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
    console.log(this.AddPartWise.value);
  }

  OnAddRows() {

  }

}
