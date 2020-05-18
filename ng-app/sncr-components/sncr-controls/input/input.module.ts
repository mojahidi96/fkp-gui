import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';
import {TextFilterPipe} from '../../sncr-pipes/text-filter.pipe';

import {InputComponent} from './input.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, SncrValidationMessagesModule],
  declarations: [InputComponent],
  providers: [TextFilterPipe],
  exports: [InputComponent]
})
export class InputModule {}
