import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'rule',
    loadChildren: () => import('../auto-approval/rule-management/rule-management.module').then(m => m.RuleManagementModule),
    //  canLoad:[authGuard],
    //  canActivate:[authGuard]
  },{
    path: 'mapping',
    loadChildren: () => import('../auto-approval/brand-wise-user-mapping/brand-wise-user-mapping.module').then(m => m.BrandWiseUserMappingModule),
    //  canLoad:[authGuard],
    //  canActivate:[authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../auto-approval/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule), 
     //  canLoad:[authGuard],
    //  canActivate:[authGuard]
    
  },
  {
    path: 'scsuser',
    loadChildren: () => import('../auto-approval/scs-user/scs-user-routing.module').then(m => m.ScsUserRoutingModule), 
     //  canLoad:[authGuard],
    //  canActivate:[authGuard]

  },
  {
    path: 'scsadmin',
    loadChildren: () => import('../auto-approval/scs-admin/scs-admin-routing.module').then(m => m.ScsAdminRoutingModule), 
     //  canLoad:[authGuard],
    //  canActivate:[authGuard]

  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes),], 
  exports: [RouterModule]
})
export class AutoApprovalRoutingModule { }
