import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { ScsadminServiceService } from '../../../services/Auto-Approvals/scsadmin-service.service';

@Component({
  selector: 'app-all-approvals',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './all-approvals.component.html',
  styleUrl: './all-approvals.component.css'
})
export class AllApprovalsComponent {
  ngOnInit(): void {
    this.fetchBrandData();
    this.sharedService.updateModuleName('Approvals ')
    this.FetchUserData();
  }

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder,private scsadminservice: ScsadminServiceService,private globalBlockUiService: GlobalBlockUiService, private sharedService: SharedServiceService, private masterservice: MasterServiceService) {
    this.filterForm = this.fb.group({
      brand: [null],
      dealer: [null],
      location: [null],
      user: [null],
      status: [null],
      fromDate: [this.today],
      toDate: [this.firstDayOfMonth],
      orderType: [this.RequestTypeData.map(x => x.id)],   // multiselect = array
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

  
  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');


  RequestTypeData = [{
    Name: 'Stock',
    id: 'S'
  }, {
    Name: 'Vehicle',
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


  periodOptions = [
    { name: 'Last 30 Min', value: '30min' },
    { name: 'Last One hour', value: '1hr' },
    { name: 'Last Two hour', value: '2hr' },
    { name: 'Yesterday', value: 'lastWeek' },
  ];




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


BrandData: any

  fetchBrandData() {
    // this.globalBlockUiService.startLoading();
    this.masterservice.getBrandMaster().subscribe((res: any) => {
     
      this.BrandData = res;

      //this.globalBlockUiService.stopLoading();
      console.log(this.BrandData);
    });
  }
  OnclickBrand() {
    this.fetchDealerData(this.filterForm.value.brand)
  }

  DealerData: any
  // Fetch Dealer Data
  fetchDealerData(brandid: any) {
    //this.globalBlockUiService.startLoading();
    this.masterservice.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
       

        this.DealerData = res;
        this.DealerData.sort((a: any, b: any) =>
          a.dealer.localeCompare(b.dealer)
        );
        //this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching dealer data:', err);
        //this.globalBlockUiService.stopLoading();
      },
    });
  }
  OnClickDealer() {
    this.fetchlocation(this.filterForm.value.dealer)
  }



  LocationData: any
  fetchlocation(dealerid: any) {
    //this.globalBlockUiService.startLoading();
    this.masterservice.getlocationMaster({ dealerid: dealerid }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        //this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        //this.globalBlockUiService.stopLoading();
      }
    });
  }

  UserData: any

  FetchUserData() {
    this.masterservice.getUsersData().subscribe({
      next: (res: any) => {
        this.UserData = res.data
      },
      error: (err: any) => {
        console.error("Error fetching User data:", err);
      }
    })
  }


  ApprovalSummary:any
  FetchApprovalSummaryData(DealerId: any, LocationIds: any, RequestType: any, From: any, To: any, OrderTypeIds: any, PartNumbers: any, VehicleNumbers: any, JobCardNumbers: any, AdvisorIds: any, Status: any){
    this.globalBlockUiService.startLoading()
    this.scsadminservice.FetechApprovalSummary({
      DealerId, LocationIds, RequestType, From, To, OrderTypeIds, PartNumbers, VehicleNumbers, JobCardNumbers, AdvisorIds, Status
    }).subscribe({
      next: (res:any)=>{
        this.ApprovalSummary = res.data
      },
      error: (err:any)=>{
        console.error("error Fetching data");
        
      }
    })
  }
  onClickViewApprovalSummary(){
    this.FetchUserData()
  }


}
