/**
 * Created by bhav0001 on 06-Jul-17.
 */
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrLoaderModule} from '../../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {OrderDetailsService} from './order-details.service';
import {OrderModule} from '../../order/order.module';
import {OrderDetailsComponent} from './order-details.component';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';


@NgModule({
  imports: [
    FormsModule,
    SncrControlsModule,
    CommonModule,
    NgbModule,
    SncrLoaderModule,
    SncrNotificationModule,
    OrderModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderDetailsComponent
  ],
  providers: [
    OrderDetailsService
  ]

})

export class OrderDetailsModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('order-details-common'));
  }
}