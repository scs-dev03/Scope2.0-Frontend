import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorManagementComponent } from './advisor-management/advisor-management.component';

const routes: Routes = [{
  path: 'am',
  component: AdvisorManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorManagementRoutingModule { }
