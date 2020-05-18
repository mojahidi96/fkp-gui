import {Routes, RouterModule} from '@angular/router';
import {EditShopComponent} from './edit-shop.component';
import {ModuleWithProviders} from '@angular/core';
import {ShopListComponent} from './shop-list/shop-list.component';


const routes: Routes = [
  {
    path: '',
    component: ShopListComponent
  },
  {
    path: 'edit',
    component: EditShopComponent
  }
];

export const editShopRouting: ModuleWithProviders = RouterModule.forChild(routes);