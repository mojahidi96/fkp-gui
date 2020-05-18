import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {RolesService} from './roles.service';

@Injectable()
export class UserRolesResolver implements Resolve<any[]> {

  constructor(private roleService: RolesService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.roleService.getUserRole();
  }
}