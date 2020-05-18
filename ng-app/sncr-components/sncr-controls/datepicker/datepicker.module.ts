import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';

import {DatepickerComponent} from './datepicker.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, SncrValidationMessagesModule],
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent]
})
export class DatepickerModule {}
