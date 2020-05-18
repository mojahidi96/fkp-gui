import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {BulkEditComponent} from './bulk-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BulkEditComponent
  }
];

export const BulkEditRouting: ModuleWithProviders = RouterModule.forChild(routes);