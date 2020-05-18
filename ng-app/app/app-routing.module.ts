import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {appMobileRoutes} from './app-routing-mobile';
import {appFixednetRoutes} from './app-routing-fixednet';
import {appLegacyRoutes} from './app-routing-legacy';
import {SocManagementModule} from '../soc-management/soc-management.module';
import {appEdRoutes} from './app-routing.ed';

const routes: Routes = [...appFixednetRoutes, ...appLegacyRoutes, ...appEdRoutes, ...appMobileRoutes];

@NgModule({
  imports: [
    SocManagementModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}