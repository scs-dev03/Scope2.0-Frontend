import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSalesReportComponent } from './admin-sales-report/admin-sales-report.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [

  {
    path: 'as',
    component: AdminSalesReportComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PartLedgerRoutingModule {


 
 }
