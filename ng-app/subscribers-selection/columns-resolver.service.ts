import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SubscriberSelectionService} from './subscriber-selection.service';
import {SubscriberType} from './subscriber-selection';

@Injectable()
export class ColumnsResolver implements Resolve<SubscriberType[]> {

  constructor(private subscriberSelectionService: SubscriberSelectionService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SubscriberType[]> {
    return this.subscriberSelectionService.getDynamicColumn(route.data['orderType']);
  }
}