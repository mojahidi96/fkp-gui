/**
 * Created by rsah0002 on 5/19/2017.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DefaultLandingService} from './default-landing.service';

@Injectable()
export class DefaultLandingResolver implements Resolve<any[]> {

  constructor(private defaultLandingService: DefaultLandingService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.defaultLandingService.getMenu(location.hash.split('/')[1]);
  }
}