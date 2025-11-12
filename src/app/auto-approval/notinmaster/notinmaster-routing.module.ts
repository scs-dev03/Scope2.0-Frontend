import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotInMasterComponent } from './not-in-master/not-in-master.component';
import { ViewNotInMasterComponent } from './view-not-in-master/view-not-in-master.component';

const routes: Routes = [{
  path: 'nim',
  component: NotInMasterComponent
}, {
  path: 'viewnim',
  component: ViewNotInMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotinmasterRoutingModule {

  



 }
