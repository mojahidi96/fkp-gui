/**
 * Created by rsah0002 on 5/19/2017.
 */
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {FixedNetService} from './fixednet.service';

@Injectable()
export class FixednetResolver implements Resolve<any[]> {

  constructor(private fixedNetService: FixedNetService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.fixedNetService.getMenu();
  }
}