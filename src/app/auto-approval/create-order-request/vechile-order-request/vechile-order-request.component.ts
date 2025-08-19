import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-vechile-order-request',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './vechile-order-request.component.html',
  styleUrl: './vechile-order-request.component.css'
})
export class VechileOrderRequestComponent {
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addPart()
  }

  AddPartWise: FormGroup
  VechileOrderRequestInput: FormGroup

  constructor(private fb: FormBuilder) {
    this.AddPartWise = this.fb.group({
      parts: this.fb.array([]) // FormArray to hold each part form group
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


}



