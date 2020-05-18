import {Component, Input} from '@angular/core';
import {Language} from 'angular-l10n';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'order-overview',
  templateUrl: 'order-overview.component.html',
  styleUrls: ['order-overview.component.scss']
})
export class OrderOverviewComponent {

  @Input() orderSummary: any;
  @Input() prefix = '';
  @Language() lang: string;

  constructor() {
  }

  isPriceSectionRequired() {
    return UtilsService.notNull(this.orderSummary) &&
      ((UtilsService.notNull(this.orderSummary.tariffSummary)
        && this.orderSummary.tariffSummary.isNewTariff === 'Y'
        && this.orderSummary.tariffSummary.tariffs.length === 1)
      || (UtilsService.notNull(this.orderSummary.handySummary))
      || (this.orderSummary.socSummary && this.orderSummary.socSummary.length > 0));
  }

  isNewTariff() {
    return UtilsService.notNull(this.orderSummary) &&
      UtilsService.notNull(this.orderSummary.tariffSummary) &&
      this.orderSummary.tariffSummary.isNewTariff === 'Y';
  }

  subsidzesPrice(price) {
    return UtilsService.notNull(price) && price !== 0;
  }
}
