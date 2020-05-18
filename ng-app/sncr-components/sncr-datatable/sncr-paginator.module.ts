import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslationModule} from 'angular-l10n';
import {PaginatorModule} from 'primeng/paginator';

import {SncrPaginatorComponent} from './sncr-paginator.component';
import {SelectModule} from '../sncr-controls/select/select.module';
import {SncrTranslateModule} from '../sncr-translate/sncr-translate.module';
import {SvgIconModule} from '../svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    PaginatorModule,
    TranslationModule,
    SncrTranslateModule,
    SvgIconModule
  ],
  declarations: [SncrPaginatorComponent],
  exports: [SncrPaginatorComponent]
})
export class SncrPaginatorModule {}
