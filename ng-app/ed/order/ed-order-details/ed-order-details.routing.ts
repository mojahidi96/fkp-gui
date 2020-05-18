import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {EDOrderDetailsComponent} from './ed-order-details.component';
import {PatternResolverService} from '../../../ban-sub-common/pattern-resolver.service';



const edOrderDetailsRoutes: Routes = [
  {
    path: '',
    component: EDOrderDetailsComponent,
    resolve: {
      pattern: PatternResolverService
    }
  }
];




export const edOrderDetailsRouting: ModuleWithProviders = RouterModule.forChild(edOrderDetailsRoutes);