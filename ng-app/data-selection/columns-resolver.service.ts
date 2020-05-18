import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataSelectionService} from './data-selection.service';

@Injectable()
export class ColumnsResolver implements Resolve<any[]> {

  constructor(private dataSelectionService: DataSelectionService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.dataSelectionService.getColumns(route.data['configId']);
  }
}