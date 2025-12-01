import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InnerdashboardserviceService } from '../../../services/Auto-Approvals/innerdashboardservice.service';
import { GlobalBlockUiService } from '../../../services/global-block-ui.service';
import { SharedServiceService } from '../../../services/shared-service.service';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-brandwise-dashboard',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule, IconField, InputIcon],
  templateUrl: './brandwise-dashboard.component.html',
  styleUrl: './brandwise-dashboard.component.css'
})
export class BrandwiseDashboardComponent {

  constructor(private router: Router, private sharedService: SharedServiceService, private globalBlockUiService: GlobalBlockUiService, private innerdashboardservice: InnerdashboardserviceService) {
  }

  ngOnInit(): void {
    this.fetchBrandData()
  }
  VisiTableData: boolean = false;



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

  fetchBrandData() {
    this.globalBlockUiService.startLoading();
    this.innerdashboardservice.getBrandMaster().subscribe((res: any) => {
      this.BrandData = res;
      this.FetchBrandWiseDashboardData()
     
      console.log(this.BrandData);
    });
  }

  DashboardBrandWise:any

  FetchBrandWiseDashboardData(){
    this.globalBlockUiService.startLoading()
    this.innerdashboardservice.getBrandWiseDashboardData().subscribe((res:any)=>{
      this.DashboardBrandWise = res.data
      this.VisiTableData = true;
       this.globalBlockUiService.stopLoading();
    })
  }


  navigateToApprovalSummary(rowData: any) {
    this.router.navigate(['auto/dashboard/inner'], {
      queryParams: {
        brandid: rowData.BrandId,
        dealerid: rowData.DealerId,
               
      }
    });
  }

}
