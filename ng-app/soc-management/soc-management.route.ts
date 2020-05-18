import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {SocManagementComponent} from './soc-management.component';


const routes: Routes = [
  {
    path: '',
    component: SocManagementComponent
  }
];

export const SocManagementRouting: ModuleWithProviders = RouterModule.forChild(routes);