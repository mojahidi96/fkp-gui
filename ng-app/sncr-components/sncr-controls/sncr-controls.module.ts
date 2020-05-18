import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslationModule} from 'angular-l10n';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ButtonModule} from './button/button.module';
import {CheckGroupModule} from './check-group/check-group.module';
import {DatepickerModule} from './datepicker/datepicker.module';
import {InputModule} from './input/input.module';
import {RadioModule} from './radio/radio.module';
import {SelectModule} from './select/select.module';
import {SncrCheckboxModule} from './checkbox/sncr-checkbox.module';
import {SncrValidationMessagesModule} from './validation-messages/sncr-validation-messages.module';
import {TextareaModule} from './textarea/textarea.module';

import {MinRequiredDirective} from './checkbox/min-required.directive';
import {AllRequiredDirective} from './checkbox/all-required.directive';
import {MaxRequiredDirective} from './checkbox/max-required.directive';
import {DatepickerParserService} from './datepicker/datepicker-parser.service';
import {SncrCommonsModule} from '../sncr-commons/sncr-commons.module';
import {ValidationMessagesService} from './validation-messages/sncr-validation-messages.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SncrCommonsModule,
    TranslationModule,

    ButtonModule,
    CheckGroupModule,
    DatepickerModule,
    InputModule,
    RadioModule,
    SelectModule,
    SncrCheckboxModule,
    SncrValidationMessagesModule,
    TextareaModule
  ],
  declarations: [
    AllRequiredDirective,
    MaxRequiredDirective,
    MinRequiredDirective
  ],
  exports: [
    ButtonModule,
    CheckGroupModule,
    DatepickerModule,
    InputModule,
    RadioModule,
    SelectModule,
    SncrCheckboxModule,
    SncrValidationMessagesModule,
    TextareaModule,

    AllRequiredDirective,
    MaxRequiredDirective,
    MinRequiredDirective
  ],
  providers: [DatepickerParserService, ValidationMessagesService]
})
export class SncrControlsModule {}
