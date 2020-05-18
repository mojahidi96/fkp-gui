import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SncrDatatableService} from '../sncr-components/sncr-datatable/sncr-datatable.service';
import {LazyParams} from '../sncr-components/sncr-datatable/lazy-params';


@Injectable()
export class LazyCountResolver implements Resolve<any> {

  constructor(private sncrDatatableService: SncrDatatableService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let lazyParams = new LazyParams();
    lazyParams['configId'] = route.data['configId'];
    lazyParams.sortField = '1';
    lazyParams.sortOrder = 1;
    return this.sncrDatatableService.getCount('/buyflow/rest/table/custom', lazyParams);
  }
}