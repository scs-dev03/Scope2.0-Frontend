import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { ScopeRedirectComponent } from './scope-redirect/scope-redirect.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { UpdatePasswordWhileCreateUserComponent } from './update-password-while-create-user/update-password-while-create-user.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authGuard } from '../auth.guard';


const routes: Routes = [

  {
    path: 'landing',
    component: LandingScreenComponent,
  },

  {
    path: 'redirect',
    component: ScopeRedirectComponent,
    canActivate:[authGuard]

  },
  {
    path:'update-user-password',
    component:UpdatePasswordWhileCreateUserComponent,
},
{
    path: 'home',
    //component: HomePageComponent,
    //canActivate:[authGuard]
  },
  // {
  //   path: '**',
  //   component: MaintenanceComponent,
  // }
  {
    path:'**',
    component:PageNotFoundComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
