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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
      Location: [null],
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
  }, {
    Name: 'Internal Approval',
    id: 'I'
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
   

    const ponumber = prompt("Enter PO Number:");
    if (ponumber !== null && ponumber.trim() !== "") {
      console.log("PO Number entered:", ponumber);

      this.orderstatusservice.SendYesOrNo({ POnumber: ponumber, DealerId: sessionStorage.getItem('dealerid') || '', bigid: rowData.bigid, scs_status: rowData.SCS_Status, orderplace: "YES" }).subscribe({
        next: (res: any) => {
          console.log("PO Number sent successfully:", res);
          this.Result = 'PO Number submitted successfully.';
          this.visible = true;
          
        },
        error: (err) => {
          console.error("Error sending PO Number:", err);
          this.Result = 'Error submitting PO Number. Please try again.';
          this.visible = true;
         
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
        else {
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
        this.visible = true;
        this.globalBlockUiService.stopLoading();
        this.TableViewData = res.data;
        if (this.TableViewData.length > 0) {
          this.visibleTable = true;
        }
        else {
          this.Result = 'No Data Avaiable'
          this.visible = true;
          this.visibleTable = false;
        }
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
    //console.log("orderstatus" + this.OrderStatusInput.value);
    const partnumber = this.OrderStatusInput.value.PartNumber
    const vehiclenumber = this.OrderStatusInput.value.VehicleNumber
    const jobcardno = this.OrderStatusInput.value.JobCardNumber

    if(this.OrderStatusInput.value.PartNumber != null){
      partnumber.split(',')
      this.OrderStatusInput.get('PartNumber')?.patchValue(partnumber.split(','))      
    }
    if(this.OrderStatusInput.value.JobCardNumber != null){
      jobcardno.split(',')
      this.OrderStatusInput.get('JobCardNumber')?.patchValue(jobcardno.split(','))      
    }
    if(this.OrderStatusInput.value.VehicleNumber != null){
      vehiclenumber.split(',')
      this.OrderStatusInput.get('VehicleNumber')?.patchValue(vehiclenumber.split(','))      
    }

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
    const pattern = /^[a-zA-Z0-9\s,]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

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


  private readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  ExportTableData() {
    if (this.TableViewData) {

      const exportData = this.TableViewData.map((item: any) => ({

        'Location': item.Location,
        'Part Number': item.PartNumber,
        'Latest Part Number': item.Latest,
        'Vehicle Number': item.VehicleNumber,
        'Vehicle Model': item.VehicleModel,
        'JobCard Number': item.JobcardNumber,
        'SCS_Status': item.SCS_Status,
        'Request Type': item.RequestType,
        'Part Description': item.Partdesc,
        'MOQ': item.MOQ,
        'Quantity': item.Qty,
        'Price': item.Price,
        'Stock': item.Stock,
        'Current Stock': item.CurrentStock,
        'Group Stock': item.Group_stock,
        'Current Group Stock': item.CurrentGroupStock,
        'Order Value': item.Ordervalue,
        'Job Card Open Date': item.jobcardopendate,
        'Job Card Close Date': item.Final_Close_Date,
        'Job Line Close Date': item.JobLineCloseDate,
        'Date Added': item.Dateadded,
        'SCS Remark': item.SCS_Remarks,
        'JobCard Type': item.jobcart_type,
        'Order Type': item.OrderType,
        'Is Substitution': item.isSubstitution
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Orders': worksheet },
        SheetNames: ['Orders']
      };


      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
      saveAs(data, 'VehicleOrders_' + new Date().getTime() + '.xlsx');

    }


  }


  shouldShowVehicleColumn(): boolean {
    const requestType = this.OrderStatusInput.get('RequestType')?.value;

    // Agar value null hai to false
    if (!requestType) return false;

    // Case 1: RequestType ek single string ho sakti hai ("S" ya "V")
    // Case 2: RequestType ek array ho sakti hai (["S", "V"])
    if (Array.isArray(requestType)) {
      return requestType.includes('V'); // agar array me "V" hai to dikhao
    } else {
      return requestType === 'V'; // agar sirf "V" hai to dikhao
    }
  }





}


