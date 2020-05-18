import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LandingPageComponent} from './landing-page.component';
import {PatternResolverService} from '../../../../ban-sub-common/pattern-resolver.service';
import {EDOrderDetailsComponent} from '../../ed-order-details/ed-order-details.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    resolve: {
      pattern: PatternResolverService
    },
    data: {configId: '79ff53c1-7d62-1cdc-e053-1505100ac187'}
  }
];

export const LandingPageRouting: ModuleWithProviders = RouterModule.forChild(routes);