import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {VvlFlowRouting} from './vvl-flow.route';
import {VvlFlowComponent} from './vvl-flow.component';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SubscriberSelectionModule} from '../subscribers-selection/subscriber-selection.module';
import {TranslationModule} from 'angular-l10n';
import {NgxsModule} from '@ngxs/store';
import {VvlFlowSubscribersState} from './vvl-store/vvl-flow-subscribers.store';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';
import {
  NgbButtonsModule,
  NgbCarouselModule,
  NgbTabsetModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrPlannedChangesModule} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.module';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {VvlFlowSubscribersService} from './vvl-store/vvl-flow-subscribers.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SncrMultiSelectModule} from '../sncr-components/sncr-multi-select/sncr-multi-select.module';
import {ClientOrderDetailsModule} from '../client-order-details/client-order-details.module';
import {SncrSliderModule} from '../sncr-components/sncr-slider/sncr-slider.module';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {RolesService} from '../flow-maintainsoc/roles.service';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {OrderOverviewModule} from '../flow-sections/order-overview/order-overview.module';
import {ArticleSelectionModule} from '../flow-sections/article-selection/article-selection.module';
import {DebitorSelectionModule} from '../flow-sections/debitor-selection/debitor-selection.module';
import {SncrDisplayAddressModule} from '../sncr-components/sncr-display-address/sncr-display-address.module';
import {ShipmentSelectionModule} from '../flow-sections/shipment-selection/shipment-selection.module';
import {SocSelectionModule} from '../flow-sections/soc-selection/soc-selection.module';
import {TariffgridSelectionModule} from '../flow-sections/tariff-selection/tariffgrid-selection.module';
import {SaveShoppingCartModule} from '../save-shopping-cart/save-shopping-cart.module';
import {OrderReviewModule} from '../flow-sections/order-review/order-review.module';
import {CreateEditAddressModule} from '../flow-sections/address-selection/create-edit-address/create-edit-address.module';
import {SncrFileDropModule} from '../sncr-components/sncr-file-drop/sncr-file-drop.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([
      VvlFlowSubscribersState,
    ]),
    SncrDatatableModule,
    NgbButtonsModule,
    SncrControlsModule,
    SncrNotificationModule,
    SncrFlowModule,
    SubscriberSelectionModule,
    SncrPlannedChangesModule,
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
    VvlFlowRouting,
    CreateEditAddressModule,
    NgbTooltipModule,
    SncrDisplayAddressModule,
    ArticleSelectionModule,
    DebitorSelectionModule,
    ShipmentSelectionModule,
    SocSelectionModule,
    TariffgridSelectionModule,
    SaveShoppingCartModule,
    OrderReviewModule,
    SncrFileDropModule,
    SvgIconModule
  ],
  declarations: [VvlFlowComponent],
  providers: [
    VvlFlowSubscribersService,
    RolesService,
    CountriesResolverService,
    PatternResolverService
  ]
})
export class VvlFlowModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'default-column-headers',
        'default-data-table',
        'vvl-flow',
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
        'sncr-file-drop',
        'esim-manager'
      )
    );
  }
}
