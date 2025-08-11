import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderStatusComponent } from './order-status/order-status.component';

const routes: Routes = [
  {
    path: 'os',
    component: OrderStatusComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewOrderRequestRoutingModule { }
