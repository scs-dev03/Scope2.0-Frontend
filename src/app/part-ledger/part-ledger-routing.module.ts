import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSalesReportComponent } from './admin-sales-report/admin-sales-report.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [

  {
    path: 'as',
    component: AdminSalesReportComponent,
    canActivate:[authGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate:[authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PartLedgerRoutingModule {


 
 }
