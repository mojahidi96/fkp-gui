import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {SocManagementService} from './soc-management.service';
import {AvailableSocs} from '../management-soc/classes/dtos/available-socs';

@Injectable()
export class SocManagementResolver implements Resolve<AvailableSocs> {

  constructor(private socManagementService: SocManagementService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<AvailableSocs> {
    return this.socManagementService.getSocData();
  }
}