/**
 * Created by bhav0001 on 11-Jul-17.
 */
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {OrderHistoryComponent} from './order-history.component';
import {OrderDetailsComponent} from '../common/order-details/order-details.component';

const routes: Routes = [
  {
    path: '',
    component: OrderHistoryComponent
  },
  {
    path: 'orderdetails',
    component: OrderDetailsComponent
  }
];

export const OrderHistoryRouting: ModuleWithProviders = RouterModule.forChild(routes);