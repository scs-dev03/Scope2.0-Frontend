import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-order-status',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css'
})
export class OrderStatusComponent {
   
    ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('Order Status')
  }
   OrderStatusInput: FormGroup
  constructor(private sharedService: SharedServiceService , private fb: FormBuilder) {
    this.OrderStatusInput = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      OrderType: [''],
      JobCardNumber: [''],
      PartNumber: [''],
      VehicleNumber: [''],
      AdvisorName: [''],
      FloorSupervisor: [''],
      CustomFilter: [''],
      TableFilter: ['']
    })

   }



 







  ColummnData = [
    { "field": "sNo", "header": "S.No" },
    { "field": "approvalId", "header": "Approval ID" },
    { "field": "location", "header": "Location" },
    { "field": "partNumber", "header": "Part Number" },
    { "field": "latestPartNumber", "header": "Latest Part Number" },
    { "field": "substitution", "header": "Substitution" },
    { "field": "vehicleNumber", "header": "Vehicle Number" },
    { "field": "vehicleModel", "header": "Vehicle Model" },
    { "field": "jobCardNumber", "header": "Job Card Number" },
    { "field": "jobCardType", "header": "Job Card Type" },
    { "field": "advisorName", "header": "Advisor Name" },
    { "field": "floorSupervisor", "header": "Floor Supervisor" },
    { "field": "jobCardType2", "header": "Job Card Type" },
    { "field": "orderType", "header": "Order Type." },
    { "field": "requestType", "header": "Request Type" },
    { "field": "partDescription", "header": "Part Description" },
    { "field": "moq", "header": "MOQ" },
    { "field": "quantity", "header": "Quantity" },
    { "field": "price", "header": "Price" },
    { "field": "originalStock", "header": "Orignal Stock." },
    { "field": "stock", "header": "Stock" },
    { "field": "groupStock", "header": "Group Stock" },
    { "field": "latestGroupStock", "header": "Latest Group Stock" },
    { "field": "orderValue", "header": "Order Value" },
    { "field": "orderingDate", "header": "Ordering Date" },
    { "field": "stockable", "header": "Stockable" },
    { "field": "gmApproval", "header": "GM Approval" },
    { "field": "gmRemarks", "header": "GM Remarks" },
    { "field": "poNumber", "header": "PO Number" },
    { "field": "jobCardOpenDate", "header": "JobCard Open Date" },
    { "field": "jobCardCloseDate", "header": "JobCard Close Date" },
    { "field": "jobLineCloseDate", "header": "JobLine Close Date" },
    { "field": "jobLineUpdateDate", "header": "JobLine Update Date" },
    { "field": "ooqDate", "header": "OOQ Date" },
    { "field": "scsApproval", "header": "SCS Approval" },
    { "field": "scsRemarks", "header": "SCS Remarks" },
    { "field": "openJoblineWithOpenJC", "header": "Open Jobline with Open JC" },
    { "field": "joblineStatus", "header": "Jobline Status" },
    { "field": "jobcardStatus", "header": "Jobcard Status" },
    { "field": "orderRemarks", "header": "Order Remarks" },
    { "field": "orderPlace", "header": "Order Place" },
    { "field": "reOrder", "header": "Re-Order" }
  ]


  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  visible: boolean = false;

  onClickView() {
    if (this.visible !== true) {
      this.visible = true;
    }
    else {
      this.visible = false;
    }
    console.log(this.OrderStatusInput.value);
    
  }

  MaxOrPending: boolean = true;

  onClickToggle(event: any) {
    this.MaxOrPending = event.checked;
    console.log(this.MaxOrPending);
  }



}
