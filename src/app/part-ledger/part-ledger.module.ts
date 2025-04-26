import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartLedgerRoutingModule } from './part-ledger-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSalesReportComponent } from './admin-sales-report/admin-sales-report.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PartLedgerRoutingModule,
  ]
})
export class PartLedgerModule { }
