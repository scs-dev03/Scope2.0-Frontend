import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';

export const routes: Routes = [

    {
        path:'part-ledger',
        loadChildren:()=> import('../app/part-ledger/part-ledger.module').then(m=>m.PartLedgerModule)
    },
    {
        path:'mapping',
        loadChildren:()=> import('../app/mapping/mapping.module').then(m=>m.MappingModule)
    },

    {
        path:'upload',
        loadChildren:()=> import('../app/stock-upload-by-spm/stock-upload-by-spm.module').then(m=>m.StockUploadBySpmModule)
    },

    {
        path:'stock-upload',
        loadChildren:()=> import('../app/stock-upload-by-scs-user/stock-upload-by-scs-user.module').then(m=>m.StockUploadByScsUserModule)
    },

    {
        path:'dashboard-scheduler',
        loadChildren:()=> import('../app/dasboard-scheduler/dasboard-scheduler.module').then(m=>m.DasboardSchedulerModule)
    },
    {
        path:'von',
        loadChildren:()=> import('../app/von/von.module').then(m=>m.VonModule)
    },
    {
        path:'core',
        loadChildren:()=> import('../app/core/core.module').then(m=>m.CoreModule)
    },
    // {
    //     path:'login',
    //     component:LoginComponent,
    // },
    {
        path: '**', redirectTo:'mapping/stock-upload',
        pathMatch:'full'
    },
    




];
