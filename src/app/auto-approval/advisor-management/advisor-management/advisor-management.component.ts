import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';

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



  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }


}
