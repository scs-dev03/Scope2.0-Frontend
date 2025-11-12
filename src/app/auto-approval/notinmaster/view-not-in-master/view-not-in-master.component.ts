import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedModule } from 'primeng/api';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotinmasterService } from '../../../services/Auto-Approvals/notinmaster.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { SharedServiceService } from '../../../services/shared-service.service';

@Component({
  selector: 'app-view-not-in-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './view-not-in-master.component.html',
  styleUrl: './view-not-in-master.component.css'
})
export class ViewNotInMasterComponent {

  today = new Date().toISOString().split('T')[0];
  firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toLocaleDateString('en-CA');

  ngOnInit() {
    this.fetchlocation()
    this.FetchNotInMasterParts(sessionStorage.getItem('brandid'), sessionStorage.getItem('dealerid'), null, null, null, null, this.ViewNotInMaster.value.FromDate, this.ViewNotInMaster.value.ToDate, this.ViewNotInMaster.value.Status)
  }
  constructor(private sharedService: SharedServiceService, private fb: FormBuilder, private globalBlockUiService: GlobalBlockUiService, private notinmasterservice: NotinmasterService) {
  }

  ViewNotInMaster = new FormGroup({
    Location: new FormControl(null),
    Status: new FormControl("1"),
    FromDate: new FormControl(this.firstDayOfMonth),
    ToDate: new FormControl(this.today),
  })

  LocationData: any
  fetchlocation() {
    this.globalBlockUiService.startLoading();
    this.notinmasterservice.getlocationMaster({ dealerid: sessionStorage.getItem('dealerid') || '' }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        this.globalBlockUiService.stopLoading();
      }
    });
  }

  PartNumberData: any
  FetchNotInMasterParts(BrandId: any, DealerId: any, LocationId: any, PartNumber: any, PartTypeId: any, Addedby: any, From: any, To: any, Status: any) {
    this.globalBlockUiService.startLoading();
    this.notinmasterservice.FetchPartNumber({ BrandId: BrandId, DealerId: DealerId, LocationId: LocationId, PartNumber: PartNumber, PartTypeId: PartTypeId, Addedby: Addedby, From: From, To: To, Status: Status }).subscribe({
      next: (res: any) => {
        this.PartNumberData = res.data

        this.globalBlockUiService.stopLoading()
      },
      error: (err) => {
        this.globalBlockUiService.stopLoading()
      }
    })
  }

  Status: any[] = [
    {
      "Name": "Pending For Verification",
      "Id": "1"
    },
    {
      "Name": "Verified",
      "Id": "2"
    }
  ]

  OnClickView() {
    this.FetchNotInMasterParts(sessionStorage.getItem('brandid'), sessionStorage.getItem('dealerid'), this.ViewNotInMaster.value
    .Location, null, null, null, this.ViewNotInMaster.value.FromDate, this.ViewNotInMaster.value.ToDate, this.ViewNotInMaster.value.Status)
  }






}
