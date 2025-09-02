import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockUploadMappingComponent } from './stock-upload-mapping/stock-upload-mapping.component';
import { DealerLocationMappingComponent } from './dealer-location-mapping/dealer-location-mapping.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [

  {
    path:'stock-upload',
    component:StockUploadMappingComponent,
   canActivate:[authGuard]
  },

  {
    path:'dealer-location',
    component:DealerLocationMappingComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule { }
