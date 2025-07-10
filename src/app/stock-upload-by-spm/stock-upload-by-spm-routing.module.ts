import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleLocationComponent } from './single-location/single-location.component';
import { MultiLocationComponent } from './multi-location/multi-location.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
{
    path:'sl',component:SingleLocationComponent,
  canActivate:[authGuard]
},
{
  path:'ml',component:MultiLocationComponent,
canActivate:[authGuard]
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockUploadBySpmRoutingModule { }
