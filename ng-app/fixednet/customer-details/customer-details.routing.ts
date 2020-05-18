import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {CustomerDetailsComponent} from './customer-details.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsComponent,
  }
];

export const CustomerDetailsRouting: ModuleWithProviders = RouterModule.forChild(routes);