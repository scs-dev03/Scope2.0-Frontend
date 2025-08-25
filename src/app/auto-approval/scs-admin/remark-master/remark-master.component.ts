import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-remark-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './remark-master.component.html',
  styleUrl: './remark-master.component.css'
})
export class RemarkMasterComponent {


  remarkForm!: FormGroup;


  constructor(private fb: FormBuilder) {
  this.remarkForm = this.fb.group({
    user: [null],
    brand: [null],
    dealer: [null],
    location: [null],
    remark: ['']
  });
}
  onSave() {
    console.log(this.remarkForm.value);
  }


    first: number = 0;
  
    rows: number = 10;
  
    onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
    }
  
  
  
    showTable: boolean = false;

    onClickViewRemarkTable() {
      if (this.showTable !== true) {
        this.showTable = true;
      } else {
        this.showTable = false;
      }
    }

}
