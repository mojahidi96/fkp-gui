import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableModule} from 'primeng/datatable';
import {SharedModule} from 'primeng/shared';
import {SncrDatatableComponent} from './sncr-datatable.component';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {AdvancedFilterComponent} from './filter/advanced-filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SncrHeaderComponent} from './sncr-header.component';
import {SncrFooterComponent} from './sncr-footer.component';
import {
  NgbButtonsModule,
  NgbModule,
  NgbPopoverModule
} from '@ng-bootstrap/ng-bootstrap';
import {FilterService} from './filter/filter.service';
import {SncrMultiSelectModule} from '../sncr-multi-select/sncr-multi-select.module';
import {SncrEditableComponent} from './sncr-editable.component';
import {TranslationModule} from 'angular-l10n';
import {SncrDatatableService} from './sncr-datatable.service';
import {SncrTranslateModule} from '../sncr-translate/sncr-translate.module';
import {BanUpdateInfoService} from '../../ban-update-info/ban-update-info.service';
import {SncrDatatableOpComponent} from './sncr-datatable-op.component';
import {SncrResultsComponent} from './sncr-results/sncr-results.component';
import {SncrPaginatorModule} from './sncr-paginator.module';
import {SncrNotificationModule} from '../sncr-notification/sncr-notification.module';
import {FilterRestoreService} from '../sncr-commons/filter-restore.service';
import {SvgIconModule} from '../svg-icon/svg-icon.module';

@NgModule({
  declarations: [
    AdvancedFilterComponent,
    SncrDatatableComponent,
    SncrDatatableOpComponent,
    SncrEditableComponent,
    SncrFooterComponent,
    SncrHeaderComponent,
    SncrResultsComponent
  ],
  exports: [
    SncrPaginatorModule,
    SncrDatatableComponent,
    SncrDatatableOpComponent,
    SncrFooterComponent,
    SncrHeaderComponent,
    SncrResultsComponent
  ],
  imports: [
    CommonModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    NgbButtonsModule,
    NgbModule,
    SharedModule,
    SncrNotificationModule,
    SncrControlsModule,
    SncrMultiSelectModule,
    SncrPaginatorModule,
    TranslationModule,
    SncrTranslateModule,
    SvgIconModule
  ],
  providers: [
    FilterService,
    SncrDatatableService,
    BanUpdateInfoService,
    FilterRestoreService
  ]
})
export class SncrDatatableModule {}
