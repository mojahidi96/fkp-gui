/**
 * Created by srao0004 on 5/19/2017.
 */
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {SocGroupsService} from './soc-groups.service';

@Injectable()
export class GroupIconsResolver implements Resolve<any[]> {

  constructor(private socGroupsService: SocGroupsService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.socGroupsService.getIcons();
  }
}