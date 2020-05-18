import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {BanUpdateInfoComponent} from './ban-update-info.component';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
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
    component: BanUpdateInfoComponent,
    data: {configId: '5c60e182-4a75-511c-e053-1405100af36f'}
  }
];

export const BanUpdateInfoRouting: ModuleWithProviders = RouterModule.forChild(routes);