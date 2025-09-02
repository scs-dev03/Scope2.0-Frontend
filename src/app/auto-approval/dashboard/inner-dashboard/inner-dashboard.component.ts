import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';


@Component({
  selector: 'app-inner-dashboard',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './inner-dashboard.component.html',
  styleUrl: './inner-dashboard.component.css'
})
export class InnerDashboardComponent {
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('Dashboard')
   
  }

  constructor(private sharedService:SharedServiceService ){ 
  }

}
