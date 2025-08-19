import { Component } from '@angular/core';
import { PrimengModuleModule } from '../../../shared/primeng-module/primeng-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared-imports/shared-module';
import { PaginatorState } from 'primeng/paginator';
import { SharedServiceService } from '../../../services/shared-service.service';

@Component({
  selector: 'app-view-edit-export',
  imports: [PrimengModuleModule,FormsModule,CommonModule,SHARED_IMPORTS,ReactiveFormsModule,],
  templateUrl: './view-edit-export.component.html',
  styleUrl: './view-edit-export.component.css'
})
export class ViewEditExportComponent {


  constructor(private sharedService: SharedServiceService) { }
    ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.sharedService.updateModuleName('View Rules');
  }

  first: number = 0;
  
      rows: number = 10;
  
      onPageChange(event: PaginatorState) {
          this.first = event.first ?? 0;
          this.rows = event.rows ?? 10;
      }
  

}
