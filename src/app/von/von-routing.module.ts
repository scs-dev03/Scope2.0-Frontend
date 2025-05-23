import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRemarkComponent } from './admin-remark/admin-remark.component';
import { AdminpendingcountComponent } from './adminpendingcount/adminpendingcount.component';
import { DealerVonComponent } from './dealer-von/dealer-von.component';
import { AdminVonComponent } from './admin-von/admin-von.component';
import {authGuard} from '../auth.guard';
const routes: Routes = [

  {
    path: 'armk',
    component: AdminRemarkComponent,
    //canActivate:[authGuard]
  },{
    path: 'pcount',
    component: AdminpendingcountComponent,
    //canActivate:[authGuard]
  },{
    path: 'dvon',
    component: DealerVonComponent,
    //canActivate:[authGuard]
  },{
    path: 'avon',
    component: AdminVonComponent,
    //canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VonRoutingModule { }
