import {NgModule} from '@angular/core';
import {BulkEditComponent} from './bulk-edit.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {BulkEditService} from './bulk-edit.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {BanSubValidatorsService} from '../ban-sub-common/ban-sub-validators.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BanUpdateInfoService} from '../ban-update-info/ban-update-info.service';
import {TranslationModule} from 'angular-l10n';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SncrControlsModule,
    SncrNotificationModule,
    NgbModule,
    TranslationModule
  ],
  exports: [BulkEditComponent],
  declarations: [BulkEditComponent],
  providers: [
    BulkEditService,
    BanSubValidatorsService,
    BanUpdateInfoService
  ]
})
export class BulkEditModule {

}