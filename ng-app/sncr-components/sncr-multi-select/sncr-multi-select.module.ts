import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {SncrMultiSelectComponent} from './sncr-multi-select.component';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateModule} from '../sncr-translate/sncr-translate.module';

@NgModule({
  imports: [
    CommonModule,
    SncrControlsModule,
    NgbModule,
    FormsModule,
    TranslationModule,
    SncrTranslateModule
  ],
  declarations: [SncrMultiSelectComponent],
  exports: [SncrMultiSelectComponent]
})
export class SncrMultiSelectModule {}
