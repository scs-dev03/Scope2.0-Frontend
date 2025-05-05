import { Component, Input } from '@angular/core';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';

@Component({
  selector: 'app-totalsum',
  imports: [PrimengModuleModule,SharedModule,SHARED_IMPORTS],
  templateUrl: './totalsum.component.html',
  styleUrl: './totalsum.component.css'
})
export class TotalsumComponent {
  @Input() SalesInfo: any = []
  @Input() DataTypeArray: any = []
}
