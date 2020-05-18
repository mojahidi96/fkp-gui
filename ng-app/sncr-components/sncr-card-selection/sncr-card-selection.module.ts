import {NgModule} from '@angular/core';
import {SncrCardSelectionComponent} from './sncr-card-selection.component';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {SncrRadioOptionsComponent} from './sncr-radio-options.component';
import {FormsModule} from '@angular/forms';
import {SncrCheckboxOptionsComponent} from './sncr-checkbox-options.component';
import {SncrOptionsExtraComponent} from './sncr-options-extra.component';
import {SncrPlannedChangesModule} from '../sncr-planned-changes/sncr-planned-changes.module';
import {SncrNotificationModule} from '../sncr-notification/sncr-notification.module';
import {SncrCardSelectionService} from './sncr-card-selection.service';
import {SncrTranslateModule} from '../sncr-translate/sncr-translate.module';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SncrNotificationModule,
    SncrControlsModule,
    SncrPlannedChangesModule,
    SncrTranslateModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
  ],
  declarations: [
    SncrCardSelectionComponent,
    SncrCheckboxOptionsComponent,
    SncrOptionsExtraComponent,
    SncrRadioOptionsComponent
  ],
  exports: [
    SncrCardSelectionComponent,
    SncrRadioOptionsComponent,
    SncrCheckboxOptionsComponent
  ],
  providers: [SncrCardSelectionService]
})
export class SncrCardSelectionModule {

}