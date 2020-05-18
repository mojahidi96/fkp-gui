import {RouterModule, Routes} from '@angular/router';
import {SncrConfirmDeactivateGuard} from '../../sncr-components/sncr-confirm-deactivate/sncr-confirm-deactivate-guard.service';
import {ModuleWithProviders} from '@angular/core';
import {EDOrderDetailsComponent} from './ed-order-details/ed-order-details.component';
import {PatternResolverService} from '../../ban-sub-common/pattern-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: EDOrderDetailsComponent,
    resolve: {
      pattern: PatternResolverService
    }
  }
];

export const EDOrderRouting: ModuleWithProviders = RouterModule.forChild(routes);