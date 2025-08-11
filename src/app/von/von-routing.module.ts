import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerVonComponent } from './dealer-von/dealer-von.component';
import { authGuard } from '../auth.guard';
const routes: Routes = [

   {
    path: 'dvon',
    component: DealerVonComponent,
    // canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VonRoutingModule { }
