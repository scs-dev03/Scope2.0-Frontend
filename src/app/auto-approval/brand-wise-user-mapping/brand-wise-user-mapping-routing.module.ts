import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandWiseUserMappingComponent } from './brand-wise-user-mapping/brand-wise-user-mapping.component';

const routes: Routes = [{
  path: 'bwum',
  component: BrandWiseUserMappingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandWiseUserMappingRoutingModule { }
