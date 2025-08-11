import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { NoAccessComponent } from './core/no-access/no-access.component';

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
        //  canLoad:[authGuard],
        //  canActivate:[authGuard]
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
        path:'no-access',
        component:NoAccessComponent
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
