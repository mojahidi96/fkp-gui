import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {DwhDataRefreshRouting} from './dwh-data-refresh.routing';
import {DwhDataRefreshService} from './dwh-data-refresh.service';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {FixedNetService} from '../fixednet.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {DwhDataRefreshComponent} from './dwh-data-refresh.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SncrControlsModule,
    DwhDataRefreshRouting,
    SncrDatatableModule,
    CommonModule,
    NgbModule,
    SncrLoaderModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    DwhDataRefreshComponent
  ],
  providers: [DwhDataRefreshService, FixedNetService]
})
export class DwhDataRefreshModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager', 'default-data-table'));
  }
}
