import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-calculative-parameters',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './calculative-parameters.component.html',
  styleUrl: './calculative-parameters.component.css'
})
export class CalculativeParametersComponent {

  visible:boolean = true

  first: number = 0;
  
    rows: number = 10;
  
    onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
    }
  

}
