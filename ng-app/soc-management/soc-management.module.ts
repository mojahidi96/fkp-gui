import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {RouterModule} from '@angular/router';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';

import {SocManagementResolver} from './soc-management-resolver.service';
import {SocManagementService} from './soc-management.service';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {SocManagementComponent} from './soc-management.component';
import {SocManagementRouting} from './soc-management.route';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbButtonsModule,
    SncrNotificationModule,
    SncrControlsModule,
    SncrCardSelectionModule,
    SncrDatatableModule,
    RouterModule,
    SocManagementRouting,
    TranslationModule
  ],
  declarations: [
    SocManagementComponent
  ],
  exports: [SocManagementComponent],
  providers: [
    SocManagementResolver,
    SocManagementService
  ]
})
export class SocManagementModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'soc-panel',
        'selection-panel'
      )
    );
  }
}