import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TranslationModule} from 'angular-l10n';

import {ButtonModule} from '../../sncr-components/sncr-controls/button/button.module';
import {CheckGroupModule} from '../../sncr-components/sncr-controls/check-group/check-group.module';
import {RadioModule} from '../../sncr-components/sncr-controls/radio/radio.module';
import {SelectModule} from '../../sncr-components/sncr-controls/select/select.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrCheckboxModule} from '../../sncr-components/sncr-controls/checkbox/sncr-checkbox.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrPaginatorModule} from '../../sncr-components/sncr-datatable/sncr-paginator.module';
import {SncrPlannedChangesModule} from '../../sncr-components/sncr-planned-changes/sncr-planned-changes.module';
import {SvgIconModule} from '../../sncr-components/svg-icon/svg-icon.module';

import {TariffgridSelectionComponent} from './tariffgrid-selection.component';
import {SncrStickyModule} from '../../sncr-components/sncr-sticky/sncr-sticky.module';
import {TariffSelectionService} from './tariff-selection.service';
import {FileExportService} from '../../sncr-components/sncr-commons/file-export.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslationModule,

    ButtonModule,
    CheckGroupModule,
    RadioModule,
    SelectModule,
    SncrNotificationModule,
    SncrCheckboxModule,
    SncrDatatableModule,
    SncrLoaderModule,
    SncrPaginatorModule,
    SncrPlannedChangesModule,
    SncrStickyModule,
    SvgIconModule
  ],
  declarations: [TariffgridSelectionComponent],
  exports: [TariffgridSelectionComponent],
  providers: [TariffSelectionService, FileExportService]
})
export class TariffgridSelectionModule {}
