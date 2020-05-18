import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslationModule} from 'angular-l10n';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {ButtonModule} from '../../sncr-components/sncr-controls/button/button.module';
import {CheckGroupModule} from '../../sncr-components/sncr-controls/check-group/check-group.module';
import {InputModule} from '../../sncr-components/sncr-controls/input/input.module';
import {RadioModule} from '../../sncr-components/sncr-controls/radio/radio.module';
import {SelectModule} from '../../sncr-components/sncr-controls/select/select.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrCheckboxModule} from '../../sncr-components/sncr-controls/checkbox/sncr-checkbox.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrPaginatorModule} from '../../sncr-components/sncr-datatable/sncr-paginator.module';
import {SncrSliderModule} from '../../sncr-components/sncr-slider/sncr-slider.module';
import {SvgIconModule} from '../../sncr-components/svg-icon/svg-icon.module';

import {ArticleSelectionComponent} from './article-selection.component';
import {ArticleSelectionService} from './article-selection.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    NgbTooltipModule,
    TranslationModule,

    ButtonModule,
    CheckGroupModule,
    InputModule,
    RadioModule,
    SelectModule,
    SncrNotificationModule,
    SncrCheckboxModule,
    SncrDatatableModule,
    SncrLoaderModule,
    SncrPaginatorModule,
    SncrSliderModule,
    SvgIconModule
  ],
  declarations: [ArticleSelectionComponent],
  exports: [ArticleSelectionComponent],
  providers: [ArticleSelectionService]
})
export class ArticleSelectionModule {}
