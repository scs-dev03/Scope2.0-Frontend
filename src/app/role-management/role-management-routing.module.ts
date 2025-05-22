import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [

  {
    path:'create-role',
    component:CreateRoleComponent,
   
     canActivate:[authGuard]
},
{
    path:'view-role',
    component:ViewRoleComponent,
   
     canActivate:[authGuard]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
