import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';

import {ErrorComponent} from './error.component';

@NgModule({
  imports: [
    SncrNotificationModule,
    RouterModule.forChild([
      {
        path: '', component: ErrorComponent
      }
    ])
  ],
  exports: [],
  declarations: [ErrorComponent]
})
export class ErrorModule { }