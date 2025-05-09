import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { ScopeRedirectComponent } from './scope-redirect/scope-redirect.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { UpdatePasswordWhileCreateUserComponent } from './update-password-while-create-user/update-password-while-create-user.component';

const routes: Routes = [

  {
    path: 'landing',
    component: LandingScreenComponent,
  },

  {
    path: 'redirect',
    component: ScopeRedirectComponent

  },
  {
    path:'update-user-password',
    component:UpdatePasswordWhileCreateUserComponent,
   
},
  {
    path: '**',
    component: MaintenanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
