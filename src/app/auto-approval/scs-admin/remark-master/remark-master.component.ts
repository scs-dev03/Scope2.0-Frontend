import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { SharedServiceService } from '../../../services/shared-service.service';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { BrandWiseUserMappingServiceService } from '../../../services/Auto-Approvals/brand-wise-user-mapping-service.service';
import { RemarkServiceService } from '../../../services/Auto-Approvals/remark-service.service';
import { throwIfEmpty } from 'rxjs';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-remark-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './remark-master.component.html',
  styleUrl: './remark-master.component.css'
})
export class RemarkMasterComponent {

  ngOnInit(): void {
    this.FetchUsersData()
    this.FetchBrandData()
    this.userid = sessionStorage.getItem('userid')

  }

  userid: any

  remarkForm!: FormGroup;
  Result: any
  visible: boolean = false
  visibleTableData:boolean = false

  constructor(private remarkservice: RemarkServiceService, private fb: FormBuilder, private globalBlockUiService: GlobalBlockUiService, private sharedService: SharedServiceService, private MasterService: MasterServiceService, private remarkFormService: BrandWiseUserMappingServiceService) {
    this.remarkForm = this.fb.group({
      userType: [null, Validators.required],
      remarkType: [null],
      brand: [null],
      dealer: [null],
      location: [null],
      remark: ['', Validators.required]
    });
  }


  EditRemarkForm = new FormGroup({
    brand: new FormControl(null),
    dealer: new FormControl(null),
    location: new FormControl(null),
    remark: new FormControl(null),
    remarkTypeId: new FormControl(null)
  })

  UserTypeData: any = [
    {
      "Name": "User",
      "Id": "D"
    },
    {
      "Name": "Admin",
      "Id": "A"
    }
  ]

  editDialogVisible: boolean = false
  rowId: any
  OnClickUpdateRemark(rowData: any) {
    this.editDialogVisible = true
    this.rowId = rowData.Id;

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
    this.FetchDealerData(this.remarkForm.value.brand)
  }
  OnclickEditBrands() {
    if(this.EditRemarkForm.valid){
      this.FetchDealerData(this.EditRemarkForm.value.brand)
    }
    else{
      this.EditRemarkForm.markAllAsTouched()
    }
  }


  DealerData: any
  FetchDealerData(brandid: any) {
    this.globalBlockUiService.startLoading()
    this.MasterService.getDealersMaster({ brandid: brandid }).subscribe({
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
    this.FetchLocationData(this.remarkForm.value.dealer)
  }
  OnclickEditDealer() {
    this.FetchLocationData(this.EditRemarkForm.value.dealer)
  }

  LocationData: any
  FetchLocationData(dealerid: any) {
    this.globalBlockUiService.startLoading();
    this.MasterService.getlocationMaster({ dealerid: dealerid }).subscribe({
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

  OnclickUser() {
    this.FetchRemarkData(this.remarkForm.value.userType)
  }

  RemarkData: any
  FetchRemarkData(Type: any) {
    this.globalBlockUiService.startLoading();
    this.remarkservice.fetchRemarkMaster({ Type: Type }).subscribe({
      next: (res: any) => {
        this.RemarkData = res.data
        this.globalBlockUiService.stopLoading()
      },
      error: (err: any) => {
        console.log(err);
        this.globalBlockUiService.stopLoading()
      }
    })
  }

  onClickSendData() {
    if (this.remarkForm.valid) {
      this.SendRemarkData(this.remarkForm.value.brand, this.remarkForm.value.dealer, this.remarkForm.value.location, this.remarkForm.value.remark, this.remarkForm.value.remarkType, this.userid)
    } else {
      this.remarkForm.markAllAsTouched()
    }
  }
  SendRemarkData(BrandId: any, DelaerId: any, LocationId: any, Remark: any, Remarktype: any, userid: any) {
    this.globalBlockUiService.startLoading();
    this.remarkservice.SendRemarkData({ BrandId, DelaerId, LocationId, Remark, Remarktype, userid }).subscribe({
      next: (res: any) => {
        this.globalBlockUiService.stopLoading()
        this.Result = res.message
        this.visible = true;
        this.remarkForm.reset()
        this.OnClickViewData()
      },
      error: (err: any) => {
        this.globalBlockUiService.stopLoading()
        this.Result = err.error.message
        this.visible = true;
        this.remarkForm.reset()
      }
    })
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

  OnClickViewData() {
    
    this.FetchRemarkDataTable(this.remarkForm.value.brand, this.remarkForm.value.dealer, this.remarkForm.value.location, this.remarkForm.value.userType, this.remarkForm.value.remarkType)
  }


  RemarksDataTable: any
  FetchRemarkDataTable(BrandId: any, DealerId: any, LocationId: any, RemarkFor: any, RemarkTypeId: any) {
    this.globalBlockUiService.startLoading();
    this.remarkservice.FetchRemarkData({ BrandId, DealerId, LocationId, RemarkFor, RemarkTypeId }).subscribe({
      next: (res: any) => {
        this.RemarksDataTable = res.data
        this.visibleTableData = true
        this.globalBlockUiService.stopLoading()
      },
       error: (err: any) => {
        this.Result = err.error.message;
        this.visible = true;
        this.globalBlockUiService.stopLoading()
      }
      
    })
  }

  OnClickSaveEdit() {
    if (this.EditRemarkForm.valid) {
      this.EditRemarkData(this.rowId, this.EditRemarkForm.value.brand, this.EditRemarkForm.value.dealer, this.EditRemarkForm.value.location, this.EditRemarkForm.value.remark, this.EditRemarkForm.value.remarkTypeId)
    }
    else {
      this.EditRemarkForm.markAllAsTouched()
    }
  }


  EditRemarkData(Id: any, BrandId: any, DealerId: any, LocationId: any, Remark: any, RemarkTypeId: any) {
    this.globalBlockUiService.startLoading()
    this.remarkservice.EditRemarkData({ Id, BrandId, DealerId, LocationId, Remark, RemarkTypeId }).subscribe({
      next: (res: any) => {
        this.Result = res.message;
        this.visible = true;
        this.globalBlockUiService.stopLoading()
        this.EditRemarkForm.reset()

      },
      error: (err: any) => {
        this.Result = err.error.message;
        this.visible = true;
        this.EditRemarkForm.reset()
        this.globalBlockUiService.stopLoading()
      }
    })
  }


}
