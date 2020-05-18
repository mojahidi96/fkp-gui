import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {OmDetailService} from '../order-components/order-commons/om-detail/om-detail.service';

@Injectable()
export class OrderManagerResolver implements Resolve<any> {

  constructor(private omDetailService: OmDetailService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.omDetailService.getOrder(route.params.id);
  }
}