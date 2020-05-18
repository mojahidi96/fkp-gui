import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {DataReportComponent} from './data-report.component';
import {DataReportRouting} from './data-report.routing';
import {FilterOptionsResolver} from './filter-options-resolver.service';
import {DataReportService} from './data-rerport.service';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {FormsModule} from '@angular/forms';
import {SncrPipesModule} from '../sncr-components/sncr-pipes/sncr-pipes.module';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationModule} from 'angular-l10n';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {SncrDownloadSelectionsModule} from '../sncr-components/sncr-download-selections/sncr-download-selections.module';
import {DataReportShopComponent} from './shops/data-report-shop.component';
import {DataReportShopService} from './shops/data-report-shop.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DataReportRouting,
    FormsModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrLoaderModule,
    SncrPipesModule,
    SncrNotificationModule,
    SncrDownloadSelectionsModule,
    TranslationModule,
    NgbModule
  ],
  declarations: [
    DataReportComponent,
    DataReportShopComponent
  ],
  providers: [
    DataReportService,
    DataSelectionService,
    DataReportShopService
  ]
})
export class DataReportModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('default-data-table', 'data-report-page'));
  }
}