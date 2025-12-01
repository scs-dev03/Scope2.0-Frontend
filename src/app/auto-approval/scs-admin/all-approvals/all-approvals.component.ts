import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder, private sharedService: SharedServiceService) {
    this.filterForm = this.fb.group({
      brand: [null],
      dealer: [null],
      location: [null],
      user: [null],
      status: [null],
      fromDate: [null],
      toDate: [null],
      orderType: [[]],   // multiselect = array
      pendingSince: [[]] // multiselect = array
    });
  }


  onView() {
    console.log(this.filterForm.value);
  }

  onReset() {
    this.filterForm.reset();
  }

  visible: boolean = false;

  
  
  first: number = 0;
  
  rows: number = 10;
  
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
  
  showDialog() {
    this.visible = true;
  }
  // Table headers list
tableColumns = [
  { field: 'sno', header: 'S.No' },
  { field: 'partNumber', header: 'Part Number' },
  { field: 'latestPartNumber', header: 'Latest Part Number' },
  { field: 'substituition', header: 'Substituition' },
  { field: 'lastUpdated', header: 'Last Updated' },
  { field: 'category', header: 'Category' },
  { field: 'partDescription', header: 'Part Description' },
  { field: 'moq', header: 'MOQ' },
  { field: 'qty', header: 'Qty' },
  { field: 'price', header: 'Price' },
  { field: 'originalStock', header: 'Original Stock' },
  { field: 'stockAsOnDate', header: 'Stock as on Date' },
  { field: 'groupStock', header: 'Group Stock' },
  { field: 'latestGroupStock', header: 'Latest Group Stock' },
  { field: 'nonMovingCheck', header: 'Non Moving Check' },
  { field: 'sixMonthCS', header: '6 Month CS' },
  { field: 'sixMonthWS', header: '6 Month WS' },
  { field: 'sixMonthCSBrand', header: '6 Month CS Brand' },
  { field: 'sixMonthWSBrand', header: '6 Month WS Brand' },
  { field: 'maxValue', header: 'Max Value' },
  { field: 'ooq', header: 'OOQ' },
  { field: 'orderDate', header: 'Order Date' },
  { field: 'orderValue', header: 'Order Value' },
  { field: 'orderRemarks', header: 'Order Remarks' },
  { field: 'reOrderRemark', header: 'Re Order Remark' },
  { field: 'autoApprovalLogs', header: 'Auto Approval Logs' },
  { field: 'remarksDropdown', header: 'Remarks Dropdown' },
  { field: 'actionFields', header: 'Action Fields' }
];

// Initially all columns selected
selectedColumns: string[] = this.tableColumns.map(c => c.field);

}
