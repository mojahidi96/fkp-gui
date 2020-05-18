import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderSubmitComponent} from './order-submit.component';
import {OrderSubmitService} from './order-submit.service';
import {RouterModule, Routes} from '@angular/router';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {OrderModule} from '../../../fixednet/order/order.module';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {FormsModule} from '@angular/forms';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {OrderConfirmationModule} from '../../../order-confirm/order-confirmation.module';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';
import {SncrLoaderModule} from '../../../sncr-components/sncr-loader/sncr-loader.module';

const routes: Routes = [
  {
    path: '',
    component: OrderSubmitComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SncrNotificationModule,
    OrderModule,
    SncrControlsModule,
    FormsModule,
    OrderConfirmationModule,
    TranslationModule,
    SncrLoaderModule,
  ],
  declarations: [
    OrderSubmitComponent
  ],
  providers: [
    OrderSubmitService,
    EDOrderDetailsService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})
export class OrderSubmitModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager',
      'common'));
  }
}
