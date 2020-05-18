/**
 * Created by bhav0001 on 11-Jul-17.
 */
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {OrderHistoryComponent} from './order-history.component';
import {OrderHistoryService} from './order-history.service';
import {OrderHistoryRouting} from './order-history.routing';
import {OrderApprovalsService} from '../../order-approvals/order-approvals.service';
import {OrderModule} from '../order/order.module';
import {OrderDetailsModule} from '../common/order-details/order-details.module';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationModule} from 'angular-l10n';


@NgModule({
  imports: [
    FormsModule,
    SncrControlsModule,
    SncrDatatableModule,
    CommonModule,
    NgbModule,
    SncrLoaderModule,
    SncrNotificationModule,
    OrderHistoryRouting,
    OrderModule,
    OrderDetailsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderHistoryComponent
  ],
  providers: [
    OrderHistoryService,
    OrderApprovalsService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})

export class OrderHistorysModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('default-data-table', 'fixednet-order-history', 'order-details-common'));
  }
}
