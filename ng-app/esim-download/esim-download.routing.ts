import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {EsimDownloadComponent} from './esim-download.component';
const routes: Routes = [
  {
    path: '',
    component: EsimDownloadComponent
  }
];

export const EsimDownloadRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);