import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslationModule} from 'angular-l10n';

import {InputModule} from '../../sncr-components/sncr-controls/input/input.module';
import {SelectModule} from '../../sncr-components/sncr-controls/select/select.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrCardSelectionModule} from '../../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrPlannedChangesModule} from '../../sncr-components/sncr-planned-changes/sncr-planned-changes.module';

import {SocSelectionComponent} from './soc-selection.component';
import {SncrStickyModule} from '../../sncr-components/sncr-sticky/sncr-sticky.module';
import {SocSelectionService} from './soc-selection.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslationModule,

    InputModule,
    SelectModule,
    SncrNotificationModule,
    SncrCardSelectionModule,
    SncrLoaderModule,
    SncrPlannedChangesModule,
    SncrStickyModule
  ],
  declarations: [SocSelectionComponent],
  exports: [SocSelectionComponent],
  providers: [SocSelectionService]
})
export class SocSelectionModule {}
