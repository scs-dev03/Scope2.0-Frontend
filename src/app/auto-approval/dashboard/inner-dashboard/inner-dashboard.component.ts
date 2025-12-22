import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { InnerdashboardserviceService } from '../../../services/Auto-Approvals/innerdashboardservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-inner-dashboard',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './inner-dashboard.component.html',
  styleUrl: './inner-dashboard.component.css'
})
export class InnerDashboardComponent {


  async ngOnInit(): Promise<void> {

    //this.globalBlockUiService.startLoading()
    await this.fetchBrandData()
    this.fetchOrderType()

    this.sharedService.updateModuleName('Approval Summary')

    this.route.queryParams.subscribe((params: any) => {
      this.brandid = parseInt(params['brandid']);
      this.dealerid = params['dealerid'];

      if (this.brandid && this.dealerid) {

        //this.fetchDealerData(this.InnerDashboardInputData.value.Brand)
        this.InnerDashboardInputData.get("Brand")?.patchValue(this.brandid)
        this.InnerDashboardInputData.get("Dealer")?.patchValue(params['dealerid'])
        this.InnerDashboardInputData.get("FromDate")?.patchValue(null)

        this.fetchDealerData(this.brandid);
        this.fetchlocation(this.dealerid)
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
    // this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getBrandMaster().subscribe((res: any) => {
      if (this.brandid) {
        this.InnerDashboardInputData.get("Brand")?.patchValue(this.brandid);

        this.fetchDealerData(this.brandid);
      }
      this.BrandData = res;

      //this.globalBlockUiService.stopLoading();
      console.log(this.BrandData);
    });
  }
  OnclickBrand() {
    this.fetchDealerData(this.InnerDashboardInputData.value.Brand)
  }

  DealerData: any
  // Fetch Dealer Data
  fetchDealerData(brandid: any) {
    //this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
        if (this.dealerid) {
          this.InnerDashboardInputData.get("Dealer")?.patchValue(this.dealerid);
        }

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
    this.fetchlocation(this.InnerDashboardInputData.value.Dealer)
  }



  LocationData: any
  fetchlocation(dealerid: any) {
    //this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getlocationMaster({ dealerid: dealerid }).subscribe({
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

  OrderTypeData: any

  fetchOrderType() {

    this.innerdashboardservice.getOrderType().subscribe({
      next: (res: any) => {
        this.OrderTypeData = res.data;
      },
      error: (err: any) => {
        console.error("Error fetching Order Type data:", err);
      }
    })
  }

  periodOptions = [
    { name: 'Last 30 Min', value: '30min' },
    { name: 'Last One hour', value: '1hr' },
    { name: 'Last Two hour', value: '2hr' },
    { name: 'Yesterday', value: 'lastWeek' },
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
            PendingCount: res.data[0].Manual || 0,
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
          this.Result = err?.error?.message
          this.visible = true
          this.globalBlockUiService.stopLoading();
        },
      });
  }

  toIST(date: Date, onlyDate: boolean = false) {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC + 5:30
    const ist = new Date(date.getTime() + istOffset);

    if (onlyDate) {
      return ist.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    return ist.toISOString();  // Full ISO with IST applied
  }


  OnChangeDate() {
    const selected = this.InnerDashboardInputData.value.selectedPeriod as string;
    const now = new Date();
    let fromDate: string = '';
    let toDate: string = '';

    if (selected === '30min') {
      const from = new Date(now);
      from.setMinutes(now.getMinutes() - 30);

      fromDate = this.toIST(from);
      toDate = this.toIST(now);
    }

    else if (selected === '1hr') {
      const from = new Date(now);
      from.setHours(now.getHours() - 1);

      fromDate = this.toIST(from);
      toDate = this.toIST(now);
    }

    else if (selected === '2hr') {
      const from = new Date(now);
      from.setHours(now.getHours() - 2);

      fromDate = this.toIST(from);
      toDate = this.toIST(now);
    }

    else if (selected === 'yesterday') {
      const y = new Date();
      y.setDate(now.getDate() - 1);

      fromDate = this.toIST(y, true);
      toDate = this.toIST(y, true);
    }

    else if (selected === 'lastWeek') {
      const from = new Date();
      from.setDate(now.getDate() - 7);

      fromDate = this.toIST(from, true);
      toDate = this.toIST(now, true);
    }

    this.InnerDashboardInputData.patchValue({
      FromDate: fromDate,
      ToDate: toDate
    });

    console.log("Updated IST Dates:", fromDate, toDate);
  }



  RedirectToNotInMaster() {
  const formValue = this.InnerDashboardInputData.value;
  console.log(formValue);

  this.router.navigate(
    ['/auto/scsadmin/nim'],
    {
      queryParams: {
        brandId: formValue.Brand ?? null,
        dealerId: formValue.Dealer ?? null,
        locationId: formValue.Location ?? null,
        From: formValue.FromDate ? formValue.FromDate : 'N',
        To: formValue.ToDate ?? null
      }
    }
  );
}



  RedirectToStatus() {
    this.router.navigate(['/auto/status/os']);
  }

}
