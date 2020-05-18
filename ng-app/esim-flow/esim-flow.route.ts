import {RouterModule, Routes} from '@angular/router';
import {EsimFlowComponent} from './esim-flow.component';
import {ModuleWithProviders} from '@angular/core';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';


const routes: Routes = [
  {
    path: '',
    resolve: {
      columns: ColumnsResolver,
      lazyCount: LazyCountResolver,
      pattern: PatternResolverService
    },
    component: EsimFlowComponent,
    data: {configId: '9e5ecc8d-d40b-5809-e053-1e07100a9b0b'}
  }
];


export const EsimFlowRouting: ModuleWithProviders = RouterModule.forChild(routes);

