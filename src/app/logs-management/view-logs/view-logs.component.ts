import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-view-logs',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './view-logs.component.html',
  styleUrl: './view-logs.component.css'
})
export class ViewLogsComponent {
   first: number = 0;
  
    rows: number = 10;
  
    onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 10;
    }
  

}
