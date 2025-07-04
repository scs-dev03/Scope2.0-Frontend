import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockOrderRequestComponent } from './stock-order-request/stock-order-request.component';
import { VechileOrderRequestComponent } from './vechile-order-request/vechile-order-request.component';

const routes: Routes = [
  {
    path: 'so',
    component: StockOrderRequestComponent
  },
  {
    path: 'vo',
    component: VechileOrderRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateOrderRequestRoutingModule { }
