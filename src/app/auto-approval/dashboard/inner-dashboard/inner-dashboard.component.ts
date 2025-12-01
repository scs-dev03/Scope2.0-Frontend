import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { InnerdashboardserviceService } from '../../../services/Auto-Approvals/innerdashboardservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inner-dashboard',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './inner-dashboard.component.html',
  styleUrl: './inner-dashboard.component.css'
})
export class InnerDashboardComponent {


  ngOnInit(): void {

    this.fetchBrandData()

    this.sharedService.updateModuleName('Approval Summary')

    this.route.queryParams.subscribe((params: any) => {
      this.brandid = params['brandid'];
      this.dealerid = params['dealerid'];



      if (this.brandid && this.dealerid) {

        //this.fetchDealerData(this.InnerDashboardInputData.value.Brand)
        this.InnerDashboardInputData.get("Brand")?.patchValue(params['brandid'])
        this.InnerDashboardInputData.get("Dealer")?.patchValue(params['dealerid'])

        this.OnClickViewData()

      }
    })



  }

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService, private innerdashboardservice: InnerdashboardserviceService) {
  }

  Result: any;
  visible: boolean = false;
  brandid: any
  dealerid: any

  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');


  InnerDashboardInputData = new FormGroup({
    Brand: new FormControl(null, Validators.required),
    Dealer: new FormControl(null, Validators.required),
    Location: new FormControl(null),
    FromDate: new FormControl(this.firstDayOfMonth),
    ToDate: new FormControl(this.today),
    OrderType: new FormControl(null),
    selectedPeriod: new FormControl("")

  })

  BrandData: any

  fetchBrandData() {
    this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getBrandMaster().subscribe((res: any) => {
      if (this.brandid) {
        this.InnerDashboardInputData.get("Brand")?.patchValue(this.brandid);

        this.fetchDealerData(this.brandid);
      }
      this.BrandData = res;

      this.globalBlockUiService.stopLoading();
      console.log(this.BrandData);
    });
  }
  OnclickBrand() {
    this.fetchDealerData(this.InnerDashboardInputData.value.Brand)
  }

  DealerData: any
  // Fetch Dealer Data
  fetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
        if (this.dealerid) {
          this.InnerDashboardInputData.get("Dealer")?.patchValue(this.dealerid);
        }

        this.DealerData = res;
        this.DealerData.sort((a: any, b: any) =>
          a.dealer.localeCompare(b.dealer)
        );
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching dealer data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
  }
  OnClickDealer() {
    this.fetchlocation(this.InnerDashboardInputData.value.Dealer)
  }



  LocationData: any
  fetchlocation(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getlocationMaster({ dealerid: dealerid }).subscribe({
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
    if (this.InnerDashboardInputData.valid) {

      this.FetchDashboarData(

        this.InnerDashboardInputData.value.Brand,
        this.InnerDashboardInputData.value.Dealer,
        this.InnerDashboardInputData.value.Location,
        this.InnerDashboardInputData.value.OrderType,
        this.InnerDashboardInputData.value.FromDate,
        this.InnerDashboardInputData.value.ToDate
      )

    }
    else {
      this.InnerDashboardInputData.markAllAsTouched()
    }

  }

  DashboardData: any
  FetchDashboarData(BrandId: any, DealerId: any, LocationId: any, OrderTypeId: any, From: any, To: any) {
    this.globalBlockUiService.startLoading();

    this.innerdashboardservice
      .getDashboardData({ BrandId, DealerId, LocationId, OrderTypeId, From, To })
      .subscribe({
        next: (res: any) => {
          //console.log('Full API response:', res);

          this.DashboardData = {
            NotInMaster: res.data[0].NotInMaster || 0,
            Decline: res.data[0].Decline || 0,
            Approve: res.data[0].Approve || 0,
            PendingCount: res.data[0].Pending || 0,
            Internal: res.data[0].Internal || 0,
          };

          console.log(this.DashboardData);

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
      console.log(fromDate, "fromdata");

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

  RedirectToNotInMaster() {
    this.router.navigate(['/auto/master/nim']);
  }
  RedirectToStatus() {
    this.router.navigate(['/auto/status/os']);
  }

}
