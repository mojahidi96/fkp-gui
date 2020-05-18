import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MaintainSocComponent} from './maintain-soc.component';
import {ColumnsResolver} from '../subscribers-selection/columns-resolver.service';
import {SubscribersResolver} from '../subscribers-selection/subscribers-resolver.service';
import {OrderType} from '../order-confirm/order-confirm';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MaintainSocComponent,
    resolve: {
      columns: ColumnsResolver,
      subscribers: SubscribersResolver,
      pattern: PatternResolverService
    },
    data: {orderType: OrderType['MA_MAINTAIN_SOC']}
  }
];

export const MaintainSocRouting: ModuleWithProviders = RouterModule.forChild(routes);