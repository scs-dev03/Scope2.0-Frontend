import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCreateUserComponent } from './view-create-user/view-create-user.component';
import { DealerViewCreateUserComponent } from './dealer-view-create-user/dealer-view-create-user.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path:'view-create' ,component:ViewCreateUserComponent,
    // canActivate:[authGuard]
  },
  {
    path:'dealer-view-create' ,component:DealerViewCreateUserComponent,
    // canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
