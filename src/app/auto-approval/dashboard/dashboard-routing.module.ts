import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerDashboardComponent } from './inner-dashboard/inner-dashboard.component';
import { BrandwiseDashboardComponent } from './brandwise-dashboard/brandwise-dashboard.component';

const routes: Routes = [
  {
    path: "inner",
    component: InnerDashboardComponent
  },
  {
    path:"bw",
    component: BrandwiseDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
