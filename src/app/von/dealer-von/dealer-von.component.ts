import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { DealervonserviceService } from '../../services/Von/dealervonservice.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Sidebar2Component } from "../../core/sidebar-2/sidebar-2.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';
@Component({
  selector: 'app-dealer-von',
  imports: [PrimengModuleModule, SharedModule, SHARED_IMPORTS],
  templateUrl: './dealer-von.component.html',
  styleUrl: './dealer-von.component.css'
})
export class DealerVonComponent {

  dealerFilterData = new FormGroup({
    location: new FormControl('', Validators.required),
    max: new FormControl(),
    partnumber: new FormControl(),
    model: new FormControl(),
    seasonal: new FormControl(),
    fromrange: new FormControl(),
    torange: new FormControl(),
    nature: new FormControl(),
    selectedCategory: new FormControl(),
    fromrate: new FormControl(),
    torate: new FormControl(),
    parttype: new FormControl(),
    status: new FormControl()
  });

  constructor(private dealerVonService: DealervonserviceService,
    private globalBlockUiService: GlobalBlockUiService,
    private sharedService: SharedServiceService) { }

  categories: any[] = [
    { name: 'WS', key: '0' },
    { name: 'CS', key: '1' },
    { name: 'Both', key: '2' },
  ];

  ngOnInit(): void {

    // sessionStorage.setItem('brandid','9')
    // sessionStorage.setItem('dealerid','8')
    // sessionStorage.setItem('usertype','U')
    //this.dealerVonService.setsessionStorage()
    this.dealerFilterData.reset();
    this.globalBlockUiService.startLoading();
    this.dealerstatus = [
      { name: 'Reviewed', code: '2' },
      { name: 'Unreviewed', code: '1' },
      { name: 'No Feedback', code: '0' }

    ];
    this.maxData = [
      { name: 'Planned', code: '1' },
      { name: 'Unplanned', code: '0' },
    ];
    //this.dealerVonService.setsessionStorage();
    this.fetchlocation(sessionStorage.getItem('dealerid'));
    this.fetchNature();
    this.fetchModel(sessionStorage.getItem('brandid'));
    this.fetchSeasonaData();
    this.fetchPartType();
    this.globalBlockUiService.stopLoading();
    this.dealerFilterData.patchValue({
      max: '1',  // Code set karna hoga kyunki optionValue="code" hai

    });

    this.sharedService.updateModuleName('Dealer Norms Management')
  }




  //Declaretion of all Variables

  rangeValues: any;

  locationData: any = [];
  natureData: any = [];
  modelData: any = [];
  maxData: any = [];
  tableData: any = [];
  seasondata: any = [];
  partType: any = [];
  dealerstatus: any
  noOfRow: number = 0;
  pendingCount: number = 0;
  reviewedCount: number = 0;
  partFamilySaleData: any = [];
  columns: any[] = [];
  dealerRemark: any[] = [];
  dealerViewLog: any = [];
  familyPartData: any = [];
  familyPartDataVisible: boolean = false
  isloading: boolean = false;
  isWSenable: boolean = false;
  isCsenable: boolean = false;
  showTable: boolean = false;
  changelogDialog: boolean = false;
  showOtherInput: boolean = false;
  showSale: boolean = false
  customRemark: any = null;
  Result: any;
  visible: any;



  onClickCloseSales() {
    this.showSale = false
  }

  userid: any = sessionStorage.getItem('userid')

  // for sending dealer logs
  sendlog(
    partid: any,
    max: any,
    remarkid: any,
    customrem: any,
    proposedqty: any,
    addedby: any
  ) {
    this.dealerVonService
      .submituserlog({
        partid: partid,
        max: max,
        remarkid: remarkid,
        customrem: null,
        proposedqty: proposedqty,
        addedby: this.userid
      })
      .subscribe((res: any) => {
        this.visible = true;
        this.Result = res.message;
      });
  }

  // for view log 

  onClickViewLog(rowData: any) {
    this.fetchDelerViewlog(
      sessionStorage.getItem('brandid'),
      sessionStorage.getItem('dealerid'),
      rowData.locationid,
      rowData.Partid
    );
  }
  // reset filter button
  onClickReset() {
    this.dealerFilterData.reset();
  }

  // fetching table data for showing table
  onSubmitfilterData() {

    if (this.dealerFilterData.get('partnumber')?.value === '') {
      this.dealerFilterData.get('partnumber')?.setValue(null);
    }
    if (!this.dealerFilterData.valid) {
      this.dealerFilterData.markAllAsTouched();
    } else {
      if (!this.dealerFilterData.value.selectedCategory) {
        this.dealerFilterData.patchValue({
          selectedCategory: { name: 'Both', key: '2' },
        });
      }

      this.fetchDealerTableData(
        this.dealerFilterData.value.fromrate,
        this.dealerFilterData.value.torate,
        sessionStorage.getItem('dealerid'),
        this.dealerFilterData.value.parttype,
        this.dealerFilterData.value.fromrange,
        this.dealerFilterData.value.torange,
        this.dealerFilterData.value.partnumber,
        this.dealerFilterData.value.location,
        this.dealerFilterData.value.max,
        this.dealerFilterData.value.seasonal,
        this.dealerFilterData.value.nature,
        this.dealerFilterData.value.model,
        sessionStorage.getItem('brandid')
      );
    }
  }
  // fetching location from master api
  // Fetch Location Data
  fetchlocation(dealerId: any) {
    this.globalBlockUiService.startLoading();
    this.dealerVonService.getlocationMaster({ dealerid: dealerId }).subscribe({
      next: (res: any) => {
        this.locationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  // Fetch Nature Data
  fetchNature() {
    this.globalBlockUiService.startLoading();
    this.dealerVonService.getNature().subscribe({
      next: (res: any) => {
        this.natureData = res.Data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching nature data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  // Fetch Model Data
  fetchModel(brandid: any) {
    this.globalBlockUiService.startLoading();
    this.dealerVonService.getModel({ brandid }).subscribe({
      next: (res: any) => {
        this.modelData = res.Data;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching model data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  // for populating the dynamic columns for month wise sale
  getValues(rowData: any): any[] {
    return this.columns
      .filter(
        (col: any) =>
          col.field !== 'Brand' &&
          col.field !== 'Dealer' &&
          col.field !== 'Partid'
      ) // "Brand", "Dealer", "PartID" ko hata diya
      .map((col: any) => {
        const value = col.field
          .split('.')
          .reduce((obj: any, key: any) => obj && obj[key], rowData);
        return value;
      });
  }
  // fetch function for dealer table 
  fetchDealerTableData(
    l1: any, l2: any, dealerid: any, parttype: any, from: any, to: any,
    partnumber: any, location: any, max: any, seasonalid: any,
    natureid: any, modelid: any, brandid: any
  ) {
    this.globalBlockUiService.startLoading();
    this.dealerVonService.getdelarTableView({
      l1, l2, dealerid, parttype, r1: from, r2: to, partnumber,
      locationid: location, flag: max, seasonalid, natureid, modelid, brandid
    }).subscribe({
      next: (res: any) => {
        this.pendingCount = 0;
        this.reviewedCount = 0;
        if (res.Data && res.Data.length) {
          if (this.dealerFilterData.value.status == '0') {
            this.tableData = res.Data.filter((item: any) => item.status == '0')
            if (this.tableData.length == 0) {
              this.Result = "No Data Avaiable"
              this.visible = true;
              this.onClickCloseSales()
            }
          }
          else if (this.dealerFilterData.value.status == '1') {
            this.tableData = res.Data.filter((item: any) => item.status == '1')
            if (this.tableData.length == 0) {
              this.Result = "No Data Avaiable"
              this.visible = true;
              this.onClickCloseSales()
            }
          }
          else if (this.dealerFilterData.value.status == '2') {
            this.tableData = res.Data.filter((item: any) => item.status == '2')
            if (this.tableData.length == 0) {
              this.Result = "No Data Avaiable"
              this.visible = true;
              this.onClickCloseSales()
            }
          }
          else {
            this.tableData = res.Data
            this.onClickCloseSales()
          }
          this.noOfRow = res.Data.length

          res.Data.forEach((item: any) => {
            console.log(item.status);
            if (item.status == 1) {
              this.pendingCount++;

            }
            else if (item.status == 2) {
              this.reviewedCount++

            }
          })

        } else {
          this.visible = true;
          this.Result = "Max Not Uploaded for this Part"
        }

        this.fetchDealerRemark(
          sessionStorage.getItem('brandid'),
          sessionStorage.getItem('usertype')
        );

        this.showTable = true;
        this.globalBlockUiService.stopLoading();  // Ensure `isloading` is reset in success case
      },
      error: (err: any) => {
        let msg = err.error.message
        let error = err.error.Error
        if (msg) {
          console.log(msg);

          this.Result = msg;
          this.visible = true
        }
        else if (error) {
          this.Result = error;
          this.visible = true
        }
        else {

          this.visible = true
          this.Result = 'Failed to load Sales Information'

        }
        console.error("Error fetching dealer table data:", err);
        // this.Result = "Failed to fetch data. Please try again.";
        // this.visible = true;
        this.onClickCloseSales()
        this.globalBlockUiService.stopLoading();  // Ensure `isloading` is reset in failure case
      }
    });
  }

  // switching between dropdown and input field
  onRemarkChange(rowData: any, index: number) {
    let obj = this.dealerRemark.find((item: any) => {
      return rowData.selectedRemark == item.Remarkid;
    });
    //console.log(obj);
    if (obj.remark == 'Custom') {
      rowData.showOtherInput = true;
    } else {
      rowData.showOtherInput = false;
    }
  }
  // fatching partfamily details
  onclickPartNumber(rowData: any) {
    this.fetchFamilyPart(rowData.partnumber);
  }

  onClickShowSales(rowData: any) {

    this.fetchPartSale(
      sessionStorage.getItem('brandid'),
      sessionStorage.getItem('dealerid'),
      rowData.Locationid,
      rowData.partnumber
    )
  }
  // submitting user remarks
  submitRow(rowData: any) {


    const validCustomRemarkRegex = /^(?![\s,@-]*$)(?!-?\d+$)[a-zA-Z0-9\s,@-]*$/;

    // Validate selected remark
    if (rowData.selectedRemark == null) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Select the Remark';
      return;
    }

    // Validate quantity
    if (rowData.qty == null) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Input the Quantity';
      return;
    }

    if (rowData.qty < 0) {
      this.globalBlockUiService.stopLoading();
      this.visible = true;
      this.Result = 'Invalid Qty';
      return;
    }

    // Validate custom remark only if selectedRemark is 'custom'
    // Adjust condition if your dropdown uses numeric ID for custom, like (rowData.selectedRemark === -1)
    if (rowData.showOtherInput) {
      if (rowData.customRemark == '') {
        this.globalBlockUiService.stopLoading();
        this.visible = true;
        this.Result = 'Input Custom Remark';
        return;
      }

      if (!validCustomRemarkRegex.test(rowData.customRemark.trim())) {
        this.globalBlockUiService.stopLoading();
        this.visible = true;
        this.Result = 'Invalid Custom Remark. Only numbers are not allowed. Allowed characters: letters, space, "-", and "@"';
        return;
      }
    }


    this.globalBlockUiService.startLoading()
    // Proceed with submission
    this.dealerVonService
      .submituserlog({
        brandid: sessionStorage.getItem('brandid'),
        dealerid: sessionStorage.getItem('dealerid'),
        locationid: rowData.Locationid,
        partid: rowData.Partid,
        max: rowData.Maxvalue,
        remarkid: rowData.selectedRemark,
        customrem: rowData.customRemark,
        proposedqty: rowData.qty,
        addedby: this.userid
      })
      .subscribe(
        (res: any) => {
          this.globalBlockUiService.stopLoading();
          this.visible = true;
          this.Result = res.message;
          rowData.hidden = true;
        },
        (error: any) => {
          this.globalBlockUiService.stopLoading();
          this.visible = true;
          this.Result = error.error?.Error || 'Techincal issue! Try Again After Some Time';
        }
      );
  }
  formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  fetchSeasonaData() {
    this.dealerVonService.getseason().subscribe({
      next: (res: any) => {
        this.seasondata = res.Data;
      },
      error: (err) => {
        console.error('Error fetching seasonal data:', err);
        // Optionally, show a message to the user
        this.Result = 'Unable to fetch seasonal data. Please try again.';
        this.visible = true;
      }
    });
  }

  // fetching dealer Remark
  fetchDealerRemark(brandid: any, usertype: any) {
    this.dealerVonService
      .getDealerRemark({ brandid: brandid, usertype: usertype })
      .subscribe({
        next: (res: any) => {
          this.dealerRemark = res.Data;
        },
        error: (err) => {
          console.error('Error fetching dealer remark:', err);
          // Optionally, show a message to the user
          this.Result = 'Unable to fetch dealer remarks. Please try again.';
          this.visible = true;
        }
      });
  }


  formattedKeys: any;
  wsCsKeys: any;

  extractKeys(data: any) {
    const keys = Object.keys(data[0]);

    if (this.dealerFilterData.value.selectedCategory.key == '0') {
      this.wsCsKeys = keys.filter((key) => key.endsWith('_WS'));
    } else if (this.dealerFilterData.value.selectedCategory.key == '1') {
      this.wsCsKeys = keys.filter((key) => key.endsWith('_CS'));
    } else {
      this.wsCsKeys = keys.filter((key) => key.endsWith('_CS') || key.endsWith('_WS'));
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

  // fetching dealer view log
  fetchDelerViewlog(brandid: any, dealerid: any, locationid: any, partid: any) {
    this.globalBlockUiService.startLoading();

    this.dealerVonService
      .getDealerViewLog({
        brandid: brandid,
        dealerid: dealerid,
        locationid: locationid,
        partid: partid,
      })
      .subscribe({
        next: (res: any) => {
          if (res.Data && res.Data.length) {
            this.changelogDialog = true;
            this.dealerViewLog = res.Data;
          } else {
            this.Result = 'There is No Previous Record, Please Give new Remark for this Part';
            this.visible = true;
          }
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          console.error('Error while fetching dealer view log:', err);
          this.globalBlockUiService.stopLoading();
          this.Result = 'Something went wrong while fetching logs. Please try again later.';
          this.visible = true;
        }
      });
  }


  // fetching parttype dropdowndata
  fetchPartType() {
    this.globalBlockUiService.startLoading();
    this.dealerVonService.getPartType().subscribe((res: any) => {
      this.partType = res.Data;
      this.globalBlockUiService.stopLoading();
    });
  }
  // fetching part family detils
  fetchFamilyPart(partnumber: any) {
    this.globalBlockUiService.startLoading();

    this.dealerVonService
      .getSubstitutePart({ partnumber: partnumber })
      .subscribe({
        next: (res: any) => {
          if (res.Data && res.Data.length) {
            this.familyPartDataVisible = true;
            this.familyPartData = res.Data;
          } else {
            this.visible = true;
            this.Result = 'There is No Substitute Part Available for this Part';
          }
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          console.error('Error fetching substitute parts:', err);
          this.globalBlockUiService.stopLoading();
          this.visible = true;
          this.Result = 'Unable to fetch substitute parts. Please try again later.';
        }
      });
  }


  exportToExcel(): void {

    // Unwanted keys hatao aur columns ko order karo
    const formattedData = this.tableData.map(({ Brandid, Dealerid, Partid, Locationid, status, feedbackid, UserRemark, ProposedQty, ...rest }: any) => ({
      ...rest, // Baaki sab pehle rahega
      UserRemark: null, // UserRemark ko last me shift kiya
      ProposedQty: null
    }));
    console.log(formattedData);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(data, `${this.tableData[0].Dealer}_Norms_Data.xlsx`);
  }


  fetchPartSale(brandid: any, dealerid: any, locationid: any, partnumber: any) {
    this.globalBlockUiService.startLoading();

    this.dealerVonService
      .getPartFamilySales({
        brandid: brandid,
        dealerid: dealerid,
        locationid: locationid,
        partnumber: partnumber
      })
      .subscribe({
        next: (res: any) => {
          this.partFamilySaleData = res.Data;
          this.showSale = true;
          this.columns = this.extractKeys(this.partFamilySaleData);
          this.globalBlockUiService.stopLoading();
        },
        error: (err) => {
          console.error('Error fetching part sale data:', err);
          this.globalBlockUiService.stopLoading();
          this.Result = 'Unable to fetch part sale data. Please try again later.';
          this.visible = true;
        }
      });
  }




  sidebarvisible: boolean = false;

  onClickSidebar() {
    this.sidebarvisible = true
    console.log(this.sidebarvisible);

  }
}
