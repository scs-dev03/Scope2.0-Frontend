import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRequestComponent } from './dashboard-request/dashboard-request.component';
import { DasboardChangeLogComponent } from './dasboard-change-log/dasboard-change-log.component';
import { DashboardSchedulerComponent } from './dashboard-scheduler/dashboard-scheduler.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'request',
    component: DashboardRequestComponent,
    canActivate:[authGuard]
  },
  {
    path: 'change',
    component: DasboardChangeLogComponent,
    canActivate:[authGuard]
  },{
    path: 'ds',
    component: DashboardSchedulerComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardSchedulerRoutingModule { }
