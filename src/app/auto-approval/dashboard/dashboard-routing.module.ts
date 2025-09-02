import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerDashboardComponent } from './inner-dashboard/inner-dashboard.component';

const routes: Routes = [{
  path: 'inner-user',
  component: InnerDashboardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
