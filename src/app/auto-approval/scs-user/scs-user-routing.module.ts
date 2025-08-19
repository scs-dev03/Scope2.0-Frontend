import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAppovalsComponent } from './my-appovals/my-appovals.component';

const routes: Routes = [{
  path: 'mya',
  component: MyAppovalsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScsUserRoutingModule { }
