import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalClusterComponent } from './internal-cluster/internal-cluster.component';

const routes: Routes = [
  {
    path: 'icr',
    component: InternalClusterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalAndClusterRuleRoutingModule { }
