import {Component, Inject, Input, OnInit} from '@angular/core';
import {OrderConfirmationService} from './order-confirmation.service';
import {OrderConfirmDetails, OrderType} from './order-confirm';
import {Language, TranslationService} from 'angular-l10n';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';

@Component({
  selector: 'order-confirmation',
  templateUrl: 'order-confirmation.component.html',
  styleUrls: ['order-confirmation.component.scss']
})
export class OrderConfirmationComponent {

  @Input() orderDetails: OrderConfirmDetails;
  @Language() lang: string;

  sub: any;

  constructor(private orderConfirmationService: OrderConfirmationService,
              public statusNotify: NotificationHandlerService,
              public translation: TranslationService) {
  }


  downloadPdf(orderNumber, orderType) {
    this.showInProgressMsg();
    this.orderConfirmationService.downloadPdf(orderNumber, orderType).subscribe(data => {
        window.location.href = '/buyflow/rest/orderflow/' + orderNumber
          + '/' + OrderType[orderType] + '/pdf?t=' + new Date().getTime();
      },
      error => this.retryMessage());
  }

  showInProgressMsg() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification(this.translation.translate('DOWNLOAD_IN-PROGRESS'));
  }

  retryMessage() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification(this.translation.translate('ORDER_IN-PROGRESS'));
  }
}
