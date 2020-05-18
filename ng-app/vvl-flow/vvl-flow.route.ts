import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {VvlFlowComponent} from './vvl-flow.component';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';

const routes: Routes = [
  {
    path: '',
    resolve: {
      countries: CountriesResolverService,
      pattern: PatternResolverService
    },
    component: VvlFlowComponent,
    runGuardsAndResolvers: 'always'
  }
];

export const VvlFlowRouting: ModuleWithProviders = RouterModule.forChild(routes);
