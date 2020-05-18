import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {OrderManagerComponent} from './order-manager.component';
import {OrderManagerResolver} from './order-manager.resolver';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OrderManagerComponent,
    resolve: {
      countries: CountriesResolverService,
      pattern: PatternResolverService,
      orderDetail: OrderManagerResolver
    }
  }
];

export const OrderManagerRouting: ModuleWithProviders = RouterModule.forChild(routes);
