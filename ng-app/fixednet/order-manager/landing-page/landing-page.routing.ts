import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LandingPageComponent} from './landing-page.component';
import {PatternResolverService} from '../../../ban-sub-common/pattern-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    resolve: {
      pattern: PatternResolverService
    },
    data: {configId: '6f7ab7b1-13a8-72af-e053-1405100af944'}
  }
];

export const LandingPageRouting: ModuleWithProviders = RouterModule.forChild(routes);