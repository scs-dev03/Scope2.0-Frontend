import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardSchedulerService } from '../../services/dashboard-scheduler/dashboard-scheduler.service';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-dashboard-request',
  imports: [PrimengModuleModule,SharedModule,SHARED_IMPORTS,LoaderComponent],
  templateUrl: './dashboard-request.component.html',
  styleUrl: './dashboard-request.component.css'
})
export class DashboardRequestComponent {
  isloading: boolean = false;

  ngOnInit(): void {
    this.fetchBrands();
    this.fetchDashboardViewData()
  }

  requestInputData: FormGroup = new FormGroup({
    dashboardID: new FormControl('', Validators.required),
    brandID: new FormControl('', Validators.required),
    dealerID: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  });

  constructor(private getDashboardService: DashboardSchedulerService) {}

  brandData: any;
  dealerData: any;
  dashBoardRequestData: any;
  scheduleResult: any;
  dashboardviewData: any;


  brandname: any;
  formatedDate: any = '';
  dealername: any;
  newdate: any = this.formatDate(this.requestInputData.value.date);
  newtime: any = this.formatTime(this.requestInputData.value.time);

  visible: boolean = false;

  showDialogforResult() {
      this.visible = true;
   }


  onClickBrand() {
    this.fetchDealerData(this.requestInputData.value.brandID);
  }
  onClickDealer() {
    this.fetchDashboardRequest(this.requestInputData.value.dealerID);
  }

  addBrandName() {
    this.brandname = this.brandData.find(
      (item: any) => item.bigid === this.requestInputData.value.brandID
    );
    console.log(this.brandname);
  }

  addDealerName() {
    this.dealername = this.dealerData.find(
      (item: any) => item.dealerid === this.requestInputData.value.dealerID
    );
    console.log(this.dealername);
  }
  onSubmitDashboard() {
    this.newdate = this.formatDate(this.requestInputData.value.date);
    this.newtime = this.formatTime(this.requestInputData.value.time);
    this.convertToSQLDateTime(this.newdate, this.newtime);
    this.addBrandName();
    this.addDealerName();
    console.log(this.newdate);

    if (!this.requestInputData.valid) {
      this.requestInputData.markAllAsTouched();
    } else {
      this.sendScheduleData(
        this.requestInputData.value.dashboardID,
        this.requestInputData.value.brandID,
        this.brandname.vcbrand,
        this.dealername.dealerid,
        this.dealername.dealer,
        this.formatedDate,
        localStorage.getItem('userid')
      );
      this.requestInputData.value.dealerID.reset();
    }
  }

  showDeleteDialog(formData: any) {
    console.log('hii');
  }
  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(dateString: string) {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  convertToSQLDateTime(date: string, time: string) {
    // Combine date and time into a single string
    const dateTimeString = `${date}T${time}`;

    // Convert to a JavaScript Date object
    const dateTime = new Date(dateTimeString);

    // Add 5 hours and 30 minutes (UTC+5:30)
    dateTime.setHours(dateTime.getHours() + 5);
    dateTime.setMinutes(dateTime.getMinutes() + 30);

    // Format to SQL-compatible datetime (YYYY-MM-DD HH:MM:SS)
    const formattedDateTime = `${dateTime.getFullYear()}-${(
      dateTime.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${dateTime
      .getDate()
      .toString()
      .padStart(2, '0')} ${dateTime
      .getHours()
      .toString()
      .padStart(2, '0')}:${dateTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${dateTime.getSeconds().toString().padStart(2, '0')}`;

    this.formatedDate = formattedDateTime;
  }

  sendScheduleData(
    dashboardcode: any,
    brandid: any,
    brand: any,
    dealerid: any,
    dealer: any,
    scheduledon: any,
    addedby: any
  ) {
    this.isloading = true;

    this.getDashboardService
      .setNewDashboard({
        dashboardcodes: dashboardcode,
        brandid: brandid,
        brand: brand,
        dealerid: dealerid,
        dealer: dealer,
        scheduledon: scheduledon,
        addedby: addedby,
      })
      .subscribe(
        (res: any) => {
          this.scheduleResult = res.message;
          console.log(this.scheduleResult);
          this.isloading = false;
          this.fetchDashboardViewData()

          this.showDialogforResult();
          
        },
        (error: any) => {
          this.scheduleResult = error.error.message;
          console.log(this.scheduleResult);
          this.isloading = false;

          this.showDialogforResult();
          
        }
      ); 
      this.requestInputData.value.reset();
  }

  fetchDealerData(brandid: any) {
    this.isloading = true;
    this.getDashboardService.getDealersMaster({ brandid: brandid }).subscribe(
      (res: any) => {
        this.dealerData = res;
        this.dealerData.sort((a: any, b: any) => {
          return a.dealer.localeCompare(b.dealer);
        });
        this.isloading = false;
        console.log('this is dealer', this.dealerData);
      },
      (error: any) => {
        this.scheduleResult = error.error.message;
        this.isloading = false;
      }
    );
  }

  fetchBrands() {
    this.isloading = true;
    this.getDashboardService.getBrandMaster().subscribe((res: any) => {
      this.brandData = res;
      this.isloading = false;

    });
  }
  fetchDashboardRequest(dealerid: any) {
    this.isloading = true;
    this.getDashboardService
      .getDashboardRequest({ dealerid: dealerid })
      .subscribe((res: any) => {
        this.dashBoardRequestData = res;
        this.isloading = false;

    });
  }

  fetchDashboardViewData(){
    this.isloading = true;
    this.getDashboardService.getDashboardRequestView().subscribe((res:any)=>{
      this.dashboardviewData = res.Data
      this.isloading = false;
    })
  }
}
