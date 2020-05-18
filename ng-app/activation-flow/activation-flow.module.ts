import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {TranslationModule} from 'angular-l10n';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {
  NgbButtonsModule,
  NgbCarouselModule, NgbPopoverModule,
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
import {RolesService} from '../flow-maintainsoc/roles.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {OrderOverviewModule} from '../flow-sections/order-overview/order-overview.module';
import {TariffgridSelectionModule} from '../flow-sections/tariff-selection/tariffgrid-selection.module';
import {ActivationFlowComponent} from './activation-flow.component';
import {ActivationFlowRouting} from './activation-flow.route';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {OrderReviewModule} from '../flow-sections/order-review/order-review.module';
import {ArticleSelectionModule} from '../flow-sections/article-selection/article-selection.module';
import {SocSelectionModule} from '../flow-sections/soc-selection/soc-selection.module';
import {DebitorSelectionModule} from '../flow-sections/debitor-selection/debitor-selection.module';
import {ShipmentSelectionModule} from '../flow-sections/shipment-selection/shipment-selection.module';
import {SncrDisplayAddressModule} from '../sncr-components/sncr-display-address/sncr-display-address.module';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {BulkEditModule} from '../orderflow-bulk-edits/bulk-edit.module';
import {SubManagementModule} from '../sub-management/sub-management.module';
import {SncrFileDropModule} from '../sncr-components/sncr-file-drop/sncr-file-drop.module';
import {SncrDownloadSelectionsModule} from '../sncr-components/sncr-download-selections/sncr-download-selections.module';
import {MSISDNResolverService} from '../ban-sub-common/msisdn-resolver-service';
import {SimTypeResolverService} from '../ban-sub-common/simtype-resolver.service';
import {UploadChangesService} from './../upload-changes/upload-changes.service';
import {SubscriberTableComponent} from './subscriber-table/subscriber-table.component';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgbCarouselModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbPopoverModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),

    ActivationFlowRouting,
    SncrCommonsModule,
    SncrDatatableModule,
    SncrControlsModule,
    SncrNotificationModule,
    SncrFlowModule,
    SncrCardSelectionModule,
    SncrLoaderModule,
    SncrSliderModule,
    SncrMultiSelectModule,

    TariffgridSelectionModule,
    ArticleSelectionModule,
    SocSelectionModule,
    SncrDisplayAddressModule,
    DebitorSelectionModule,
    ShipmentSelectionModule,
    OrderReviewModule,
    ClientOrderDetailsModule,
    OrderConfirmationModule,
    OrderOverviewModule,

    SubManagementModule,
    BulkEditModule,
    SncrFileDropModule,
    SncrDownloadSelectionsModule,
    SvgIconModule
  ],
  declarations: [ActivationFlowComponent, SubscriberTableComponent],
  providers: [
    ColumnsResolver,
    LazyCountResolver,
    DataSelectionService,
    CountriesResolverService,
    SimTypeResolverService,
    RolesService,
    MSISDNResolverService,
    UploadChangesService
  ]
})
export class ActivationFlowModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'default-column-headers',
        'default-data-table',
        'address-selection-bundle',
        'shopping-cart',
        'selection-panel',
        'tariff-panel',
        'order-review-panel',
        'order-confirmation-panel',
        'save-shopping-cart',
        'hardware-panel',
        'soc-panel',
        'debitor-panel',
        'shipment-panel',
        'activation-flow',

        'sub-update-info'
      )
    );
  }
}
