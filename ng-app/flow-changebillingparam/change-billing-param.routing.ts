import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ChangeBillingParamComponent} from './change-billing-param.component';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';


const routes: Routes = [
  {
    path: '',
    component: ChangeBillingParamComponent,
    resolve: {
      columns: ColumnsResolver,
      lazyCount: LazyCountResolver
    },
    data: {configId: '5c60e182-4a75-511c-e053-1405100af36j'}
  },
];

export const ChangeBillingParamRouting: ModuleWithProviders = RouterModule.forChild(routes);