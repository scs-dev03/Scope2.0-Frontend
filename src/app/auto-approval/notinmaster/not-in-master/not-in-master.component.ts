import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';

@Component({
  selector: 'app-not-in-master',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './not-in-master.component.html',
  styleUrl: './not-in-master.component.css'
})
export class NotInMasterComponent {

    ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('Not In Master')
   
  }

  constructor(private sharedService:SharedServiceService ){ 
  }
}
