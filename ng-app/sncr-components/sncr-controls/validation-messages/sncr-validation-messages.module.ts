import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslationModule} from 'angular-l10n';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ValidationMessagesComponent} from '../validation-messages/sncr-validation-messages.component';
import {ValidationStylesDirective} from '../validation-messages/validation-styles.directive';

@NgModule({
  imports: [CommonModule, NgbModule, TranslationModule],
  declarations: [ValidationMessagesComponent, ValidationStylesDirective],
  exports: [ValidationMessagesComponent, ValidationStylesDirective]
})
export class SncrValidationMessagesModule {}
