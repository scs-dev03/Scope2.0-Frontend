import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyManagementComponent } from './party-management/party-management.component';

const routes: Routes = [{
  path: 'pm',
  component: PartyManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyManagementRoutingModule { }
