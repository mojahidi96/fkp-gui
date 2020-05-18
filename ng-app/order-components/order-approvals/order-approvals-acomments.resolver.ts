import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OrderApprovalsService} from './order-approvals.service';

@Injectable()
export class OrderApprovalsAcommentsResolver implements Resolve<any[]> {


  constructor(private orderApprovalService: OrderApprovalsService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    return this.orderApprovalService.getAdminAndSubComments(route.params.id);
  }
}