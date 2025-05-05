import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRequestComponent } from './dashboard-request/dashboard-request.component';
import { DasboardChangeLogComponent } from './dasboard-change-log/dasboard-change-log.component';
import { DashboardSchedulerComponent } from './dashboard-scheduler/dashboard-scheduler.component';

const routes: Routes = [
  {
    path: 'request',
    component: DashboardRequestComponent,
  },
  {
    path: 'change',
    component: DasboardChangeLogComponent,
  },{
    path: 'ds',
    component: DashboardSchedulerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardSchedulerRoutingModule { }
