import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotInMasterComponent } from './not-in-master/not-in-master.component';

const routes: Routes = [{
  path: 'nim',
  component: NotInMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotinmasterRoutingModule { }
