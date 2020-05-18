import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';

import {SncrNotificationComponent} from './sncr-notification.component';
import {NotificationHandlerService} from './notification-handler.service';
import {NotificationHandlerFactory} from './notification-handler.factory';
import {SvgIconModule} from '../svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, TranslationModule, SvgIconModule],
  declarations: [SncrNotificationComponent],
  exports: [SncrNotificationComponent],
  providers: [
    NotificationHandlerService,
    {
      provide: 'NotificationHandlerFactory',
      useFactory: NotificationHandlerFactory
    }
  ]
})
export class SncrNotificationModule {}
