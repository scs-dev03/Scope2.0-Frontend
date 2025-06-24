import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketManagementComponent } from './bucket-management/bucket-management.component';
import { KeywordManagementComponent } from './keyword-management/keyword-management.component';
import { RuleCreationComponent } from './rule-creation/rule-creation.component';
import { ViewEditExportComponent } from './view-edit-export/view-edit-export.component';

const routes: Routes = [
  {
    path:'bm',
    component:BucketManagementComponent
  },{
    path: 'km',
    component: KeywordManagementComponent
  },{
    path: 'rc',
    component: RuleCreationComponent
  },
  {
    path: 'rcv',
    component: ViewEditExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleManagementRoutingModule { }
