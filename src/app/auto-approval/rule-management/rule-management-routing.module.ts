import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketManagementComponent } from './bucket-management/bucket-management.component';
import { KeywordManagementComponent } from './keyword-management/keyword-management.component';
import { RuleCreationComponent } from './rule-creation/rule-creation.component';
import { ViewEditExportComponent } from './view-edit-export/view-edit-export.component';
import { CalculativeParametersComponent } from './calculative-parameters/calculative-parameters.component';
import { EditRuleComponent } from './edit-rule/edit-rule.component';

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
    path: 'cp',
    component: CalculativeParametersComponent

  },
  {
    path: 'rcv',
    component: ViewEditExportComponent
  },
  {
    path: 're',
    component: EditRuleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleManagementRoutingModule { }
