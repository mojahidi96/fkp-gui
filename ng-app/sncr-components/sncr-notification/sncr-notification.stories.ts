import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, select, text} from '@storybook/addon-knobs';

import {Component} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';
import {NgxPageScrollModule} from 'ngx-page-scroll';

import {SncrNotificationModule} from './sncr-notification.module';

import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';

import * as SncrNotificationComponentAst from 'ast!./sncr-notification.component';
import {NotificationHandlerService} from './notification-handler.service';
import {generateDocumentation} from '../../../storybook/utils/api';

@Component({
  selector: 'message-handler',
  template: `
    <sncr-notification
      [handler]="notificationHandlerService"
    ></sncr-notification>
    <div style="height:110vh"></div>
    <div
      class="d-flex justify-content-around position-sticky"
      style="bottom: 10%;"
    >
      <button id="emitBasic" (click)="emitBasicMessage()">
        Test Basic Message
      </button>
      <button id="emitSuccess" (click)="emitSuccessMessage()">
        Test Success Message
      </button>
      <button id="emitWarning" (click)="emitWarningMessage()">
        Test Warning Message
      </button>
      <button id="emitError" (click)="emitErrorMessage()">
        Test Error Message
      </button>
      <button id="emitMultipleErrors" (click)="emitMultipleErrorMessage()">
        Test Multiple Error Messages
      </button>
      <button id="clear" (click)="clear()">Clear Alert</button>
    </div>
  `
})
export class NotificationHandlerComponent {
  constructor(public notificationHandlerService: NotificationHandlerService) {}
  emitBasicMessage() {
    this.notificationHandlerService.printBasicNotification('Basic');
  }
  emitSuccessMessage() {
    this.notificationHandlerService.printSuccessNotification('Success');
  }
  emitWarningMessage() {
    this.notificationHandlerService.printWarningNotification('Warning');
  }
  emitErrorMessage() {
    this.notificationHandlerService.printErrorNotification('Error');
  }
  emitMultipleErrorMessage() {
    this.notificationHandlerService.printErrorNotification([
      'Error 1',
      'Error 2',
      'Error 3'
    ]);
  }
  clear() {
    this.notificationHandlerService.clearNotification();
  }
}

storiesOf('SNCR Components|Notification', module)
  .addParameters(generateDocumentation(SncrNotificationComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        NgxPageScrollModule,
        SncrNotificationModule
      ],
      declarations: [NotificationHandlerComponent]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-notification [type]="type" [heading]="heading" [message]="message" [dismissible]="dismissible"></sncr-notification>`,
    props: {
      type: select(
        'Type',
        ['basic', 'success', 'info', 'warning', 'error', 'info-gray'],
        'basic'
      ),
      heading: text('Heading', 'Just so you know…'),
      message: text('Message', 'We will respond within 24 hours.'),
      dismissible: boolean('Dismissible', false)
    }
  }))
  .add('With Handlers', () => ({
    template: `<message-handler></message-handler>`
  }))
  .add('With Type Basic Information', () => ({
    template: `<sncr-notification [type]="type" [heading]="heading" [message]="message"></sncr-notification>`,
    props: {
      type: 'basic',
      heading: 'Just so you know…',
      message: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          erat, sed diam voluptua.`
    }
  }))
  .add('With Type Success', () => ({
    template: `<sncr-notification [type]="type" [heading]="heading" [message]="message"></sncr-notification>`,
    props: {
      type: 'success',
      heading: 'Thank you for your query',
      message: 'We will respond within 24 hours.'
    }
  }))
  .add('With Type Emphasized Information', () => ({
    template: `<sncr-notification [type]="type" [heading]="heading" [message]="message"></sncr-notification>`,
    props: {
      type: 'warning',
      heading: 'Just so you know…',
      message: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua.`
    }
  }))
  .add('With Type Error as Array', () => ({
    template: `<sncr-notification [type]="type" [heading]="heading" [errors]="errors"></sncr-notification>`,
    props: {
      type: 'error',
      heading: 'Sorry there have been 5 errors',
      errors: [
        'Please select a title',
        'Please enter a valid name',
        'Please enter a valid email address',
        'Please re-enter your email address',
        'Please select a customer type'
      ]
    }
  }));
