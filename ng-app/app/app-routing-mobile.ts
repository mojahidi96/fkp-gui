import {Routes} from '@angular/router';
import {AccessResolverService} from './config/access-resolver.service';

const base = 'mobile/';
export const appMobileRoutes: Routes = [
  {
    path: '',
    redirectTo: 'error',
    pathMatch: 'full'
  },
  {
    path: base + 'changebillflow',
    loadChildren: () => import('../flow-changebillingparam/change-billing-param.module').then(m => m.ChangeBillingParamModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'maintainsoc',
    loadChildren: () => import('../flow-maintainsoc/maintain-soc.module').then(m => m.MaintainSocModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'socmanager',
    loadChildren: () => import('../soc-manager/soc-manager.module').then(m => m.SocManagerModule)
  },
  {
    path: base + 'datareport',
    loadChildren: () => import('../data-report/data-report.module').then(m => m.DataReportModule)
  },
  {
    path: base + 'subscriberUpdateInfo',
    loadChildren: () => import('../subscriber-update-info/sub-update-info.module').then(m => m.SubUpdateInfoModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'banupdate',
    loadChildren: () => import('../ban-update-info/ban-update-info.module').then(m => m.BanUpdateInfoModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'orderdetail/:id',
    loadChildren: () => import('../order-components/order-detail/order-details.module').then(m => m.OrderDetailsModule)
  },
  {
    path: base + 'approverorderdetail/:id',
    loadChildren: () => import('../order-components/order-approvals/order-approvals.module').then(m => m.OrderApprovalsModule)
  },
  {
    path: base + 'approveorder/:id',
    loadChildren: () => import('../order-components/order-detail/order-details.module').then(m => m.OrderDetailsModule)
  },
  {
    path: base + 'home',
    loadChildren: () => import('../default-landing/default-landing.module').then(m => m.DefaultLandingModule)
  },
  {
    path: base + 'vvlflow',
    loadChildren: () => import('../vvl-flow/vvl-flow.module').then(m => m.VvlFlowModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'orderapprovals',
    loadChildren: () => import('../order-approvals/order-approvals.module').then(m => m.OrderApprovalsModule)
  },
  {
    path: base + 'omdetail/:id',
    loadChildren: () => import('../order-manager/order-manager.module').then(m => m.OrderManagerModule)
  },
  {
    path: base + 'ctflow',
    loadChildren: () => import('../ct-flow/ct-flow.module').then(m => m.CtFlowModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'actflow',
    loadChildren: () => import('../activation-flow/activation-flow.module').then(m => m.ActivationFlowModule),
    canActivate: [AccessResolverService]
  },
  {
    path: base + 'esimflow',
    loadChildren: () => import('../esim-flow/esim-flow.module').then(m => m.EsimFlowModule)
  },
  {
    path: base + 'esim-download',
    loadChildren: () => import('../esim-download/esim-download.module').then(m => m.EsimDownloadModule)
  },
  {
    path: base + 'xinvflow',
    loadChildren: () => import('../xinv-flow/xinv-flow.module').then(m => m.XinvFlowModule),
    canActivate: [AccessResolverService]
  },
  {
    path: 'error',
    loadChildren: () => import('../app/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
