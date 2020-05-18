import {NotificationHandlerService} from '../../../../sncr-components/sncr-notification/notification-handler.service';
import {TranslationService} from 'angular-l10n';

export interface StatusRequest {
  request?: any;
}


export class OrderStatusChange {
  static readonly type = '[StatusChange] statusChange';

  constructor(public statusRequest: StatusRequest) {

  }
}



