import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: 'order',
    loadChildren: () => import('../auto-approval/create-order-request/create-order-request.module').then(m => m.CreateOrderRequestModule),
     canLoad:[authGuard],
     canActivate:[authGuard]
  },
  {
    path: 'party',
    loadChildren: () => import('../auto-approval/party-management/party-management.module').then(m => m.PartyManagementModule),
     canLoad:[authGuard],
     canActivate:[authGuard]
  },
  {
    path: 'advisor',
    loadChildren: () => import('../auto-approval/advisor-management/advisor-management.module').then(m => m.AdvisorManagementModule),
     canLoad:[authGuard],
     canActivate:[authGuard]
  },
  {
    path: 'status',
    loadChildren: () => import('../auto-approval/view-order-request/view-order-request.module').then(m => m.ViewOrderRequestModule),
     canLoad:[authGuard],
     canActivate:[authGuard]

  },
  {
    path: 'dashboard',
    loadChildren: () => import('../auto-approval/dashboard/dashboard.module').then(m => m.DashboardModule),
     canLoad:[authGuard],
     canActivate:[authGuard]

  },
  {
    path: 'master',
    loadChildren: () => import('../auto-approval/notinmaster/notinmaster.module').then(m => m.NotinmasterModule),
     canLoad:[authGuard],
     canActivate:[authGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),], 
  exports: [RouterModule]
})
export class AutoApprovalRoutingModule { }
