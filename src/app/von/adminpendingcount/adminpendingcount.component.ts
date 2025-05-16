import { Component } from '@angular/core';
import { AdminvonserviceService } from '../../services/Von/adminvonservice.service';
import { Router } from '@angular/router';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { Sidebar2Component } from "../../core/sidebar-2/sidebar-2.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { GlobalBlockUiService } from '../../services/global-block-ui.service';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-adminpendingcount',
  imports: [PrimengModuleModule, SharedModule, SHARED_IMPORTS, Sidebar2Component, LoaderComponent],
  templateUrl: './adminpendingcount.component.html',
  styleUrl: './adminpendingcount.component.css'
})
export class AdminpendingcountComponent {

  ngOnInit(): void {
    localStorage.clear()
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fetchpendingcount();
     this.sharedService.updateModuleName('Admin Pending Count')
    
  }

   constructor(private adminvonservice: AdminvonserviceService, 
    private router: Router,private globalBlockUiService:GlobalBlockUiService,
    private sharedService:SharedServiceService
  ) {}


  pendingcount: any = []
  isloading: any;

  navigateToAvon(rowData: any) {
    this.router.navigate(['/von/avon'], {
      queryParams: {
        brandid: rowData.brandid,
        dealerid: rowData.dealerid,
        locationid: rowData.locationid
      }
    });
  }

   fetchpendingcount(){
    this.globalBlockUiService.startLoading()
    this.adminvonservice.getPendingCount().subscribe((res:any)=>{
      this.pendingcount = res.Data
      this.globalBlockUiService.stopLoading()
    })
   }



   sidebarvisible: boolean = false;
    
   

    onClickSidebar(){
        this.sidebarvisible = true
        console.log(this.sidebarvisible);
        
    }
}
