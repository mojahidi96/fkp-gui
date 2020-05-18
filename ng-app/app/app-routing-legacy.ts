import {Routes} from '@angular/router';
import {SocManagementComponent} from '../soc-management/soc-management.component';
import {SocManagementResolver} from '../soc-management/soc-management-resolver.service';

const base = 'legacy';
export const appLegacyRoutes: Routes = [
  {
    path: 'tariffoptions',
    component: SocManagementComponent,
    outlet: base,
    resolve: {
      availableSocs: SocManagementResolver
    }
  }
];