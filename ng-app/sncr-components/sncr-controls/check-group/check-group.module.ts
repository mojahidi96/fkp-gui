import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';
import {CheckGroupComponent} from './check-group.component';

@NgModule({
  imports: [CommonModule, FormsModule, SncrValidationMessagesModule],
  declarations: [CheckGroupComponent],
  exports: [CheckGroupComponent]
})
export class CheckGroupModule {}
