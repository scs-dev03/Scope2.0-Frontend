import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRemarkComponent } from './admin-remark/admin-remark.component';
import { AdminpendingcountComponent } from './adminpendingcount/adminpendingcount.component';

const routes: Routes = [

  {
    path: 'armk',
    component: AdminRemarkComponent
  },{
    path: 'pcount',
    component: AdminpendingcountComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VonRoutingModule { }
