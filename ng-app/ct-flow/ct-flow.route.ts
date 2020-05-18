import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {CtFlowComponent} from './ct-flow.component';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      columns: ColumnsResolver,
      lazyCount: LazyCountResolver
    },
    component: CtFlowComponent,
    data: {configId: '8ba93c9a-c14e-702c-e053-1f07100ab39a'},
    runGuardsAndResolvers: 'always'
  }
];

export const CtFlowRouting: ModuleWithProviders = RouterModule.forChild(routes);
