import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRemarkComponent } from './admin-remark/admin-remark.component';
import { AdminpendingcountComponent } from './adminpendingcount/adminpendingcount.component';
import { DealerVonComponent } from './dealer-von/dealer-von.component';
import { AdminVonComponent } from './admin-von/admin-von.component';

const routes: Routes = [

  {
    path: 'armk',
    component: AdminRemarkComponent
  },{
    path: 'pcount',
    component: AdminpendingcountComponent
  },{
    path: 'dvon',
    component: DealerVonComponent
  },{
    path: 'avon',
    component: AdminVonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VonRoutingModule { }
