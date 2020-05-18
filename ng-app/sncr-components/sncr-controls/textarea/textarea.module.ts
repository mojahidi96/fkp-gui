import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';

import {TextareaComponent} from './textarea.component';

@NgModule({
  imports: [CommonModule, FormsModule, SncrValidationMessagesModule],
  declarations: [TextareaComponent],
  exports: [TextareaComponent]
})
export class TextareaModule {}
