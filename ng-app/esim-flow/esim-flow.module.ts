import {EsimFlowComponent} from './esim-flow.component';
import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {NgModule} from '@angular/core';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {EsimFlowRouting} from './esim-flow.route';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {NgbAccordionModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {EsimFlowService} from './esim-flow.service';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SncrPipesModule} from '../sncr-components/sncr-pipes/sncr-pipes.module';


@NgModule({
  imports: [
    CommonModule,
    SncrCommonsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    EsimFlowRouting,
    NgbAccordionModule,
    SncrNotificationModule,
    SncrDatatableModule,
    ReactiveFormsModule,
    SncrControlsModule,
    NgbPopoverModule,
    SncrLoaderModule,
    SncrPipesModule
  ],
  declarations: [EsimFlowComponent],
  providers: [
    ColumnsResolver,
    LazyCountResolver,
    DataSelectionService,
    EsimFlowService
  ]
})
export class EsimFlowModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'default-column-headers',
        'default-data-table',
        'esim-flow'
      )
    );
  }
}
