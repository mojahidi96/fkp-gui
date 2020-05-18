import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {OrderApprovalsComponent} from './order-approvals.component';
import {OrderApprovalsDataResolver} from './order-approvals-data.resolver';
import {OrderApprovalsAcommentsResolver} from './order-approvals-acomments.resolver';


const routes: Routes = [
  {
    path: '',
    component: OrderApprovalsComponent,
    resolve: {
      orderHeaeder: OrderApprovalsDataResolver,
      adminComments: OrderApprovalsAcommentsResolver
    }
  },
];

export const OrderApprovalsRouting: ModuleWithProviders = RouterModule.forChild(routes);
