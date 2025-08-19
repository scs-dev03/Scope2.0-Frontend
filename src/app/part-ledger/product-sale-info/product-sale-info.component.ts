import { Component, Input, Output, ViewChild } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-product-sale-info',
  imports: [PrimengModuleModule, SharedModule, SHARED_IMPORTS],
  templateUrl: './product-sale-info.component.html',
  styleUrl: './product-sale-info.component.css'
})
export class ProductSaleInfoComponent {
   @ViewChild('dt') dt!: Table;
   originalData: any[] = [];
   

  @Input() SalesInfo: any = []
  @Input() DataTypeArray: any = []
  
  loading: boolean = false;

  ngOnInit(): void {
    this.originalData = JSON.parse(JSON.stringify(this.SalesInfo));
  }

  startloading(){
    this.loading = true;
  }
  
  stoploading(){
    this.loading = false;
  }




 clearFilters() {
    if (this.dt) {
      this.dt.reset(); // PrimeNG table ka built-in clear

    
      this.SalesInfo = JSON.parse(JSON.stringify(this.originalData)); // data reset
  
      
    }
  }

}
