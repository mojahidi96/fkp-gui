import {Routes} from '@angular/router';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';

const base = 'fixednet/';
export const appFixednetRoutes: Routes = [
  {
    path: base + 'home',
    loadChildren: () => import('../default-landing/default-landing.module').then(m => m.DefaultLandingModule),
    resolve: {
      pattern: PatternResolverService
    }
  },
  {
    path: base + 'orderapprovals',
    loadChildren: () => import('../order-approvals/order-approvals.module').then(m => m.OrderApprovalsModule)
  },
  {
    path: base + 'createshop',
    loadChildren: () => import('../fixednet/create-shop/create-shop.module').then(m => m.CreateShopModule)
  },
  {
    path: base + 'editshop',
    loadChildren: () => import('../fixednet/edit-shop/edit-shop.module').then(m => m.EditShopModule)
  },
  {
    path: base + 'dwhrefresh',
    loadChildren: () => import('../fixednet/dwh-data-refresh/dwh-data-refresh.module').then(m => m.DwhDataRefreshModule)
  },
  {
    path: base + 'order',
    loadChildren: () => import('../fixednet/order/order.module').then(m => m.OrderModule)
  },
  {
    path: base + 'customerdetails',
    loadChildren: () => import('../fixednet/customer-details/customer-details.module').then(m => m.CustomerDetailsModule)
  },
  {
    path: base + 'orderhistorysearch',
    loadChildren: () => import('../fixednet/order-history/order-history.module').then(m => m.OrderHistorysModule)
  },
  {
    path: base + 'ordermanager',
    loadChildren: () => import('../fixednet/order-manager/landing-page/landing-page.module').then(m => m.LandingPageModule)
  }
];