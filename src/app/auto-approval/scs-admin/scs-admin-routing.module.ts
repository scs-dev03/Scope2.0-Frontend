import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllApprovalsComponent } from './all-approvals/all-approvals.component';

const routes: Routes = [{
  path: 'all',
  component: AllApprovalsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsAdminRoutingModule { }
