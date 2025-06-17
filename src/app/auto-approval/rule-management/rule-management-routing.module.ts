import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketManagementComponent } from './bucket-management/bucket-management.component';
import { KeywordManagementComponent } from './keyword-management/keyword-management.component';
import { RuleCreationComponent } from './rule-creation/rule-creation.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleManagementRoutingModule { }
