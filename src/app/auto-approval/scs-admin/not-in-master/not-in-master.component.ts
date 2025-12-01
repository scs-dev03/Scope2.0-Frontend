import { Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { NotinmasterserviceService } from '../../../services/Auto-Approvals/notinmasterservice.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-not-in-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './not-in-master.component.html',
  styleUrl: './not-in-master.component.css'
})
export class NotInMasterComponent {


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('Not In Master')
    this.FetchBrandData()

  }


  VisiTableData: boolean = false
  NotinMasterInputData!: FormGroup;

  constructor(private NotInMasterservice: NotinmasterserviceService, private masterservice: MasterServiceService, private fb: FormBuilder, private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService) {
    this.NotinMasterInputData = this.fb.group({
      brand: [null],
      dealer: [null],
      location: [null],
      status: [null],
      pendingSince: [null]
    });
  }

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



  onReset() {
    this.NotinMasterInputData.reset();
  }

  visible: boolean = false;


  // Table headers list
  tableColumns = [
    { field: 'sno', header: 'S.No' },
    { field: 'brand', header: 'Brand' },
    { field: 'dealer', header: 'Dealer' },
    { field: 'location', header: 'Location' },
    { field: 'partNumber', header: 'Part Number' },
    { field: 'description', header: 'Description' },
    { field: 'mrp', header: 'MRP' },
    { field: 'latestPart', header: 'Latest Part (if Any)' },
    { field: 'model', header: 'Model' },
    { field: 'moq', header: 'MOQ' },
    { field: 'view', header: 'View' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'submittedBy', header: 'Submitted by' },
    { field: 'submittedOn', header: 'submitted on' }
  ];

  periodOptions = [
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'Last Week', value: 'lastWeek' },
    { name: 'Last Month', value: 'lastMonth' },
  ];




  // Initially all columns selected
  selectedColumns: string[] = this.tableColumns.map(c => c.field);

  BrandData: any
  FetchBrandData() {
    this.globalBlockUiService.startLoading()
    this.masterservice.getBrandMaster().subscribe({
      next: (res: any) => {
        this.BrandData = res
        this.globalBlockUiService.stopLoading();

      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }


  OnclickBrands() {
    this.FetchDealerData(this.NotinMasterInputData.value.brand)
  }


  DealerData: any
  FetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading()
    this.masterservice.getDealersMaster({ brandid: brandid }).subscribe({
      next: (res: any) => {
        this.DealerData = res
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }

  OnclickDealer() {
    this.FetchLocationData(this.NotinMasterInputData.value.dealer)
  }

  LocationData: any
  FetchLocationData(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.masterservice.getlocationMaster({ dealerid: dealerid }).subscribe({
      next: (res: any) => {
        this.LocationData = res
        this.globalBlockUiService.stopLoading()
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading()

      }
    })
  }


  OnClickViewData() {

  let fromDate: string | null = null;
  let toDate: string | null = null;

  const period = this.NotinMasterInputData.value.from; // selected period

  const today = new Date();

  if (period === 'yesterday') {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);

    fromDate = y.toISOString().split('T')[0];
    toDate = y.toISOString().split('T')[0];

  } else if (period === 'lastWeek') {
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);

    fromDate = lastWeekStart.toISOString().split('T')[0];
    toDate = today.toISOString().split('T')[0];

  } else if (period === 'lastMonth') {
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(today.getMonth() - 1);

    fromDate = lastMonthStart.toISOString().split('T')[0];
    toDate = today.toISOString().split('T')[0];
  }

  // Call API
  this.FetchNotInMasterData(
    this.NotinMasterInputData.value.brand,
    this.NotinMasterInputData.value.dealer,
    this.NotinMasterInputData.value.location,
    null,
    null,
    null,
    fromDate,
    toDate,
    1
  );
}


  NotInMasterData: any

  FetchNotInMasterData(BrandId: any, DealerId: any, LocationId: any, PartNumber: any, PartTypeId: any, Addedby: any, From: any, To: any, Status: any) {
    this.globalBlockUiService.startLoading();
    this.NotInMasterservice.FetchNotInMasterAdmin({ BrandId: BrandId, DealerId: DealerId, LocationId: LocationId, PartNumber: PartNumber, PartTypeId: PartTypeId, Addedby: Addedby, From: From, To: To, Status: Status }).subscribe({
      next: (res: any) => {
        this.NotInMasterData = res.data
        this.globalBlockUiService.stopLoading()
        this.VisiTableData = true


      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
      },
    })
  }

  SendAdminAction(rowData: any) {
    this.globalBlockUiService.startLoading();
    this.NotInMasterservice.SendAdminAction({ Id: rowData.id, Status: 2, Approvedby: sessionStorage.getItem('userid'), Remarks: rowData.SCSRemarks }).subscribe({
      next: (res: any) => {
        this.globalBlockUiService.stopLoading()
        this.NotInMasterData = this.NotInMasterData.filter((item: any) => item.id != rowData.id)
      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
      }
    })
  }

  RemoveRow(rowData: any) {
    this.NotInMasterData = this.NotInMasterData.filter((item: any) => item.id != rowData.id)
    if (this.NotInMasterData.length == 0) {
      this.VisiTableData = false
    }

  }

  downloadImage(rowData: any) {
  const url = rowData.Image;

  if (url) {
    window.open(url, '_blank');
  }
}
}
