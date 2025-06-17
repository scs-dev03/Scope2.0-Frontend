import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
        path:'rule',
        loadChildren:()=> import('../auto-approval/rule-management/rule-management.module').then(m=>m.RuleManagementModule),
        //  canLoad:[authGuard],
        //  canActivate:[authGuard]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class AutoApprovalRoutingModule { }
