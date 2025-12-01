import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterServiceService } from '../../../services/master-service/master-service.service';
import { BrandWiseUserMappingServiceService } from '../../../services/Auto-Approvals/brand-wise-user-mapping-service.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';

@Component({
  selector: 'app-brand-wise-user-mapping',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './brand-wise-user-mapping.component.html',
  styleUrl: './brand-wise-user-mapping.component.css'
})
export class BrandWiseUserMappingComponent {

  BrandUserMapping: FormGroup;
  constructor(private globalBlockUiService : GlobalBlockUiService, private sharedService: SharedServiceService, private fb: FormBuilder, private MasterService: MasterServiceService,private BrandUserMappingService: BrandWiseUserMappingServiceService) {
    this.BrandUserMapping = this.fb.group({
      Brand: (null),
      Dealer: (null),
      Location: (null),
      AssignedUser: (null)
    });
  }

  ngOnInit(): void {
    this.sharedService.updateModuleName('Brand Wise User Mapping');
    this.FetchBrandData()
    this.FetchUsersData()
  }

  onClickSave(){
    console.log(this.BrandUserMapping.value);
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

  UserData:any

  FetchUsersData(){
    this.globalBlockUiService.startLoading();
    this.MasterService.getUsersData().subscribe({
      next: (res:any)=>{
        this.UserData = res.data
        this.globalBlockUiService.stopLoading()
      },
      error: (err:any)=>{
        console.log(err);
        this.globalBlockUiService.stopLoading()
        
      }
    })
  }

  




}
  
 



