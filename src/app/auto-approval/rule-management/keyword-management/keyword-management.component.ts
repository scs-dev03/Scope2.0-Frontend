import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-keyword-management',
  imports: [SHARED_IMPORTS,PrimengModuleModule,SharedModule],
  templateUrl: './keyword-management.component.html',
  styleUrl: './keyword-management.component.css'
})
export class KeywordManagementComponent {

  visible: boolean = false;
  
     showDialog() {
          this.visible = true;
      }
  
      first: number = 0;
  
      rows: number = 10;
  
      onPageChange(event: PaginatorState) {
          this.first = event.first ?? 0;
          this.rows = event.rows ?? 10;
      }

}
