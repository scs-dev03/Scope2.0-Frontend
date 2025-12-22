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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-in-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './not-in-master.component.html',
  styleUrl: './not-in-master.component.css'
})
export class NotInMasterComponent {


  ngOnInit(): void {

    this.sharedService.updateModuleName('Not In Master')
    this.FetchBrandData()
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        console.log("hello form params");

        const fromParam = params['From'];
        const toParam = params['To'];

        this.NotinMasterInputData.patchValue({
          brand: params['brandId'] ? parseInt(params['brandId']) : null,
          dealer: params['dealerId'] ?? null,
          location: params['locationId'] ?? null,

          // 👇 MAIN FIX
          FromDate: (fromParam === 'N' || fromParam === null || fromParam === undefined)
            ? null
            : fromParam,

          ToDate: (toParam === 'N' || toParam === null || toParam === undefined)
            ? null
            : toParam
        });

        this.OnclickBrands();
        this.OnclickDealer();
        this.OnClickViewData();
      }
    });



  }


  VisiTableData: boolean = false
  NotinMasterInputData!: FormGroup;
  ExportButtonVisible: boolean = false;

  constructor(private NotInMasterservice: NotinmasterserviceService, private route: ActivatedRoute, private masterservice: MasterServiceService, private fb: FormBuilder, private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService) {
    this.NotinMasterInputData = this.fb.group({
      brand: [null],
      dealer: [null],
      FromDate: [this.firstDayOfMonth],
      ToDate: [this.today],
      location: [null],
      status: [1],
      pendingSince: [null]
    });
  }


  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');


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

  Status = [
    {
      Name: "Pending for Verification",
      Value: 1
    },
    {
      Name: "Verified",
      Value: 2
    }
  ]



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

    let fromDate: string
    let toDate: string

    const period = this.NotinMasterInputData.value.FromDate; // selected period

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
      this.NotinMasterInputData.value.FromDate,
      this.NotinMasterInputData.value.ToDate,
      this.NotinMasterInputData.value.status

    );
  }

  Result: any;
  visible: boolean = false;




  NotInMasterData: any
  FetchNotInMasterData(BrandId: any, DealerId: any, LocationId: any, PartNumber: any, PartTypeId: any, Addedby: any, From: any, To: any, Status: any) {
    this.globalBlockUiService.startLoading();
    this.NotInMasterservice.FetchNotInMasterAdmin({ BrandId: BrandId, DealerId: DealerId, LocationId: LocationId, PartNumber: PartNumber, PartTypeId: PartTypeId, Addedby: Addedby, From: From, To: To, Status: Status }).subscribe({
      next: (res: any) => {
        this.NotInMasterData = res.data
        this.globalBlockUiService.stopLoading()
        this.VisiTableData = true
        this.ExportButtonVisible = this.NotInMasterData.length > 0;
        if (this.NotInMasterData.length == 0) {
          this.Result = "No Data Found"
          this.visible = true;
          this.visible = true;
          this.VisiTableData = false

        }
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
        this.Result = res.message
        this.visible = true

        this.globalBlockUiService.stopLoading()
        this.NotInMasterData = this.NotInMasterData.filter((item: any) => item.id != rowData.id)
      },
      error: (err: any) => {
        this.Result = "Error in approving the record"
        this.visible = true;
        this.globalBlockUiService.stopLoading()
      }
    })
  }

  RemoveRow(rowData: any) {
    this.globalBlockUiService.startLoading();
    this.NotInMasterservice.SendAdminAction({ Id: rowData.id, Status: 3, Approvedby: sessionStorage.getItem('userid'), Remarks: rowData.SCSRemarks }).subscribe({
      next: (res: any) => {
        this.globalBlockUiService.stopLoading()
        this.Result = res.message
        this.visible = true
        this.NotInMasterData = this.NotInMasterData.filter((item: any) => item.id != rowData.id)
      },
      error: (err: any) => {
        this.Result = "Error in approving the record"
        this.visible = true;
        this.globalBlockUiService.stopLoading()
      }
    })
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

  allowOnlyLettersAndNumber(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9\s]*$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

  exportToExcel() {
    const formattedData = this.NotInMasterData.map((item: any) => ({
      Brand: item.Brand ?? '',
      Dealer: item.Dealer ?? '',
      Location: item.Location ?? '',
      PartNumber: item.PartNumber ?? '',
      Description: item.PartDesc ?? '',
      MRP: item.MRP ?? '',
      LandedCost: item.LandedCost ?? '',
      Model: item.Model ?? '',
      MOQ: item.MOQ ?? '',
      PartType: item.PartType ?? '',
      GSTPercentage: item.GSTPer ?? '',
      HSNCode: item.HSNCode ?? '',
      QtyPerVehicle: item.QtyPerVehicle ?? '',
      Name: item.Name ?? '',


      AddedOn: item.Addedon
        ? new Date(item.Addedon).toLocaleString()
        : '',

    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'View Mapping': worksheet },
      SheetNames: ['View Mapping']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    this.saveExcelFile(excelBuffer, 'Not_In_Master_Report');
  }


  saveExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }



}
