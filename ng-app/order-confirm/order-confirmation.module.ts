import {NgModule} from '@angular/core';

import {OrderConfirmationComponent} from './order-confirmation.component';
import {OrderConfirmationService} from './order-confirmation.service';
import {CommonModule} from '@angular/common';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    CommonModule,
    SncrNotificationModule,
    TranslationModule
  ],
  exports: [OrderConfirmationComponent],
  declarations: [OrderConfirmationComponent],
  providers: [OrderConfirmationService]
})
export class OrderConfirmationModule {
}
