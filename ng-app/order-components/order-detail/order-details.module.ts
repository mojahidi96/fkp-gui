import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OrderDetailsComponent} from './order-details.component';
import {OrderDetailsService} from './order-details.service';
import {orderDetailsRouting} from './order-details.routing';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {OrderDetailsResolver} from './order-details.resolver';
import {DataSelectionService} from '../../data-selection/data-selection.service';
import {OrderDetailsAdmincommentsResolver} from './order-details.admincomments.resolver';
import {OrderCommonModule} from '../order-commons/order-common.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {OrderOverviewModule} from '../../flow-sections/order-overview/order-overview.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    orderDetailsRouting,
    NgbModule,
    SncrControlsModule,
    OrderCommonModule,
    SncrNotificationModule,
    SncrLoaderModule,
    SncrDatatableModule,
    OrderOverviewModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderDetailsComponent
  ],
  providers: [
    OrderDetailsService,
    NgbActiveModal,
    OrderDetailsResolver,
    OrderDetailsAdmincommentsResolver,
    DataSelectionService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]

})

export class OrderDetailsModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table',
      'default-column-headers', 'vvl-flow', 'order-details-common'));
  }
}
