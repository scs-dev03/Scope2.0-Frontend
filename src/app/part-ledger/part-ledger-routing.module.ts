import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../auth.guard';
import { DealerSalesReportComponent } from './dealer-sales-report/dealer-sales-report.component';

const routes: Routes = [
  {
    path: 'ds',
    component: DealerSalesReportComponent,
    canActivate:[authGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PartLedgerRoutingModule {


 
 }
