import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {OrderDetailsComponent} from './order-details.component';
import {OrderDetailsResolver} from './order-details.resolver';


const routes: Routes = [
  {
    path: '',
    component: OrderDetailsComponent,
    resolve: {
      orderHeaeder: OrderDetailsResolver
    }
  },
];

export const orderDetailsRouting: ModuleWithProviders = RouterModule.forChild(routes);
