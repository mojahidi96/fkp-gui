import {Routes, RouterModule} from '@angular/router';
import {CreateShopComponent} from './create-shop.component';
import {ModuleWithProviders} from '@angular/core';


const routes: Routes = [
  {
    path: '',
    component: CreateShopComponent
  },
];

export const createShopRouting: ModuleWithProviders = RouterModule.forChild(routes);