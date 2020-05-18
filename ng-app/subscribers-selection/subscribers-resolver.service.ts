import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SubscriberSelectionService} from './subscriber-selection.service';

@Injectable()
export class SubscribersResolver implements Resolve<any[]> {

  constructor(private subscriberSelectionService: SubscriberSelectionService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.subscriberSelectionService.getData(route.data['orderType']);
  }
}