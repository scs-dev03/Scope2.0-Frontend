import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
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

  @Input() SalesInfo: any = []
  @Input() DataTypeArray: any = []
  @Input() isLoading: boolean = false;


  @ViewChild('dt') dt!: Table;
  originalData: any[] = this.SalesInfo;
  tableData: any[] = this.SalesInfo;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['SalesInfo'] && changes['SalesInfo'].currentValue) {
      this.originalData = JSON.parse(JSON.stringify(this.SalesInfo));
      this.tableData = JSON.parse(JSON.stringify(this.SalesInfo));
    }
  }



  clearFilters() {
    if (this.dt) {
      this.dt.clear();
     
      this.tableData = JSON.parse(JSON.stringify(this.originalData));

    }
  }

}
