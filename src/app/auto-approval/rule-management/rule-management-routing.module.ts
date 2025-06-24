import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketManagementComponent } from './bucket-management/bucket-management.component';

const routes: Routes = [
  {
    path:'bm',
    component:BucketManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleManagementRoutingModule { }
