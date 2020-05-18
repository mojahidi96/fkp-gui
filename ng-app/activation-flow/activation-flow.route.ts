import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ActivationFlowComponent} from './activation-flow.component';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {SimTypeResolverService} from '../ban-sub-common/simtype-resolver.service';

const routes: Routes = [
  {
    path: '',
    resolve: {
      countries: CountriesResolverService,
      columns: ColumnsResolver,
      pattern: PatternResolverService,
      simtypes: SimTypeResolverService,
      lazyCount: LazyCountResolver
    },
    component: ActivationFlowComponent,
    data: {configId: '8cb358a7-e493-0195-e053-1e07100a4d51'},
    runGuardsAndResolvers: 'always'
  }
];

export const ActivationFlowRouting: ModuleWithProviders = RouterModule.forChild(routes);
