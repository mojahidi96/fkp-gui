import {RouterModule, Routes} from '@angular/router';
import {OrderUploadComponent} from './order-upload.component';
import {ModuleWithProviders} from '@angular/core';


const orderUploadRoutes: Routes = [
  {
    path: '',
    component: OrderUploadComponent
  }
];


export const orderUploadRouting: ModuleWithProviders = RouterModule.forChild(orderUploadRoutes);