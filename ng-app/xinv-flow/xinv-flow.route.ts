import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {XinvFlowComponent} from './xinv-flow.component';


const routes: Routes = [
  {
    path: '',
    resolve: {
      columns: ColumnsResolver,
      lazyCount: LazyCountResolver
    },
    component: XinvFlowComponent,
    data: {configId: 'a2c60ce6-dfa5-14ea-e053-1e07100a3654'}
  }
];


export const XinvFlowRouting: ModuleWithProviders = RouterModule.forChild(routes);
