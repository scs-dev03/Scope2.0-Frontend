import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewLogsComponent } from './view-logs/view-logs.component';

const routes: Routes = [{
  path: 'view-logs',
  component: ViewLogsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsManagementRoutingModule { }
