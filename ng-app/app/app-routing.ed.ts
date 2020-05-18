import {Routes} from '@angular/router';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';

const base = 'ed/';
export const appEdRoutes: Routes = [
  {
    path: base + 'home',
    loadChildren: () => import('../default-landing/default-landing.module').then(m => m.DefaultLandingModule),
    resolve: {
      pattern: PatternResolverService
    }
  },
  {
    path: base + 'ordermanager',
    loadChildren: () => import('../ed/order/order-manager/landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: base + 'orderupload',
    loadChildren: () => import('../ed/order/order-upload/order-upload.module').then(m => m.OrderUploadModule)
  },
  {
    path: base + 'ordersubmit',
    loadChildren: () => import('../ed/order/order-submit/order-submit.module').then(m => m.OrderSubmitModule)
  },
  {
    path: base + 'ordermilestone',
    loadChildren: () => import('../ed/order/order-milestone-upload/order-milestone-upload.module').then(m => m.OrderMilestoneUploadModule)
  },
  {
    path: base + 'reporting',
    loadChildren: () => import('../ed/order/ed-reporting/ed-reporting.module').then(m => m.EDReportingModule)
  },
  {
    path: base + 'orderdetails',
    loadChildren: () => import('../ed/order/ed-order-details/ed-order-details.module').then(m => m.EDOrderDetailsModule)
  },
  {
    path: base + 'dwhrefresh',
    loadChildren: () => import('../fixednet/dwh-data-refresh/dwh-data-refresh.module').then(m => m.DwhDataRefreshModule)
  },
  {
    path: base + 'createshop',
    loadChildren: () => import('../ed/create-shop/create-shop.module').then(m => m.CreateShopModule)
  },
  {
    path: base + 'editshop',
    loadChildren: () => import('../ed/edit-shop/edit-shop.module').then(m => m.EditShopModule)
  }
];