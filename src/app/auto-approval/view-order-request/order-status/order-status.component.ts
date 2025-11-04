import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { OrderStatusService } from '../../../services/Auto-Approvals/order-status.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";

@Component({
  selector: 'app-order-status',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, DividerModule, IconField, InputIcon],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css'
})
export class OrderStatusComponent {

  ngOnInit(): void {
    this.fetchlocation();
    this.fetchOrderType();
    this.sharedService.updateModuleName('Order Status')

    this.OrderStatusInput.patchValue({
      FromDate: this.firstDayOfMonth
    });
    console.log(this.firstDayOfMonth);

  }

  Result: any;
  OrderStatusInput: FormGroup
  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');

  constructor(private sharedService: SharedServiceService, private fb: FormBuilder, private orderstatusservice: OrderStatusService, private globalBlockUiService: GlobalBlockUiService) {
    this.OrderStatusInput = this.fb.group({
      Location: [null, Validators.required],
      FromDate: [null],
      ToDate: new Date().toISOString().split('T')[0],
      OrderType: [null],
      Status: [null],
      PartNumber: [null],
      JobCardNumber: [null],
      VehicleNumber: [null],
      AdvisorName: [null],
      RequestType: [null]
    })

  }

  RequestTypeData = [{
    Name: 'Stock',
    id: 'S'
  }, {
    Name: 'Vechile',
    id: 'V'
  }]

  StatusData = [{
    Name: 'Decline',
    id: 'D'
  }, {
    Name: 'Approve',
    id: 'A'
  }, {
    Name: 'Pending',
    id: 'P'
  }]


  searchValue: string | undefined;
  @ViewChild('dt1') dt1: any;

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  onGlobalFilter(event: Event) {


    const value = (event.target as HTMLInputElement)?.value || '';
    console.log(value);

    this.dt1.filterGlobal(value, 'contains');
  }



  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.orderstatusservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }


  OrderTypeData: any

  fetchOrderType() {
    this.globalBlockUiService.startLoading();
    this.orderstatusservice.getOrderType().subscribe({
      next: (res: any) => {
        this.OrderTypeData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching Order Type data:", err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }

  OnclickLoation() {
    this.fetchAdvisorData(this.OrderStatusInput.value.Location);
  }

  selectedRows: any[] = [];

  AdvisorData: any
  fetchAdvisorData(LocationId: any) {
    this.globalBlockUiService.startLoading();

    this.orderstatusservice.getAdvisor({ LocationId }).subscribe({
      next: (res: any) => {

        this.AdvisorData = res.data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  OnclickYesInputPONumber(rowData: any) {
    console.log("Row data:", rowData);
    this.globalBlockUiService.startLoading();

    const ponumber = prompt("Enter PO Number:");
    if (ponumber !== null && ponumber.trim() !== "") {
      console.log("PO Number entered:", ponumber);

      this.orderstatusservice.SendYesOrNo({ POnumber: ponumber, DealerId: sessionStorage.getItem('dealerid') || '', bigid: rowData.bigid, scs_status: rowData.SCS_Status, orderplace: "YES" }).subscribe({
        next: (res: any) => {
          console.log("PO Number sent successfully:", res);
          this.Result = 'PO Number submitted successfully.';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          console.error("Error sending PO Number:", err);
          this.Result = 'Error submitting PO Number. Please try again.';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        }
      });
    } else {
      console.log("PO Number input cancelled or empty.");
    }
  }

  OnClickReOrder(rowData: any) {
    this.globalBlockUiService.startLoading();
    const Remark = prompt("Enter Re Order Remark:");
    if (Remark !== null && Remark.trim() !== "") {
      console.log("Re Order Remark entered:", Remark);

      this.orderstatusservice.SendOrderRemark({ DealerId: sessionStorage.getItem('dealerid') || '', bigid: rowData.bigid, remark: Remark }).subscribe({
        next: (res: any) => {
          console.log("Re Order Remark sent successfully:", res);
          this.Result = 'Re Order Remark submitted successfully.';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          console.error("Error sending Re Order Remark:", err);
          this.Result = 'Error submitting Re Order Remark. Please try again.';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        }
      })
    }

  }



  OnClickNo(rowData: any) {
    console.log("Row data:", rowData);
    this.globalBlockUiService.startLoading();

    this.orderstatusservice.SendYesOrNo({ POnumber: null, DealerId: sessionStorage.getItem('dealerid') || '', bigid: rowData.bigid, scs_status: rowData.SCS_Status, orderplace: "NO" }).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.Result = 'Success';
          this.visible = true;
        }
        else{
          this.Result = "No Data Available";
          this.visible = true;
        }
        this.globalBlockUiService.stopLoading();
      },
      error: (err) => {
        console.error("Error sending PO Number:", err);
        this.Result = 'Error submitting PO Number. Please try again.';
        this.visible = true;
        this.globalBlockUiService.stopLoading();
      }
    });

  }



  TableViewData: any
  fetchViewOrderStatusData(DealerId: any, LocationIds: any, RequestType: any, From: any, To: any, OrderTypeIds: any, PartNumbers: any, VehicleNumbers: any, JobCardNumbers: any, AdvisorIds: any, Status: any) {
    this.globalBlockUiService.startLoading();
    this.orderstatusservice.fetchViewOrderStatusData({
      DealerId, LocationIds, RequestType, From, To, OrderTypeIds, PartNumbers, VehicleNumbers, JobCardNumbers, AdvisorIds, Status
    }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.visibleTable = true;
        this.Result = 'Data Fetched successfully.';
        this.globalBlockUiService.stopLoading();
        this.TableViewData = res.data;
      },
      error: (err: any) => {
        console.error("Error fetching View Order Status data:", err);
        this.visibleTable = true;
        this.Result = 'Error fetching data. Please try again.';
        this.globalBlockUiService.stopLoading();
      }
    })
  }

  OnClickViewOrderStatus() {
    console.log("orderstatus" + this.OrderStatusInput.value);
    this.fetchViewOrderStatusData(
      sessionStorage.getItem('dealerid') || '',
      this.OrderStatusInput.value.Location,
      this.OrderStatusInput.value.RequestType,
      this.OrderStatusInput.value.FromDate,
      this.OrderStatusInput.value.ToDate,
      this.OrderStatusInput.value.OrderType,
      this.OrderStatusInput.value.PartNumber,
      this.OrderStatusInput.value.VehicleNumber,
      this.OrderStatusInput.value.JobCardNumber,
      this.OrderStatusInput.value.AdvisorName,
      this.OrderStatusInput.value.Status
    )

  }


  allowOnlyLettersAndNumber(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
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



  visibleTable: boolean = false;
  MaxOrPending: boolean = true;

  onClickToggle(event: any) {
    this.MaxOrPending = event.checked;
    console.log(this.MaxOrPending);
  }


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

  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }



}
