import { Component } from '@angular/core';
import { DashboardSchedulerService } from '../../services/dashboard-scheduler/dashboard-scheduler.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-dashboard-scheduler',
  imports: [SHARED_IMPORTS,PrimengModuleModule,SharedModule,LoaderComponent],
  templateUrl: './dashboard-scheduler.component.html',
  styleUrl: './dashboard-scheduler.component.css',
  providers: [DatePipe]
})
export class DashboardSchedulerComponent {
  dashboardInputData: FormGroup = new FormGroup({
    bdmID: new FormControl(),
    dashboardID: new FormControl('', Validators.required),
    brandID: new FormControl('', Validators.required),
    dealerID: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  
  });

  editDashboardInputData: FormGroup = new FormGroup({
    editDashboard: new FormControl({ value: '', disabled: true }),
    editBrand: new FormControl({ value: '', disabled: true }),
    editDealer: new FormControl({ value: '', disabled: true }),
    editDate: new FormControl('', Validators.required),
    editTime: new FormControl('', Validators.required),
  });

  exportInfoInputData: FormGroup = new FormGroup({
    FromDate: new FormControl('',Validators.required),
    ToDate: new FormControl('',Validators.required)
  })
  ngOnInit(): void {

    localStorage.setItem("userid",'138032')
     this.sharedService.updateModuleName('Dashboard Scheduler')
    this.fetchBdm();
    
    this.dashboardInputData.controls['dashboardID'].disable();
    this.dashboardInputData.controls['brandID'].disable();
    this.dashboardInputData.controls['dealerID'].disable();
    this.dashboardInputData.controls['date'].disable();
    this.dashboardInputData.controls['time'].disable();
    this.dashboardInputData.patchValue({
    bdmID:  localStorage.getItem('userid')
    });
    this.fetchBrandData(this.dashboardInputData.value.bdmID);


    
    
    this.onClickBDM()

    //this.getDashboardService.setLocalStorage();
    this.fetchDashboardSchedule(this.dashboardInputData.value.bdmID);
  }

  visible: boolean = false;

  showDialogforResult() {
    this.visible = true;
  }

  isloading: boolean = false;
  isDeleateDisabled = false;
  visibleEdit: boolean = false;
  isExport: boolean = false

  visibleDelete: boolean = false;

  constructor(
    private getDashboardService: DashboardSchedulerService,
    private messageService: MessageService,
    private datepipe: DatePipe,private globalBlockUiService:GlobalBlockUiService,
    private sharedService:SharedServiceService
  ) {}

  Severity: any;

  dashBoardData: any = [];
  BdmData: any = [];
  brandData: any = [];
  dealerData: any = [];
  scheduleResult: any = 'Refresh Again';
  formatedDate: any = '';
  dashboardScheduleData: any = [];
  minDate: any = new Date();

  brandname: any;
  dealername: any;
  newdate: any = this.formatDate(this.dashboardInputData.value.date);
  newtime: any = this.formatTime(this.dashboardInputData.value.time);
// this is use for removing Gsi from the dropdown
  removeGSI() {
    this.dashBoardData.forEach((item: any) => {
      if (item.tCode == 14) {
        this.dashBoardData.splice(this.dashBoardData.indexOf(item), 1);
      }
    });
    console.log(this.dashBoardData);
  }
// adding brand name in submit 
  addBrandName() {
    this.brandname = this.brandData.find(
      (item: any) => item.BrandID === this.dashboardInputData.value.brandID
    );
    console.log(this.brandname);
  }
// adding dealername in submit
  addDealerName() {
    this.dealername = this.dealerData.find(
      (item: any) => item.dealerid === this.dashboardInputData.value.dealerID
    );
    console.log(this.dealername);
  }
  // submit funtion for scheduling dashboard
  onSubmitDashboardRequest() {
    console.log(this.dashboardInputData.value);
    
    this.newdate = this.formatDate(this.dashboardInputData.value.date);
    this.newtime = this.formatTime(this.dashboardInputData.value.time);
    this.convertToSQLDateTime(this.newdate, this.newtime);
    this.addBrandName();
    this.addDealerName();
    console.log(this.newdate);

    if (!this.dashboardInputData.valid) {
      this.dashboardInputData.markAllAsTouched();
    } else {
      this.sendScheduleData(
        this.dashboardInputData.value.dashboardID,
        this.dashboardInputData.value.brandID,
        this.brandname.Brand,
        this.dealername.dealerid,
        this.dealername.dealer,
        this.formatedDate,
        this.dashboardInputData.value.bdmID
      );
      this.fetchDashboardSchedule(this.dashboardInputData.value.bdmID);
      
      this.dashboardInputData.controls['dashboardID'].reset();
      this.dashboardInputData.controls['brandID'].reset();
      this.dashboardInputData.controls['dealerID'].reset();
      this.dashboardInputData.controls['date'].reset();
      this.dashboardInputData.controls['time'].reset();
    }
  }
  // fixing minues in the time dropdown
  fixMinutes() {
    if (this.dashboardInputData.value.time) {
      let minutes = this.dashboardInputData.value.time.getMinutes();
      this.dashboardInputData.value.time.setMinutes(minutes < 30 ? 0 : 30);
      this.dashboardInputData.value.time = new Date(
        this.dashboardInputData.value.time
      ); // Change detection
    }
  }
// fixing minutes in edit 
  fixMinutesEdit() {
    if (this.editDashboardInputData.value.editTime) {
      let minutes = this.editDashboardInputData.value.editTime.getMinutes();
      this.editDashboardInputData.value.editTime.setMinutes(minutes < 30 ? 0 : 30);
      this.editDashboardInputData.value.editTime = new Date(
        this.editDashboardInputData.value.editTime
      ); // Change detection
    }
  }

  onEditDashboard() {
    this.newdate = this.formatDate(this.editDashboardInputData.value.editDate);
    this.newtime = this.formatTime(this.editDashboardInputData.value.editTime);
    this.convertToSQLDateTime(this.newdate, this.newtime);
    console.log(this.formatedDate);
    if (!this.editDashboardInputData.valid) {
      this.editDashboardInputData.markAllAsTouched();
    } else {
      this.updateDashoardSchedule(
        this.req_id,
        this.formatedDate,
        // localStorage.getItem('userid')
        this.dashboardInputData.value.bdmID
      );
    }
  }

  req_id: any;
  showDialog(formData: any) {
    if (formData.StatusName != 'Scheduled') {
      if (
        formData.StatusName == 'Data Refresh Failed' ||
        formData.StatusName == 'Dashboard Refresh Failed'
      ) {
        this.visibleEdit = true;
        this.req_id = formData.reqid;
        this.Severity = 'success';
        this.editDashboardInputData.patchValue({
          editDashboard: formData.Dashboard,
          editBrand: formData.Brand,
          editDealer: formData.Dealer,
        });
      } else {
        this.scheduleResult = ` ${formData.StatusName} Now You Can Not Edit Dashboard `;
        this.showDialogforResult();
      }
    } else {
      this.visibleEdit = true;
      this.req_id = formData.reqid;
      this.Severity = 'success';
      this.editDashboardInputData.patchValue({
        editDashboard: formData.Dashboard,
        editBrand: formData.Brand,
        editDealer: formData.Dealer,
      });
    }
  }

  showDeleteDialog(formData: any) {
    this.req_id = formData.reqid;
    this.visibleDelete = true;
    console.log('hii');
  }
  // Enable Disable button
  
  onClickBDM() {
    this.dashboardInputData.controls['dashboardID'].enable();
    this.dashboardInputData.controls['brandID'].enable();
    this.dashboardInputData.controls['dealerID'].enable();
    this.dashboardInputData.controls['date'].enable();
    this.dashboardInputData.controls['time'].enable();
  }

  onclickDealer() {
    this.fetchDashboardData(this.dashboardInputData.value.dealerID);
  }

  onClickBrand() {
    this.fetchDealerData(this.dashboardInputData.value.brandID,this.dashboardInputData.value.bdmID);
  }
  onDeleteDashboard() {
    this.deleteDashboardSchedule(this.req_id, this.dashboardInputData.value.bdmID);
    console.log(this.dashboardInputData.value);
    
  }
//Date formation for SQL
  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 // Time formation for SQL
  formatTime(dateString: string) {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
  // Converting date and time to SQL format
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
// Fetch Dashboard Data for Drop down except gsi
  fetchDashboardData(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService.getDashboard({ dealerid: dealerid }).subscribe(
      (res: any) => {
        this.dashBoardData = res.Data;
        //console.log('data of dashboard', this.dashBoardData);
        this.globalBlockUiService.stopLoading();
        this.removeGSI();
      },
      (error: any) => {
        this.scheduleResult = error.error?.message || 'Refresh Again';
        this.globalBlockUiService.stopLoading();

        this.showDialogforResult();
      }
    );
  }
   // fetch brand form master
  fetchBrandData(userid:any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService.getBrandMaster({userid : userid}).subscribe(
      (res: any) => {
        this.brandData = res.Data;
        this.globalBlockUiService.stopLoading();
      },
      (error: any) => {
        this.scheduleResult = error.error?.message || 'Refresh Again';
        this.globalBlockUiService.stopLoading();

        this.showDialogforResult();
      }
    );
  }
   // fetch dealer from master
  fetchDealerData(brandid: any,userid: any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService.getDealersMaster({ brandid: brandid, userid: userid }).subscribe(
      (res: any) => {
        this.dealerData = res.Data;
        this.dealerData.sort((a: any, b: any) => {
          return a.dealer.localeCompare(b.dealer);
        });
        this.globalBlockUiService.stopLoading();
        console.log('this is dealer', this.dealerData);
      },
      (error: any) => {
        this.scheduleResult = error.error?.message || 'Refresh Again';
        this.globalBlockUiService.stopLoading();

        this.showDialogforResult();
      }
    );
  }
// on click submit button 
  sendScheduleData(
    dashboardcode: any,
    brandid: any,
    brand: any,
    dealerid: any,
    dealer: any,
    scheduledon: any,
    addedby: any
  ) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService
      .setDashboardSchedule({
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
          this.fetchDashboardSchedule(this.dashboardInputData.value.bdmID);
          this.globalBlockUiService.stopLoading();
          this.showDialogforResult();
        },
        (error: any) => {
          if (error.error) {
            if(error.error.Error){
              this.scheduleResult = error.error.Error;
            }
            if (error.error.locations && error.error.saleTypes) {
              // Jab API response {"locations":["Hazaribagh","Ramgarh"],"saleTypes":["Ws","Ws"]} ho
              this.scheduleResult = `Data of these Locations: ${error.error.locations.join(", ")} is not updated for ${error.error.saleTypes.join(", ")}`;
            }
            
          } 
          // if(error.error){
          //   this.scheduleResult = `Data of these Location ${error.error.locations} is not Updated for ${error.error.saleTypes}`
           
          // }
          
          console.log(this.scheduleResult);
          
          this.globalBlockUiService.stopLoading();
          this.showDialogforResult();
        }
      );
  }
  updatedData: any;
  // fetch table data 

  fetchDashboardSchedule(userid:any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService.getDashboardSchedule({userid:userid}).subscribe(
      (res: any) => {
        // console.log(res.Request);
        this.dashboardScheduleData = res;
        this.dashboardScheduleData.Request.forEach((item: any) => {
          item.ScheduledOn = new Date(item.ScheduledOn);
          item.Addedon = new Date(item.Addedon)
          if(item.Deletedon !=null){
            
            item.Deletedon = new Date(item.Deletedon)
          }
          
        });
        this.globalBlockUiService.stopLoading();
        this.updatedData = this.adjustAddedOnTime(this.dashboardScheduleData);
        //console.log(this.updatedData);
      },
      (error: any) => {
        this.scheduleResult = error.error?.message || 'Refresh Again';

        this.globalBlockUiService.stopLoading();
        this.showDialogforResult();
      }
    );
  }
// edit dashboard data from edit button
  updateDashoardSchedule(reqid: any, scheduledon: any, userid: any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService
      .getEditDashboard({
        reqid: reqid,
        scheduledon: scheduledon,
        bintid_pk: userid,
      })
      .subscribe(
        (res: any) => {
          this.dashboardScheduleData = res.Requests;
          this.scheduleResult = res.message;
          console.log(this.scheduleResult);
          this.fetchDashboardSchedule(this.dashboardInputData.value.bdmID);
          this.showDialogforResult();
          this.globalBlockUiService.stopLoading();
          this.visibleEdit = false;
        },
        (error: any) => {
          this.scheduleResult = error.error?.message || 'Updation Failed';
          this.globalBlockUiService.stopLoading();

          this.showDialogforResult();
        }
      );
  }

  //delete dashboard from table
  deleteDashboardSchedule(reqid: any, bintid_pk: any) {
    this.globalBlockUiService.startLoading();
    this.getDashboardService
      .getDeletDashboard({ reqid: reqid, bintid_pk: bintid_pk })
      .subscribe(
        (res: any) => {
          this.scheduleResult = res.message;
          this.fetchDashboardSchedule(this.dashboardInputData.value.bdmID);
          this.showDialogforResult();
          this.globalBlockUiService.stopLoading();
          this.visibleDelete = false;
        },
        (error: any) => {
          this.scheduleResult = error.error?.message || 'Deletion Failed Choose your Name From BDM';
          this.globalBlockUiService.stopLoading();

          this.showDialogforResult();
        }
      );
  }

  // Function to adjust the Addedon time
  adjustAddedOnTime(data: any) {
    //console.log(data.Request);

    return data.Request.map((item: any) => {
      let addedOnDate = new Date(item.Addedon);
      let scheduledate = new Date(item.ScheduledOn)
      //scheduledate.setHours(scheduledate.getHours() -5)
      //scheduledate.setHours(scheduledate.getMinutes() -30)
      addedOnDate.setHours(addedOnDate.getHours() - 5);
      addedOnDate.setMinutes(addedOnDate.getMinutes() - 30);
      

            return {
        ...item,
        Addedon: addedOnDate.toISOString(),
        ScheduledOn : scheduledate.toISOString()

        // Deletedon: deletedon.toISOString(),
        // Editedon: editedon.toISOString(), // Converting back to ISO format
      };     
    });
  }
// fetching bdm form master
  fetchBdm() {
    this.globalBlockUiService.startLoading();
    this.getDashboardService.getBDM().subscribe((res: any) => {
      this.BdmData = res;
      this.globalBlockUiService.stopLoading();
    });
  }
  
  onclickExportDashboard(){
    this.isExport = true
    console.log(this.exportInfoInputData.value);
    
  }
  // export button function
  onClickExport(){
    console.log(this.exportInfoInputData.value);
    this.formatFromAndToDate()
    //this.exportToExcel(this.newFromDate, this.newToDate)
  }
  // format change in from and to date
  newFromDate: any
  newToDate: any
  fromdate:any
   formatFromAndToDate(){
     this.fromdate = this.exportInfoInputData.value.FromDate
     console.log(this.exportInfoInputData.value.FromDate);
    

    let todate = this.exportInfoInputData.get('ToDate')?.value

    if(this.fromdate ){
      this.newFromDate = this.datepipe.transform(this.fromdate, 'dd-MM-yy')
      this.newToDate = this.datepipe.transform(todate, 'dd-MM-yy')
    }
    console.log(`from Date  ${this.newFromDate} and to Date ${this.newToDate}`);
  }




  // exportToExcel(fromDateStr: string, toDateStr: string) {
  //   //Convert from & to date (dd-MM-yy) into JavaScript Date
  //   // const fromDate = this.convertToDate(fromDateStr);
  //   // const toDate = this.convertToDate(toDateStr);
  //   // console.log(this.convertToDate(fromDateStr));
  //   // console.log(this.convertToDate(toDateStr));


    
  //   // Filter data based on ScheduledOn range
  //   const filteredData = this.dashboardScheduleData.Request.filter( (item : any) => {
  //     const scheduledDate = item.ScheduledOn;

  //     if(scheduledDate >= this.exportInfoInputData.value.FromDate && scheduledDate <= this.exportInfoInputData.value.ToDate){

  //       console.log(item.reqid+"----Scheduled on Date----  "+scheduledDate+" ---- From Date Input----  "+  this.exportInfoInputData.value.FromDate+" ----From Date Input---- "+this.exportInfoInputData.value.ToDate );
  //     }
     
      
  //     return scheduledDate >= this.exportInfoInputData.value.FromDate && scheduledDate <= this.exportInfoInputData.value.ToDate;
  //   });
 

  //   if (filteredData.length == 0) {
  //     console.log('No data found in the given date range.');
  //     return;
  //   }

  //   // Convert filtered data into Excel format
  //   const worksheet = XLSX.utils.json_to_sheet(filteredData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredData');
  //   console.log(filteredData);
    

  //   // Generate Excel file & trigger download
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(data, `Dashboard_Report_${fromDateStr}_to_${toDateStr}.xlsx`);
  // }

  // // Convert 'dd-MM-yy' to JavaScript Date object
  // convertToDate(dateStr: string): Date {
  //   const [day, month, year] = dateStr.split('-').map(Number);
  //   return new Date(2000 + year, month - 1, day); // Adjust year correctly
  // }
}
