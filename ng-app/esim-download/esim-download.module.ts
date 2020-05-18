import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {EsimDownloadComponent} from './esim-download.component';
import {EsimDownloadService} from './esim-download.service';
import {EsimDownloadRouting} from './esim-download.routing';
import {TranslationModule} from 'angular-l10n';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TopBarService} from '../app/top-bar/top-bar.service';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {EsimshopListModule} from './esimshop-list/esimshop-list.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    EsimDownloadRouting,
    SncrCommonsModule,
    SncrDatatableModule,
    SncrControlsModule,
    EsimshopListModule,
    SncrLoaderModule
  ],
  exports: [EsimDownloadComponent],
  declarations: [EsimDownloadComponent],
  providers: [
    EsimDownloadService,
    TimeoutService,
    TopBarService,
    DataSelectionService
  ]
})
export class EsimDownloadModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('default-data-table', 'esim-download', 'default-column-headers')
    );
  }
}