import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {SncrCommonsModule} from '../../sncr-components/sncr-commons/sncr-commons.module';
import {EsimshopListComponent} from './esimshop-list.component';
import {EsimShopListService} from './esimshop-list.service';


@NgModule({
  imports: [
    CommonModule,
    TranslationModule,
    NgbModule,
    SncrCommonsModule,
    SncrDatatableModule,
    SncrLoaderModule
  ],
  declarations: [EsimshopListComponent],
  providers: [EsimShopListService],
  exports: [EsimshopListComponent]
})
export class EsimshopListModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('default-data-table', 'esim-download', 'default-column-headers')
    );
  }
}