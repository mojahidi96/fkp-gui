/**
 * Created by bhav0001 on 08-Mar-17.
 */
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {SocManagerComponent} from './soc-manager.component';
import {GroupIconsResolver} from './soc-groups/soc-group.component.resolver';


const routes: Routes = [
  {
    path: '',
    component: SocManagerComponent,
    resolve: {
      groupIcons: GroupIconsResolver
    }
  },
];

export const socRouting: ModuleWithProviders = RouterModule.forChild(routes);