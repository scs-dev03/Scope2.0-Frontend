import { Component, Input } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-product-desctiption-table',
  imports: [PrimengModuleModule,SharedModule],
  templateUrl: './product-desctiption-table.component.html',
  styleUrl: './product-desctiption-table.component.css'
})
export class ProductDesctiptionTableComponent {

  @Input() PartDetails: any = []
  

  testfunction(){
    console.log(this.PartDetails)
  }
}
