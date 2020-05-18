import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {OrderModule} from '../../../fixednet/order/order.module';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {FormsModule} from '@angular/forms';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {OrderUploadComponent} from './order-upload.component';
import {UploadChangesModule} from '../../../upload-changes/upload-changes.module';
import {orderUploadRouting} from './order-upload.routing';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';


@NgModule({
  imports: [
    CommonModule,
    orderUploadRouting,
    SncrNotificationModule,
    OrderModule,
    SncrControlsModule,
    FormsModule,
    UploadChangesModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderUploadComponent
  ],
  providers: [EDOrderDetailsService]
})
export class OrderUploadModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('default-data-table', 'ed-order-manager',
      'common'));
  }
}
