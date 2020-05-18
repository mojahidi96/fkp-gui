import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {OrderApprovalsComponent} from './order-approvals.component';
import {OrderDetailsComponent} from '../fixednet/common/order-details/order-details.component';

const routes: Routes = [
  {
    path: '',
    component: OrderApprovalsComponent
  },
  {
    path: 'orderdetails',
    component: OrderDetailsComponent
  }
];

export const OrderApprovalsRouting: ModuleWithProviders = RouterModule.forChild(routes);