import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { FormControl, FormGroup } from '@angular/forms';
import { InnerDashboardService } from '../../../services/Auto-Approvals/inner-dashboard.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';


@Component({
  selector: 'app-inner-dashboard',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './inner-dashboard.component.html',
  styleUrl: './inner-dashboard.component.css'
})
export class InnerDashboardComponent {

  ngOnInit(): void {
    this.sharedService.updateModuleName('Dashboard')
    this.fetchlocation();
    this.fetchOrderType();

  }

  constructor(private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService, private innerdashboardservice: InnerDashboardService) {
  }

  Result: any;
  visible: boolean = false;

  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');


  InnerDashboardInputData = new FormGroup({
    Location: new FormControl(null),
    FromDate: new FormControl(this.firstDayOfMonth),
    ToDate: new FormControl(this.today),
    OrderType: new FormControl(null),
    selectedPeriod: new FormControl(" ")

  })



  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
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
    this.innerdashboardservice.getOrderType().subscribe({
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

  periodOptions = [
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'Last Week', value: 'lastWeek' },
    { name: 'Last Month', value: 'lastMonth' },
  ];

  selectedPeriod: string | null = null;

  OnClickViewData() {
    this.FetchDashboarData(
      sessionStorage.getItem('dealerid') || '',
      this.InnerDashboardInputData.value.Location,
      this.InnerDashboardInputData.value.OrderType,
      this.InnerDashboardInputData.value.FromDate,
      this.InnerDashboardInputData.value.ToDate
    )
  }

  DashboardData: any
  FetchDashboarData(DealerId: any, LocationId: any, OrderTypeId: any, From: any, To: any) {
    this.globalBlockUiService.startLoading();

    this.innerdashboardservice
      .getDashboardData({ DealerId, LocationId, OrderTypeId, From, To })
      .subscribe({
        next: (res: any) => {
          //console.log('Full API response:', res);

          this.DashboardData = {
            NotInMaster: res.data[0].NotInMaster || 0,
            Decline: res.data[0].Decline || 0,
            Approve: res.data[0].Approve || 0,
            PendingCount: res.data[0].PendingCount || 0,
            Internal: res.data[0].Internal || 0,
          };

          this.Result = res.message;
          this.visible = true;

          //console.log('Dashboard Data:', this.DashboardData);

          this.globalBlockUiService.stopLoading();
        },
        error: (err: any) => {
          console.error('Error fetching Dashboard data:', err);
          this.globalBlockUiService.stopLoading();
        },
      });
  }

 OnChangeDate() {
  console.log(this.InnerDashboardInputData.value);
  
  const selected = this.InnerDashboardInputData.value.selectedPeriod as string;
  const today = new Date();
  let fromDate: string;
  let toDate: string;

  if (selected === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    fromDate = yesterday.toISOString().split('T')[0];
    toDate = yesterday.toISOString().split('T')[0];
    console.log(fromDate ,"fromdata");
    
  } else if (selected === 'lastWeek') {
    const lastWeekStart = new Date();
    lastWeekStart.setDate(today.getDate() - 7);
    fromDate = lastWeekStart.toISOString().split('T')[0];
    toDate = today.toISOString().split('T')[0];
  } else if (selected === 'lastMonth') {
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(today.getMonth() - 1);
    fromDate = lastMonthStart.toISOString().split('T')[0];
    toDate = today.toISOString().split('T')[0];
  } else {
    // If nothing selected, reset
    fromDate = '';
    toDate = '';
  }

  this.InnerDashboardInputData.patchValue({
    FromDate: fromDate,
    ToDate: toDate
  });

  console.log('Updated Dates:', { fromDate, toDate });
}




}
