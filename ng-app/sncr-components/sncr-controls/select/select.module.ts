import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';

import {SelectComponent} from './select.component';

@NgModule({
  imports: [CommonModule, FormsModule, SncrValidationMessagesModule],
  declarations: [SelectComponent],
  exports: [SelectComponent]
})
export class SelectModule {}
