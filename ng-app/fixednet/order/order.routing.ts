import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {OrderComponent} from './order.component';
import {SncrConfirmDeactivateGuard} from '../../sncr-components/sncr-confirm-deactivate/sncr-confirm-deactivate-guard.service';

const routes: Routes = [
  {
    path: 'customers',
    component: OrderComponent,
    canDeactivate: [SncrConfirmDeactivateGuard]
  }
];

export const OrderRouting: ModuleWithProviders = RouterModule.forChild(routes);