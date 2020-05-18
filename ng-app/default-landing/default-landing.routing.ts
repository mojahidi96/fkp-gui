import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DefaultLandingComponent} from './default-landing.component';
import {SubMenusComponent} from './sub-menus/sub-menus.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLandingComponent
  },
  {
    path: 'admin',
    component: SubMenusComponent
  },
  {
    path: 'order',
    component: SubMenusComponent
  }
];

export const DefaultLandingRouting: ModuleWithProviders = RouterModule.forChild(routes);