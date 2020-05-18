import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DwhDataRefreshComponent} from './dwh-data-refresh.component';


const routes: Routes = [
  {
    path: '',
    component: DwhDataRefreshComponent
  }
];

export const DwhDataRefreshRouting: ModuleWithProviders = RouterModule.forChild(routes);