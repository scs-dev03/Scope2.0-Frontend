import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { authGuard } from './auth.guard';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

export const routes: Routes = [

    {
        path:'part-ledger',
        loadChildren:()=> import('../app/part-ledger/part-ledger.module').then(m=>m.PartLedgerModule),
        //  canLoad:[authGuard],
        //  canActivate:[authGuard]
    },
    {
        path:'mapping',
        loadChildren:()=> import('../app/mapping/mapping.module').then(m=>m.MappingModule),
        //  canLoad:[authGuard],
        //  canActivate:[authGuard]
    },

    {
        path:'upload',
        loadChildren:()=> import('../app/stock-upload-by-spm/stock-upload-by-spm.module').then(m=>m.StockUploadBySpmModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },
    {
        path:'auto',
        loadChildren:()=> import('../app/auto-approval/auto-approval.module').then(m=>m.AutoApprovalModule),
         canLoad:[authGuard],
         canActivate:[authGuard]
    },

    {
        path:'stock-upload',
        loadChildren:()=> import('../app/stock-upload-by-scs-user/stock-upload-by-scs-user.module').then(m=>m.StockUploadByScsUserModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },

    {
        path:'dashboard-scheduler',
        loadChildren:()=> import('../app/dasboard-scheduler/dasboard-scheduler.module').then(m=>m.DasboardSchedulerModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },
    {
        path:'von',
        loadChildren:()=> import('../app/von/von.module').then(m=>m.VonModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },
    {
        path:'core',
        loadChildren:()=> import('../app/core/core.module').then(m=>m.CoreModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },
    {
        path:'lead-time',
        loadChildren:()=>import('../app/lead-time/lead-time.module').then(m=>m.LeadTimeModule),
          // canLoad:[authGuard],
          // canActivate:[authGuard]
    },
    {
        path:'user',
        loadChildren:()=>import('../app/user-management/user-management.module').then(m=>m.UserManagementModule),
        //  canLoad:[authGuard],
        //  canActivate:[authGuard]
    },
    {
        path:'role',
        loadChildren:()=>import('../app/role-management/role-management.module').then(m=>m.RoleManagementModule),
        //  canLoad:[authGuard],
        //   canActivate:[authGuard]
    },
    // {
    //     path: '**', redirectTo:'core/home',
    //     pathMatch:'full'
    // },
    {
        path:'**',
        component:PageNotFoundComponent
      }




];
