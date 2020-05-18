import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';

import {RadioComponent} from './radio.component';

@NgModule({
  imports: [CommonModule, FormsModule, SncrValidationMessagesModule],
  declarations: [RadioComponent],
  exports: [RadioComponent]
})
export class RadioModule {}
