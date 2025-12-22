import { Component, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { BrandWiseUserMappingServiceService } from '../../../services/Auto-Approvals/brand-wise-user-mapping-service.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-brand-wise-user-mapping',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './brand-wise-user-mapping.component.html',
  styleUrl: './brand-wise-user-mapping.component.css'
})
export class BrandWiseUserMappingComponent {

  BrandUserMapping: FormGroup;
  constructor(private globalBlockUiService: GlobalBlockUiService, private sharedService: SharedServiceService, private fb: FormBuilder, private MasterService: MasterServiceService, private BrandUserMappingService: BrandWiseUserMappingServiceService) {
    this.BrandUserMapping = this.fb.group({
      Brand: [null, Validators.required],
      Dealer: [null, Validators.required],
      Location: [null, Validators.required],
      AssignedUser: [null, Validators.required]
    });
  }


  EditBrandUserMapping = new FormGroup({
    Brand: new FormControl(null, Validators.required),
    Dealer: new FormControl(null, Validators.required),
    Location: new FormControl(null, Validators.required),
    AssignedUser: new FormControl(null, Validators.required)

  })


  Result: any
  visible: any
  userid: any;
  visibleTableData: boolean = false;
  editDialogVisible: boolean = false;
  visibleExportButton: boolean = false;

  ngOnInit(): void {
    this.sharedService.updateModuleName('Brand Wise User Mapping');
    this.FetchBrandData()
    this.FetchUsersData()
    this.userid = sessionStorage.getItem('userid')
  }

  onClickSave() {
    console.log(this.BrandUserMapping.value);
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

  BrandData: any
  FetchBrandData() {
    this.globalBlockUiService.startLoading()
    this.MasterService.getBrandMaster().subscribe({
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
    this.FetchDealerData(this.BrandUserMapping.value.Brand)
  }


  DealerData: any
  FetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading()
    this.MasterService.getDealersMasterMulti({ BrandIds: brandid }).subscribe({
      next: (res: any) => {
        this.DealerData = res.data
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading();
      }
    })
  }

  OnclickDealer() {
    this.FetchLocationData(this.BrandUserMapping.value.Dealer)
  }

  OnclickEditBrand() {
    this.fetchDealerEditData(this.EditBrandUserMapping.value.Brand)
  }



  DealerEditData: any
  // Fetch Dealer Data
  fetchDealerEditData(brandid: any) {
    //this.globalBlockUiService.startLoading();
    this.MasterService.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {

        this.DealerEditData = res;
        this.DealerEditData.sort((a: any, b: any) =>
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

  LocationData: any
  FetchLocationData(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.MasterService.getlocationMasterMulti({ DealerIds: dealerid }).subscribe({
      next: (res: any) => {
        this.LocationData = res.data
        this.globalBlockUiService.stopLoading()
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading()

      }
    })
  }


  OnClickEditDealer() {
    this.fetchlocation(this.EditBrandUserMapping.value.Dealer)
  }


  LocationEditData: any
  fetchlocation(dealerid: any) {
    //this.globalBlockUiService.startLoading();
    this.MasterService.getlocationMaster({ dealerid: dealerid }).subscribe({
      next: (res: any) => {
        this.LocationEditData = res;
        //this.globalBlockUiService.stopLoading();
        console.log(this.LocationEditData);

      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        //this.globalBlockUiService.stopLoading();
      }
    });
  }


  UserData: any

  FetchUsersData() {
    this.globalBlockUiService.startLoading();
    this.MasterService.getUsersData().subscribe({
      next: (res: any) => {
        this.UserData = res.data
        this.globalBlockUiService.stopLoading()
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading()

      }
    })
  }


  DealerMapping: any[] = []

  ExtractDealerObject(dealerArray: any[]) {
    if (dealerArray.length == null) {
      this.DealerMapping = []
      return;
    }
    this.DealerMapping = this.DealerData.filter(
      (d: any) => dealerArray.includes(d.DealerID)
    );
  }

  BrandMapping: any[] = []
  FromateBrandObject(brandArray: any[]) {

    this.BrandMapping = brandArray.map(id => ({ BrandId: id.bigid, DealerId: null, LocationId: null }));
  }

  LocationMapping: any[] = []
  ExtractLocationObject(locationArray: any[]) {
    if (locationArray.length == null) {
      this.LocationMapping = []
      return;
    }
    this.LocationMapping = this.LocationData.filter(
      (l: any) => locationArray.includes(l.LocationID)

    );


  }

  MapUseridToLocaiton() {
    const userIds: number[] = this.BrandUserMapping.value.AssignedUser;

    this.LocationMapping = this.LocationMapping.flatMap((loc: any) =>
      userIds.map((uid: number) => ({
        BrandId: loc.BrandId,
        DealerId: loc.DealerId,
        LocationId: loc.LocationId,
        Location: loc.Location,
        userId: uid
      }))
    );

    console.log(this.LocationMapping);
  }




  CreatePayload() {
    this.FromateBrandObject(this.BrandUserMapping.value.Brand);
    if (this.BrandUserMapping.value.Dealer != null && this.BrandUserMapping.value.Dealer.length > 0) {
      this.ExtractDealerObject(this.BrandUserMapping.value.Dealer);
    }
    if (this.BrandUserMapping.value.Location != null && this.BrandUserMapping.value.Location.length > 0) {
      this.ExtractLocationObject(this.BrandUserMapping.value.Location);
    }

    this.LocationMapping = this.LocationMapping.map((loc: any) => {
      return {
        ...loc,
        LocationId: loc.LocationID,
      };
    });
    this.MapUseridToLocaiton();


    if (this.LocationMapping.length > 0) {
      if (this.BrandUserMapping.valid) {
        this.SendUserMapping(this.LocationMapping, this.userid);
      }
      else {
        this.BrandUserMapping.markAllAsTouched()
      }
    }
    //  if(this.DealerMapping.length > 0 && this.LocationMapping.length == 0){
    //   this.SendUserMapping(this.DealerMapping, this.userid);
    //  }
    //  if (this.BrandMapping.length > 0 && this.DealerMapping.length == 0 && this.LocationMapping.length == 0) {
    //   this.SendUserMapping(this.BrandMapping, this.userid);  
    // }

    // const brands = this.BrandUserMapping.value.Brand || [];
    // const dealers = this.BrandUserMapping.value.Dealer || [];
    // const locations = this.BrandUserMapping.value.Location || [];
    // const users = this.BrandUserMapping.value.AssignedUser || [];

    // const payload: any[] = [];

    // brands.forEach((BrandId: any) => {
    //   dealers.forEach((DealerId: any) => {
    //     locations.forEach((LocationId: any) => {
    //       users.forEach((userId: any) => {
    //         payload.push({
    //           BrandId,
    //           DealerId,
    //           LocationId,
    //           userId
    //         });
    //       });
    //     });
    //   });
    // });

    // console.log("FINAL PAYLOAD", payload);

    // if (this.BrandUserMapping.valid) {
    //   this.SendUserMapping(payload, this.userid);

    // }
    // else {
    //   this.BrandUserMapping.markAllAsTouched()
    // }


  }


  SendUserMapping(payload: any, addedby: any) {
    this.globalBlockUiService.startLoading();
    this.BrandUserMappingService.SendBrandWiseUserMapping({ payload: payload, addedby: addedby }).subscribe({
      next: (res: any) => {

        this.Result = res.message
        this.visible = true;
        this.globalBlockUiService.stopLoading()
        this.BrandUserMapping.reset()
      },

      error: (err: any) => {
        this.Result = err.Error.message;
        this.visible = true;
        this.globalBlockUiService.stopLoading()
        this.BrandUserMapping.reset()
      }
    })
  }

  onclickViewUsermapping() {
    this.FetchUserMapping(this.BrandUserMapping.value.Brand, this.BrandUserMapping.value.Dealer, this.BrandUserMapping.value.Location, this.BrandUserMapping.value.AssignedUser)
  }

  ViewMappingData: any
  FetchUserMapping(BrandId: any, DealerId: any, LocationId: any, UserId: any) {
    this.globalBlockUiService.startLoading();
    this.BrandUserMappingService.FetchBrandwiseUserMapping({ BrandId, DealerId, LocationId, UserId }).subscribe({
      next: (res: any) => {
        this.ViewMappingData = res.data
        this.globalBlockUiService.stopLoading()
        this.visibleTableData = true;
        this.visibleExportButton = this.ViewMappingData.length > 0;
      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
        this.Result = err?.error?.message || "Something went wrong!";
        this.visible = true;
        this.visibleTableData = false;
        this.visibleExportButton = false;

      }
    })
  }


  OnclickEdit() {
    this.editDialogVisible = true;

  }

  OnclickSendEditBrandWiseUserMapping() {

  }

  EditBrandWiseUserMapping() {

    if (this.EditBrandUserMapping.valid) {

      this.globalBlockUiService.startLoading();

      const formValue = this.EditBrandUserMapping.value;

      const requestBody = {
        payload: [
          {
            BrandId: formValue.Brand,
            DealerId: formValue.Dealer,
            LocationId: formValue.Location,
            userId: formValue.AssignedUser
          }
        ],
        addedby: this.userid
      };

      this.BrandUserMappingService.EditBrandWiseUserMapping(requestBody)
        .subscribe({
          next: (res: any) => {
            this.Result = res.message;
            this.visible = true;
            this.globalBlockUiService.stopLoading();
            this.EditBrandUserMapping.reset();
          },

          error: (err: any) => {
            this.Result = err?.error?.message || "Something went wrong!";
            this.visible = true;
            this.globalBlockUiService.stopLoading();
            this.EditBrandUserMapping.reset();
          }
        });
    }
    else {
      this.EditBrandUserMapping.markAllAsTouched()
    }

  }


  exportToExcel() {
    const formattedData = this.ViewMappingData.map((item: any) => ({
      Brand: item.Brand ?? '',
      Dealer: item.Dealer ?? '',
      Location: item.Location ?? '',
      Name: item.Name ?? '',
      AddedOn: item.Addedon
        ? new Date(item.Addedon).toLocaleString()
        : '',
      AddedBy: item.AddedBy ?? ''
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

    this.saveExcelFile(excelBuffer, 'View_Mapping_Data');
  }


  saveExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }




}





