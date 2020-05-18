import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {OrderDetailsService} from './order-details.service';
import {Observable} from 'rxjs';

@Injectable()
export class OrderDetailsAdmincommentsResolver implements Resolve<any[]> {


  constructor(private orderDetailsServive: OrderDetailsService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.orderDetailsServive.getAdminAndSubComments(route.params.id);
  }
}