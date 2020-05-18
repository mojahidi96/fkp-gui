import {RouterModule, Routes} from '@angular/router';
import {DataReportComponent} from './data-report.component';
import {ModuleWithProviders} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DataReportComponent
  }
];

export const DataReportRouting: ModuleWithProviders = RouterModule.forChild(routes);