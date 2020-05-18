import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SubscriberSelectionModule} from '../subscribers-selection/subscriber-selection.module';
import {TranslationModule} from 'angular-l10n';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {
    NgbButtonsModule,
    NgbCarouselModule,
    NgbTabsetModule,
    NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SncrMultiSelectModule} from '../sncr-components/sncr-multi-select/sncr-multi-select.module';
import {ClientOrderDetailsModule} from '../client-order-details/client-order-details.module';
import {SncrSliderModule} from '../sncr-components/sncr-slider/sncr-slider.module';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {TariffSelectionService} from '../flow-sections/tariff-selection/tariff-selection.service';
import {RolesService} from '../flow-maintainsoc/roles.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {OrderOverviewModule} from '../flow-sections/order-overview/order-overview.module';
import {TariffgridSelectionModule} from '../flow-sections/tariff-selection/tariffgrid-selection.module';
import {CtFlowComponent} from './ct-flow.component';
import {CtFlowRouting} from './ct-flow.route';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {OrderReviewModule} from '../flow-sections/order-review/order-review.module';
import {SncrFileDropModule} from '../sncr-components/sncr-file-drop/sncr-file-drop.module';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SncrDatatableModule,
    NgbButtonsModule,
    SncrControlsModule,
    SncrNotificationModule,
    SncrFlowModule,
    SubscriberSelectionModule,
    SncrCardSelectionModule,
    SncrCommonsModule,
    SncrLoaderModule,
    SncrSliderModule,
    NgbCarouselModule,
    NgbTabsetModule,
    ClientOrderDetailsModule,
    OrderConfirmationModule,
    SncrMultiSelectModule,
    OrderOverviewModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    CtFlowRouting,
    NgbTooltipModule,
    TariffgridSelectionModule,
    OrderReviewModule,
    SncrFileDropModule,
    SvgIconModule
  ],
  declarations: [CtFlowComponent],
  providers: [
    ColumnsResolver,
    LazyCountResolver,
    DataSelectionService,
    RolesService,
    TariffSelectionService
  ]
})
export class CtFlowModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'default-column-headers',
        'default-data-table',
        'selection-panel',
        'tariff-panel',
        'order-review-panel',
        'order-confirmation-panel',
        'ct-flow',
        'soc-panel',
        'shopping-cart',
        'save-shopping-cart',
        'sncr-file-drop'
      )
    );
  }
}
