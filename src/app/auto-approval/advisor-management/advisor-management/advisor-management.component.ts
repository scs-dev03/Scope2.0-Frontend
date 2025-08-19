import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-advisor-management',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './advisor-management.component.html',
  styleUrl: './advisor-management.component.css'
})
export class AdvisorManagementComponent {


  Advisor: any = ''

  onclickSave(){
    console.log(this.Advisor);
    
  }

  showtable: boolean = false
  onClickShowTable(){
    if(this.showtable === true){
      this.showtable = false
    }
    else{
      this.showtable = true
    }

  }

    SampleExcelDownload() {
    
        const Data = [
          {
            'Advisor Name': '',
            'Phone Number': '',
            'Email': '',

            
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


}
