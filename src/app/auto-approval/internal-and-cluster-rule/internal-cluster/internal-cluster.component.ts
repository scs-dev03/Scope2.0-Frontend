import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InnerdashboardserviceService } from '../../../services/Auto-Approvals/innerdashboardservice.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { SharedServiceService } from '../../../services/shared-service.service';
import { SharedModule } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { TabsModule } from 'primeng/tabs';
import { FormControl, FormGroup } from '@angular/forms';
import { Divider } from "primeng/divider";

@Component({
  selector: 'app-internal-cluster',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, TabsModule, IconField, InputIcon, Divider],
  templateUrl: './internal-cluster.component.html',
  styleUrl: './internal-cluster.component.css'
})
export class InternalClusterComponent {
  constructor(private router: Router, private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService, private innerdashboardservice: InnerdashboardserviceService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchBrandData()
  }


  InternalTransferInputData = new FormGroup({
    Brand: new FormControl(),
    Dealer: new FormControl(),
    Location: new FormControl(),
    Search: new FormControl()
  })

  InternalTransferRuleInputData = new FormGroup({
    Rulename: new FormControl(),
    Brand: new FormControl(),
    Dealer: new FormControl(),
    Location: new FormControl(),
    PartCategory: new FormControl(),
    ReceiverStockQty: new FormControl(),
    PartRateOper: new FormControl(),
    PartRateVal1: new FormControl(),
    PartRateVal2: new FormControl()
  })




  BrandData: any

  fetchBrandData() {
    // this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getBrandMaster().subscribe((res: any) => {
      
      this.BrandData = res;

      //this.globalBlockUiService.stopLoading();
      console.log(this.BrandData);
    });
  }
  OnclickBrand() {
    this.fetchDealerData(this.InternalTransferInputData.value.Brand)
  }

  DealerData: any
  // Fetch Dealer Data
  fetchDealerData(brandid: any) {
    //this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getDealersMaster({ brandid }).subscribe({
      next: (res: any) => {
        
        this.DealerData = res;
        this.DealerData.sort((a: any, b: any) =>
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
  OnClickDealer() {
    this.fetchlocation(this.InternalTransferInputData.value.Dealer)
  }



  LocationData: any
  fetchlocation(dealerid: any) {
    //this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getlocationMaster({ dealerid: dealerid }).subscribe({
      next: (res: any) => {
        this.LocationData = res;
        //this.globalBlockUiService.stopLoading();
      },
      error: (err: any) => {
        console.error("Error fetching location data:", err);
        //this.globalBlockUiService.stopLoading();
      }
    });
  }

  
}
