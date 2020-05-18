import {CommonModule} from '@angular/common';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {NgModule} from '@angular/core';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {XinvFlowRouting} from './xinv-flow.route';
import {XinvFlowComponent} from './xinv-flow.component';
import {XinvFlowService} from './xinv-flow.service';


@NgModule({
  imports: [
    CommonModule,
    SncrCommonsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    XinvFlowRouting,
    SncrNotificationModule,
    SncrDatatableModule
  ],
  declarations: [XinvFlowComponent],
  providers: [
    ColumnsResolver,
    LazyCountResolver,
    DataSelectionService,
    XinvFlowService
  ]
})
export class XinvFlowModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'default-column-headers',
        'default-data-table',
        'xinv-flow'
      )
    );
  }
}
