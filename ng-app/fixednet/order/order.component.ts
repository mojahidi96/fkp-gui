import {Component, HostListener, OnInit} from '@angular/core';
import {OrderService} from './order.service';
import {SncrConfirmDeactivateInterface} from '../../sncr-components/sncr-confirm-deactivate/sncr-confirm-deactivate.interface';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {TimeoutService} from '../../app/timeout/timeout.service';

@Component({
  selector: 'fn-order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit, SncrConfirmDeactivateInterface {

  enabledTabs;

  constructor(private orderService: OrderService, private timeoutService: TimeoutService) {
  }

  ngOnInit(): void {
    this.enabledTabs = this.orderService.enabledTabs;
    this.orderService.resetData();
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate($event?: any): boolean {
    return this.timeoutService.timeRemaining === 0 || !UtilsService.notNull(this.orderService.getFnorderRequest());
  }
}