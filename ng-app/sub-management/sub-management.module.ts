import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';
import {NgbButtonsModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SubManagementReviewComponent} from './sub-management-review/sub-management-review.component';
import {SubManagementComponent} from './sub-management.component';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SubUpdateInfoService} from '../subscriber-update-info/sub-update-info.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrFlowModule,
    SncrNotificationModule,
    NgbModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    SubManagementComponent,
    SubManagementReviewComponent
  ],
  exports: [
    SubManagementComponent,
    SubManagementReviewComponent
  ],
  providers: [
    SubUpdateInfoService
  ]
})
export class SubManagementModule {
  constructor() {  }
}
