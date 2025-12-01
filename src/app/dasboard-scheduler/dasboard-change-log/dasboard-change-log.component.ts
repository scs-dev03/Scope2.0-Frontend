import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardSchedulerService } from '../../services/dashboard-scheduler/dashboard-scheduler.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-dasboard-change-log',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, LoaderComponent],
  templateUrl: './dasboard-change-log.component.html',
  styleUrl: './dasboard-change-log.component.css'
})
export class DasboardChangeLogComponent {
  visible: any;
  scheduleResult: any;
  isloading: any;
  dealerData: any;
  brandData: any;
  dashBoardChangeData: any;
  workspaceData: any;
  requestBy: any;
  newdate: any;
  changeViewData: any
  
  showDialogforResult() {
    this.visible = true;
  }
 

  constructor(private getDashboardService: DashboardSchedulerService) {}

  ngOnInit(): void {
    this.callallfunction();
  }

  changeLogInputData: FormGroup = new FormGroup({
    dashboardID: new FormControl('', Validators.required),
    workspaceID: new FormControl('', Validators.required),
    brandID: new FormControl('', Validators.required),
    dealerID: new FormControl('', Validators.required),
    requestedByID: new FormControl('', Validators.required),
    requestedDate: new FormControl('', Validators.required),
    remark: new FormControl(''),
    url: new FormControl('', Validators.required),
  });

  onClickBrand() {
    this.fetchDealerData(this.changeLogInputData.value.brandID);
  }

  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmitDashboardChange() {
    this.newdate = this.formatDate(this.changeLogInputData.value.requestedDate);
    console.log(this.newdate);

    console.log(this.changeLogInputData.value);

    if (!this.changeLogInputData.valid) {
      this.changeLogInputData.markAllAsTouched();
    } else {
      this.sendChangeLog(
        this.changeLogInputData.value.dashboardID,
        this.changeLogInputData.value.workspaceID,
        this.changeLogInputData.value.brandID,
        this.changeLogInputData.value.dealerID,
        sessionStorage.getItem('userid'),
        this.changeLogInputData.value.requestedByID,
        this.newdate,
        this.changeLogInputData.value.url,
        this.changeLogInputData.value.remark         
        
      );
      this.changeLogInputData.reset();
      
    }
  }

  fetchDealerData(brandid: any) {
    this.isloading = true;
    this.getDashboardService.getDealersMaster({ brandid: brandid }).subscribe(
      (res: any) => {
        this.dealerData = res;
        this.dealerData.sort((a: any, b: any) => {
          return a.dealer.localeCompare(b.dealer);
        });
        console.log('this is dealer', this.dealerData);
        this.isloading = false
      },
      (error: any) => {
        this.scheduleResult = error.error.message;
        this.isloading = false;
  
      }
    );
  }

  // fetchBrands() {
  //   this.isloading = true
  //   this.getDashboardService.getBrandMaster().subscribe((res: any) => {
  //     this.brandData = res;
  //     this.isloading = false
  //   });
  // }
  fetchDashboardChange() {
    this.isloading = true

    this.getDashboardService.getDashboardMaster().subscribe((res: any) => {
      this.dashBoardChangeData = res;
      this.isloading = false
    });
  }

  fetchWorkspace() {
    this.isloading = true

    this.getDashboardService.getWorkSpace().subscribe((res: any) => {
      this.workspaceData = res;
      this.isloading = false
    });
  }

  fetchRequestBy() {
    this.isloading = true

    this.getDashboardService.getRequestedBy().subscribe((res: any) => {
      this.requestBy = res.Data;
      this.isloading = false
    });
  }

  sendChangeLog(
    dashboardcode: any,
    workspaceid: any,
    refbrandid: any,
    refdealerid: any,
    changeby: any,
    requestby: any,
    requeston: any,
    url: any,
    remarks: any
  ) {
    this.isloading = true

    this.getDashboardService.submitChangeLog({
      dashboardcode: dashboardcode,
      workspaceid: workspaceid,
      refbrandid: refbrandid,
      refdealerid: refdealerid,
      changeby: changeby,
      requestby: requestby,
      requeston: requeston,
      url: url,
      remarks:remarks

    
    }).subscribe((res:any)=>{
      this.scheduleResult = res.message;
      this.showDialogforResult()
      this.isloading = false
      this.fetchChangeLogView();

      
    });
    console.log("hellow rol");
    
  }

  fetchChangeLogView(){
    this.isloading = true
    this.getDashboardService.getChangeview().subscribe((res:any)=>{
      this.changeViewData = res.Data
      this.isloading = false
      console.log(this.changeViewData);
      
    })
  }

  callallfunction() {
    this.fetchDashboardChange();
    this.fetchWorkspace();
    //this.fetchBrands();
    this.fetchRequestBy();
    this.fetchChangeLogView();
  }
}
