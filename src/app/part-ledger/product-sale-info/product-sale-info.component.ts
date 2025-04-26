import { Component, Input } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-product-sale-info',
  imports: [PrimengModuleModule,SharedModule],
  templateUrl: './product-sale-info.component.html',
  styleUrl: './product-sale-info.component.css'
})
export class ProductSaleInfoComponent {

  @Input() SalesInfo: any = []
  @Input() DataTypeArray: any = []    
}
