import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllApprovalsComponent } from './all-approvals/all-approvals.component';
import { NotInMasterComponent } from './not-in-master/not-in-master.component';
import { RemarkMasterComponent } from './remark-master/remark-master.component';
import { StockApprovalsComponent } from './stock-approvals/stock-approvals.component';
import { VehicleApprovalsComponent } from './vehicle-approvals/vehicle-approvals.component';

const routes: Routes = [{
  path: 'sa',
  component: StockApprovalsComponent
}, {
  path: 'nim',
  component: NotInMasterComponent
},{
  path: 'remark',
  component: RemarkMasterComponent
},{
  path: 'va',
  component: VehicleApprovalsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsAdminRoutingModule { }
