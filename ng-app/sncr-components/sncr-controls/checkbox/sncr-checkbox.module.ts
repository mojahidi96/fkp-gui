import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CheckGroupModule} from '../check-group/check-group.module';
import {SncrValidationMessagesModule} from '../validation-messages/sncr-validation-messages.module';

import {SncrCheckboxComponent} from './sncr-checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckGroupModule,
    SncrValidationMessagesModule
  ],
  declarations: [SncrCheckboxComponent],
  exports: [SncrCheckboxComponent]
})
export class SncrCheckboxModule {}
