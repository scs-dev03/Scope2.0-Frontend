import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCreateUserComponent } from './view-create-user/view-create-user.component';
import { DealerViewCreateUserComponent } from './dealer-view-create-user/dealer-view-create-user.component';

const routes: Routes = [
  {
    path:'view-create' ,component:ViewCreateUserComponent
  },
  {
    path:'dealer-view-create' ,component:DealerViewCreateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
