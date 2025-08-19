import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { SharedModule } from 'primeng/api';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { SharedServiceService } from '../../../services/shared-service.service';
import { PaginatorState } from 'primeng/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-wise-user-mapping',
  imports: [SHARED_IMPORTS, PrimengModuleModule, SharedModule],
  templateUrl: './brand-wise-user-mapping.component.html',
  styleUrl: './brand-wise-user-mapping.component.css'
})
export class BrandWiseUserMappingComponent {

  BrandUserMapping: FormGroup;
  constructor(private sharedService: SharedServiceService, private fb: FormBuilder) {
    this.BrandUserMapping = this.fb.group({
      Brand: (null),
      Dealer: (null),
      Location: (null),
      AssignedUser: (null)
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('Brand Wise User Mapping');
  }

  onClickSave(){
    console.log(this.BrandUserMapping.value);
  }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }



  showTable: boolean = false;
  onClickViewUserMapping() {
    if (this.showTable !== true) {
      this.showTable = true;
    } else {
      this.showTable = false;
    }
  }

}
  
 



