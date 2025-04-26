import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRequestComponent } from './dashboard-request/dashboard-request.component';
import { DasboardChangeLogComponent } from './dasboard-change-log/dasboard-change-log.component';

const routes: Routes = [
  {
    path: 'request',
    component: DashboardRequestComponent,
  },
  {
    path: 'change',
    component: DasboardChangeLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardSchedulerRoutingModule { }
