import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { AdminvonserviceService } from '../../services/Von/adminvonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Sidebar2Component } from '../../core/sidebar-2/sidebar-2.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';
@Component({
  selector: 'app-admin-von',
  imports: [
    PrimengModuleModule,
    SharedModule,
    SHARED_IMPORTS,
    Sidebar2Component,
    LoaderComponent,
  ],
  templateUrl: './admin-von.component.html',
  styleUrl: './admin-von.component.css',
})
export class AdminVonComponent {
  ngOnInit(): void {
    this.fetchBrandData();
    this.sharedService.updateModuleName('Admin Norms Management');

    this.route.queryParams.subscribe((params: any) => {
      this.brandid = params['brandid'];
      this.dealerid = params['dealerid'];
      this.locationid = params['locationid'];

      if (this.brandid && this.dealerid && this.locationid) {
        localStorage.setItem('brandid', this.brandid);
        localStorage.setItem('dealerid', this.dealerid);
        localStorage.setItem('locationid', this.locationid);

        this.fetchDealerData(this.brandid);
        this.fetchlocation(this.dealerid);

        this.adminFilterData.patchValue({
          brand: Number(this.brandid),
          dealer: this.dealerid,
          location: this.locationid,
        });

        this.onClickSubmitfilterData();
      }
    });

    this.fetchNature();
    this.fetchPartType();
    this.fetchSeasonaData();
    //this.adminvonservice.setLocalStorage();

    this.maxData = [
      { name: 'Planned', code: '1' },
      { name: 'Unplanned', code: '0' },
    ];
    this.adminstatus = [
      { name: 'Reviewd', code: '1' },
      { name: 'Unreviewd', code: '0' },
    ];

    this.adminFilterData.patchValue({
      max: '1',
      status: '0',
    });
  }

  constructor(
    private adminvonservice: AdminvonserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private globalBlockUiService: GlobalBlockUiService,
    private sharedService: SharedServiceService
  ) {}

  // formgroup for filter
  adminFilterData = new FormGroup({
    brand: new FormControl<number | null>(null, [Validators.required]),
    dealer: new FormControl(),
    location: new FormControl(),
    max: new FormControl(),
    partnumber: new FormControl(),
    model: new FormControl(),
    seasonal: new FormControl(),
    fromrange: new FormControl(),
    torange: new FormControl(),
    nature: new FormControl(),
    selectedCategory: new FormControl(),
    status: new FormControl(),
    fromrate: new FormControl(),
    torate: new FormControl(),
    parttype: new FormControl(),
  });

  // diclaration of all the variable
  DealerExcel: any;
  AdminExcel: any;
  locaitonData: any = [];
  AdminPeningView: any = [];
  natureData: any = [];
  modelData: any = [];
  adminstatus: any = [];
  maxData: any = [];
  tableData: any = [];
  seasondata: any = [];
  columns: any[] = [];
  partType: any[] = [];
  dealerRemark: any[] = [];
  brandData: any[] = [];
  familyPartData: any[] = [];
  partFamilySaleData: any = [];
  isloading: boolean = false;
  visible: boolean = false;
  familyPartDataVisible: boolean = false;
  Result: any;
  selectedRemark: any;
  customRemark: any = null;
  Adminviewlog: any = [];
  showTable: boolean = false;
  changelogDialog: boolean = false;
  dealerData: any = [];
  brandid: string = '';
  dealerid: string = '';
  locationid: string = '';
  showSale: boolean = false;
  adminRemark: any = [];
  categories: any[] = [
    { name: 'WS', key: '0' },
    { name: 'CS', key: '1' },
    { name: 'Both', key: '2' },
  ];

  // fetching locations
  onclickDealer() {
    const dealerId = this.adminFilterData.value.dealer ?? ''; // Default to an empty string if null/undefined
    this.fetchlocation(dealerId);
    localStorage.setItem('dealerid', dealerId);
  }
  // fetching brands
  onClickBrand() {
    const brandId = String(this.adminFilterData.value.brand ?? ''); // Default to an empty string if null/undefined
    this.fetchDealerData(brandId);
    localStorage.setItem('brandid', brandId);
    this.fetchModel(brandId);
  }
  // setting location for local storage
  onClickLocation() {
    const locationId = this.adminFilterData.value.location ?? ''; // Default to an empty string if null/undefined
    localStorage.setItem('locationid', locationId);
  }
  // Reset Filter values
  onClickResetField() {
    this.adminFilterData.reset();
  }

  // submitting filter values for fetching data
  onClickSubmitfilterData() {
    console.log(this.adminFilterData.value);

    // validation for empty fields
    if (!this.adminFilterData.valid) {
      this.adminFilterData.markAllAsTouched();
    } else {
      if (!this.adminFilterData.value.selectedCategory) {
        this.adminFilterData.patchValue({
          selectedCategory: { name: 'Both', key: '2' },
        });
      }
      this.fetchAdminPendingView(
        this.adminFilterData.value.brand,
        this.adminFilterData.value.dealer,
        this.adminFilterData.value.location,
        this.adminFilterData.value.status,
        this.adminFilterData.value.fromrange,
        this.adminFilterData.value.torange,
        this.adminFilterData.value.partnumber,
        this.adminFilterData.value.max,
        this.adminFilterData.value.seasonal,
        this.adminFilterData.value.model,
        this.adminFilterData.value.nature,
        this.adminFilterData.value.fromrate,
        this.adminFilterData.value.torate,
        this.adminFilterData.value.parttype
      );
    }
  }
  formattedKeys: any;
  wsCsKeys: any;

  // extracting keys for dynamic columns
  extractKeys(data: any) {
    const keys = Object.keys(data[0]);

    if (this.adminFilterData.value.selectedCategory.key == '0') {
      this.wsCsKeys = keys.filter((key) => key.endsWith('_WS'));
    } else if (this.adminFilterData.value.selectedCategory.key == '1') {
      this.wsCsKeys = keys.filter((key) => key.endsWith('_CS'));
    } else {
      this.wsCsKeys = keys.filter(
        (key) => key.endsWith('_CS') || key.endsWith('_WS')
      );
    }

    // partnumber ko shuru me add karne ke liye ek aur object insert karenge
    this.formattedKeys = [
      { header: 'Part Number', field: 'partnumber' }, // Part Number column added
      ...this.wsCsKeys.map((key: any) => {
        const [month, year, type] = key.split('_');
        const header = `${month} ${year} ${type}`;
        const field = key;
        return { header, field };
      }),
    ];

    return this.formattedKeys;
  }

  // populating dynamic columns in table
  getValues(rowData: any): any[] {
    //console.log(rowData);

    return this.columns.map((col: any) => {
      const value = col.field
        .split('.')
        .reduce((obj: any, key: any) => obj && obj[key], rowData);
      // console.log(value);
      return value;
    });
  }

  // switchig between input field and dropdown
  onRemarkChange(rowData: any, index: number) {
    let obj = this.adminRemark.find((item: any) => {
      return rowData.selectedRemark == item.Remarkid;
    });
    //console.log(obj);
    if (obj.remark == 'Custom') {
      rowData.showOtherInput = true;
    } else {
      rowData.showOtherInput = false;
    }
  }

  //  getting admin view logs for row wise
  onClickViewLog(rowData: any) {
    this.fetchAdminViewlog(
      localStorage.getItem('brandid'),
      localStorage.getItem('dealerid'),
      localStorage.getItem('locationid'),
      rowData.partid
    );
  }
  // getting part family
  onclickPartNumber(partnumber: any) {
    this.fetchFamilyPart(partnumber, localStorage.getItem('brandid'));
  }

  onClickShowSales(rowData: any) {
    this.fetchPartSale(
      localStorage.getItem('brandid'),
      localStorage.getItem('dealerid'),
      localStorage.getItem('locationid'),
      rowData.partnumber
    );
  }

  transformPartFamilySalesData() {
    const data = this.partFamilySaleData;
    if (!data || !Array.isArray(data)) return [];
    const totalObject: any = { partnumber: 'Total' };
    data.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== 'partnumber') {
          totalObject[key] =
            (totalObject[key] || 0) + parseFloat(entry[key] || '0');
        }
      });
    });

    return [...data, totalObject];
  }

  submitAdminRow(rowData: any) {
    this.globalBlockUiService.startLoading();
    const validCustomRemarkRegex = /^(?![\s,@-]*$)(?!-?\d+$)[a-zA-Z0-9\s,@-]*$/;
    this.globalBlockUiService.startLoading();
    if (rowData.selectedRemark == null) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Select the Remark';
      this.globalBlockUiService.stopLoading();
    } else if (rowData.qty == null) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Input the Quantity';
      this.globalBlockUiService.stopLoading();
    } else if (rowData.qty < 0) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Invalid Qty';
      this.globalBlockUiService.stopLoading();
    } else {
      if (rowData.showOtherInput) {
        // Check for empty or invalid customRemark
        if (
          !rowData.customRemark ||
          !validCustomRemarkRegex.test(rowData.customRemark.trim())
        ) {
          this.globalBlockUiService.stopLoading();

          this.visible = true;
          this.Result =
            'Invalid Custom Remark Only Number are not Allowed and  Allowed Special Character are - and @';
          this.globalBlockUiService.stopLoading();
          return;
        }

        this.adminvonservice
          .submitAdminlog({
            brandid: localStorage.getItem('brandid'),
            dealerid: localStorage.getItem('dealerid'),
            locationid: localStorage.getItem('locationid'),
            feedbackid: rowData.feedbackid,
            AdminRemark: rowData.selectedRemark,
            customRem: rowData.customRemark,
            ApprovedQty: rowData.qty,
          })
          .subscribe(
            (res: any) => {
              this.globalBlockUiService.stopLoading();
              this.visible = true;
              this.Result = res.message;
              this.globalBlockUiService.stopLoading();
              rowData.status = 'Reviewed';
            },
            (error: any) => {
              this.globalBlockUiService.stopLoading();
              this.Result =
                'There is no dealer remark for this part, so you cannot add a remark.';
              this.visible = true;
              this.globalBlockUiService.stopLoading();
            }
          );
      } else {
        this.adminvonservice
          .submitAdminlog({
            brandid: localStorage.getItem('brandid'),
            dealerid: localStorage.getItem('dealerid'),
            locationid: localStorage.getItem('locationid'),
            feedbackid: rowData.feedbackid,
            AdminRemark: rowData.selectedRemark,
            customeRem: null,
            ApprovedQty: rowData.qty,
          })
          .subscribe(
            (res: any) => {
              this.globalBlockUiService.stopLoading();
              this.visible = true;
              this.Result = res.message;
              this.globalBlockUiService.stopLoading();
              rowData.status = 'Reviewed';
            },
            (error: any) => {
              this.globalBlockUiService.stopLoading();
              this.visible = true;
              this.Result = 'Remark not submmited';
            }
          );
      }
    }
  }

  // fetching brands
  fetchBrandData() {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getBrandMaster().subscribe((res: any) => {
      this.brandData = res;
      this.globalBlockUiService.stopLoading();
      console.log(this.brandData);
    });
  }
  // Fetch Dealer Data
  fetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
        this.dealerData = res;
        this.dealerData.sort((a: any, b: any) =>
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

  // Fetch Location
  fetchlocation(dealerId: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getlocationMaster({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.locaitonData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching location data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
  }

  // Fetch Nature Data
  fetchNature() {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getNature().subscribe({
      next: (res: any) => {
        this.natureData = res.Data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error('Error fetching nature data:', err);
        this.globalBlockUiService.stopLoading();
      },
    });
  }

  // Fetch Brand Models
  fetchModel(brandid: any) {
    this.adminvonservice.getModel({ brandid }).subscribe({
      next: (res: any) => {
        this.modelData = res.Data;
      },
      error: (err: any) => {
        console.error('Error fetching model data:', err);
      },
    });
  }

  // Fetch Seasonal Data
  fetchSeasonaData() {
    this.adminvonservice.getseason().subscribe({
      next: (res: any) => {
        this.seasondata = res.Data;
      },
      error: (err: any) => {
        console.error('Error fetching seasonal data:', err);
      },
    });
  }

  // Format Dynamic Columns Header
  formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // fetching admin view table
  fetchAdminExportDataOldSP(
    brandid: any,
    dealerid: any,
    r1: any,
    r2: any,
    partnumber: any,
    locationid: any,
    flag: any,
    seasonalid: any,
    modelid: any,
    natureid: any,
    status: null,
    l1: any,
    l2: any,
    parttype: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // ⬅ Promise return kiya
      this.globalBlockUiService.startLoading();
      this.adminvonservice
        .getAdminViewData({
          brandid,
          dealerid,
          r1,
          r2,
          partnumber,
          locationid,
          flag,
          seasonalid,
          modelid,
          natureid,
          status,
          l1,
          l2,
          parttype,
        })
        .subscribe(
          (res: any) => {
            if (res.Data && res.Data.length) {
              this.tableData = res.Data;
              console.log('Fetched Data: ', this.tableData);
              this.globalBlockUiService.stopLoading();
              resolve(this.tableData); // ⬅ Resolve Promise
            } else {
              this.visible = true;
              this.Result = 'No Data Available';
              this.globalBlockUiService.stopLoading();
              reject('No Data Available'); // ⬅ Reject Promise
            }
          },
          (error: any) => {
            this.globalBlockUiService.stopLoading();
            this.visible = true;
            if (error.error?.Error == 'partnumber or locationid is required') {
              this.Result =
                'Part Number Or Dealer Name and Location is Required';
            }
            //this.Result = error.error?.Error || 'Error fetching data';
            reject(error.error?.Error || 'Error fetching data'); // ⬅ Reject Promise
          }
        );
    });
  }

  // fetching admin remark
  fetchAdminRemark(brandid: any, usertype: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getAdminRemark({ brandid, usertype }).subscribe({
      next: (res: any) => {
        this.adminRemark = res.Data;
        this.globalBlockUiService.stopLoading(); // Success case me isloading reset
      },
      error: (err: any) => {
        this.Result = 'Remarker Not Available Please Contact IT Admin';
        this.visible = true;

        this.globalBlockUiService.stopLoading(); // API fail hone par bhi loading false ho
      },
    });
  }

  //fetching  adming view logs row wise
  fetchAdminViewlog(brandid: any, dealerid: any, locationid: any, partid: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice
      .getAdminViewLog({
        brandid: brandid,
        dealerid: dealerid,
        locationid: locationid,
        partid: partid,
      })
      .subscribe((res: any) => {
        if (res.Data && res.Data.length) {
          this.changelogDialog = true;
          this.Adminviewlog = res.Data;
          this.globalBlockUiService.stopLoading();
        } else {
          this.Result =
            'There is No Previous Record, Please Give new Remark for this Part';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        }
      });
  }
  // fetching part type
  fetchPartType() {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getPartType().subscribe((res: any) => {
      this.partType = res.Data;
      this.globalBlockUiService.stopLoading();
    });
  }
  // fetching family part
  fetchFamilyPart(partnumber: any, brandid: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice.getSubstitutePart({ partnumber, brandid }).subscribe({
      next: (res: any) => {
        if (res.Data && res.Data.length) {
          this.familyPartDataVisible = true;
          this.familyPartData = res.Data;
        } else {
          this.visible = true;
          this.Result = 'There is No Substitute Part Available for this Part';
        }
        this.globalBlockUiService.stopLoading(); // Ensure loading is reset in success case
      },
      error: (err: any) => {
        console.error('Error fetching family part data:', err);
        this.visible = true;
        this.Result = 'Failed to fetch substitute part data. Please try again.';
        this.globalBlockUiService.stopLoading(); // Ensure loading is reset in error case
      },
    });
  }

  // excel export function for old SP
  async exportToExcelOldSP(): Promise<any> {
    if (!this.adminFilterData.valid) {
      this.adminFilterData.markAllAsTouched();
    } else {
      if (!this.adminFilterData.value.selectedCategory) {
        this.adminFilterData.patchValue({
          selectedCategory: { name: 'Both', key: '2' },
        });
      }
      await this.fetchAdminExportDataOldSP(
        this.adminFilterData.value.brand,
        this.adminFilterData.value.dealer,
        this.adminFilterData.value.fromrange,
        this.adminFilterData.value.torange,
        this.adminFilterData.value.partnumber,
        this.adminFilterData.value.location,
        this.adminFilterData.value.max,
        this.adminFilterData.value.seasonal,
        this.adminFilterData.value.model,
        this.adminFilterData.value.nature,
        this.adminFilterData.value.status,
        this.adminFilterData.value.fromrate,
        this.adminFilterData.value.torate,
        this.adminFilterData.value.parttype
      );
    }

    console.log(this.tableData);

    const formattedData = this.tableData.map(
      ({ brand, dealer, location, ...rest }: any) => ({
        Brand: rest.brand,
        Dealer: rest.dealer,
        Location: rest.location,
        ...rest, // Pehle sab kuch
        UserRemark: rest.UserRemark ?? '', // Default value if undefined
        ProposedQty: rest.ProposedQty ?? '',
        SPMRemark: rest.SPMRemark ?? '',
        AdminRemark: rest.AdminRemark ?? '',
      })
    );

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Data: worksheet },
      SheetNames: ['Data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    console.log(`${this.tableData[0]?.dealer ?? 'Export'}_Norms_Data.xlsx`);

    saveAs(data, `${this.tableData[0]?.dealer ?? 'Export'}_Norms_Data.xlsx`);
  }

  // excel export function for new SP
  async exportToExcelNewSP(): Promise<any> {
  if (!this.adminFilterData.valid) {
    this.adminFilterData.markAllAsTouched();
  }

  // Filter only Pending status records
  const pendingData = this.AdminPeningView.filter(
    (item: any) => item.status === 'Pending'
  );

  const formattedData = pendingData.map(
    ({
      brand,
      dealer,
      location,
      model,
      Subpartcount,
      partid,
      feedbackdate,
      BlockAvg,
      orderpartnumber,
      partnumber,
      partdesc,
      landedcost,
      maxvalue,
      LocPer,
      Avg3Msale,
      n1,
      n2,
      n3,
      category,
      moq,
      LocCount,
      status,
      LatestAdminRemark,
      AdminRemark,
      RemarkQty,
      ApprovedQty,
      ...rest
    }: any) => ({
      brand: brand,
      dealer: dealer,
      location: location,
      partnumber: partnumber,
      orderpartnumber: orderpartnumber,
      partdesc: partdesc,
      landedcost: landedcost,
      moq: moq,
      Avg3Msale: Avg3Msale,
      maxvalue: maxvalue,
      n1: n1,
      n2: n2,
      n3: n3,
      category: category,
      model: model,
      feedbackdate: feedbackdate,
      LatestAdminRemark: LatestAdminRemark,
      Block_Average: BlockAvg,
      Location_percentage: LocPer,
      Location_count: LocCount,
      ApprovedQty: '',
      AdminRemark: ''
    })
  );

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook: XLSX.WorkBook = {
    Sheets: { Data: worksheet },
    SheetNames: ['Data'],
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  const data: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(
    data,
    `${pendingData[0]?.dealer ?? 'Admin_Export'}_Norms_Data.xlsx`
  );
}


  // part Sale Data
  fetchPartSale(brandid: any, dealerid: any, locationid: any, partnumber: any) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice
      .getPartFamilySales({ brandid, dealerid, locationid, partnumber })
      .subscribe({
        next: (res: any) => {
          if (!res.Data || res.Data.length === 0) {
            this.Result = 'No Sales Available for this';
            this.visible = true;
          } else {
            this.showSale = true;
            this.partFamilySaleData = res.Data;
            this.partFamilySaleData = this.transformPartFamilySalesData();

            //console.log(this.partFamilySaleData);
            this.columns = this.extractKeys(this.partFamilySaleData);
            console.log(this.columns);

            this.globalBlockUiService.stopLoading();
          }
          // API success hone ke baad loading false karenge
        },
        error: (err: any) => {
          this.Result = 'Something is not well Please Contact IT Admin';
          this.visible = true;
          this.globalBlockUiService.stopLoading(); // API fail hone par bhi loading false ho
        },
      });
  }

  // Admin pending View for new table
  fetchAdminPendingView(
    brandid: any,
    dealerid: any,
    locationid: any,
    status: any,
    r1: any,
    r2: any,
    partnumber: any,
    flag: any,
    seasonalid: any,
    modelid: any,
    natureid: any,
    l1: any,
    l2: any,
    parttype: any
  ) {
    this.globalBlockUiService.startLoading();
    this.adminvonservice
      .getAdminPendinview({
        brandid: brandid,
        dealerid: dealerid,
        locationid: locationid,
        status: status,
        r1: r1,
        r2: r2,
        partnumber: partnumber,
        flag: flag,
        seasonalid: seasonalid,
        modelid: modelid,
        natureid: natureid,
        l1: l1,
        l2: l2,
        parttype: parttype,
      })
      .subscribe({
        next: (res: any) => {
          if (!res.Data || res.Data.length === 0) {
            this.Result = 'No Data Available';
            this.visible = true;
            this.globalBlockUiService.stopLoading();
          } else {
            this.AdminPeningView = res.Data;
            this.fetchAdminRemark(
              this.adminFilterData.value.brand,
              localStorage.getItem('usertype')
            );
            this.globalBlockUiService.stopLoading();
          }
        },
        error: (err: any) => {
          this.Result = 'Something is not well Please Contact IT Admin';
          this.visible = true;
          this.globalBlockUiService.stopLoading();
        },
      });
  }

  // error handling yet to be done
  selectedFileName: any;
  onFileSelectDealer(event: any) {
    if (event.files && event.files.length > 0) {
      this.DealerExcel = event.files[0];
      this.selectedFileName = event.files[0].name; // Pehli file select karna
    }
  }

  UploadExcelDealer() {
    this.globalBlockUiService.startLoading();

    if (!this.DealerExcel) {
      console.error('Please select a file first!');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.DealerExcel);
    this.adminvonservice.uploadExcelDealer(formData).subscribe(
      (res: any) => {
        this.Result = res.message;
        this.showupload = false;
        this.globalBlockUiService.stopLoading();
        this.visible = true;
      },
      (error) => {
        if (error.error.Error) {
          this.visible = true;
          this.Result = 'File Upload Failed';
          this.selectedFileName = '';
          this.globalBlockUiService.stopLoading();
        } else if (error.error.message && error.error.pendingRecords) {
          console.error('File upload failed:', error);
          this.visible = true;
          const partNumbers = error.error.pendingRecords
            .map((rec: any) => rec.PartNumber)
            .join(', ');
          this.Result = `${error.error.message} following are the Partnumber ${partNumbers} `;
          this.globalBlockUiService.stopLoading();
          this.showupload = false;
          this.selectedFileName = '';
        } else if (error.error.pendingRecords) {
          console.error('File upload failed:', error);
          this.visible = true;
          const partNumbers = error.error.pendingRecords
            .map((rec: any) => rec.PartNumber)
            .join(', ');
          this.Result = `${error.error.message} (${partNumbers}) `;
          this.globalBlockUiService.stopLoading();
          this.showupload = false;
          this.selectedFileName = '';
        }
      }
    );
  }
  showupload: boolean = false;
  onClickShowUpload() {
    this.showupload = true;
  }
  adminFileName: any;
  onFileSelectAdmin(event: any) {
    if (event.files && event.files.length > 0) {
      this.AdminExcel = event.files[0];
      this.adminFileName = event.files[0].name; // Pehli file select karna
    }
  }

  UploadExcelAdmin() {
    this.globalBlockUiService.startLoading();

    if (!this.AdminExcel) {
      console.error('Please select a file first!');
      return;
    }
    const formData = new FormData();
    formData.append('file2', this.AdminExcel);
    this.adminvonservice.AdminuploadExcel(formData).subscribe(
      (res: any) => {
        this.Result = res.message;
        this.showupload = false;
        this.globalBlockUiService.stopLoading();
        this.visible = true;
        this.adminFileName = '';
      },
      (error) => {
        console.error('File upload failed:', error);
        this.visible = true;
        this.Result = 'File upload failed';
        this.globalBlockUiService.stopLoading();
        this.showupload = false;
        this.adminFileName = '';
      }
    );
  }

  OnclickPendinCount() {
    this.router.navigate(['/pcount']);
  }

  sidebarvisible: boolean = false;

  onClickSidebar() {
    this.sidebarvisible = true;
    console.log(this.sidebarvisible);
  }
}
