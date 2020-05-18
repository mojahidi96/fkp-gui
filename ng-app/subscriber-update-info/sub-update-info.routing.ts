import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {SubUpdateInfoComponent} from './sub-update-info.component';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';


const routes: Routes = [
  {
    path: '',
    resolve: {
      columns: ColumnsResolver,
      countries: CountriesResolverService,
      pattern: PatternResolverService,
      lazyCount: LazyCountResolver
    },
    component: SubUpdateInfoComponent,
    data: {configId: '5c60e182-4a75-511c-e053-1405100af36c'}
  }
];

export const SubUpdateInfoRouting: ModuleWithProviders = RouterModule.forChild(routes);