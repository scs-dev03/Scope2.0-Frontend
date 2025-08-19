import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';

@Component({
  selector: 'app-all-approvals',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './all-approvals.component.html',
  styleUrl: './all-approvals.component.css'
})
export class AllApprovalsComponent {
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('All Approvals Stock Order')

  }


  constructor(private sharedService: SharedServiceService) { }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
