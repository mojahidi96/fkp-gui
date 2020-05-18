import {RouterModule, Routes} from '@angular/router';
import {EDReportingComponent} from './ed-reporting.component';
import {ModuleWithProviders} from '@angular/core';


const edReportingRoutes: Routes = [
  {
    path: '',
    component: EDReportingComponent
  }
];


export const edReportingRouting: ModuleWithProviders = RouterModule.forChild(edReportingRoutes);