import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockOrderRequestComponent } from './stock-order-request/stock-order-request.component';
import { VechileOrderRequestComponent } from './vechile-order-request/vechile-order-request.component';
import { WorkshopSaleComponent } from './workshop-sale/workshop-sale.component';
import { CounterSaleComponent } from './counter-sale/counter-sale.component';

const routes: Routes = [
  {
    path: 'so',
    component: StockOrderRequestComponent
  },
  {
    path: 'ws',
    component: WorkshopSaleComponent
  },
  {
    path: 'cs',
    component: CounterSaleComponent
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
