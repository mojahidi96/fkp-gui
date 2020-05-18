import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OrderCommonComponent} from './order-common.component';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {CommentsHistoryComponent} from './comments-history/comments-history.component';
import {OmDetailComponent} from './om-detail/om-detail.component';
import {OmDetailService} from './om-detail/om-detail.service';
import {ShipmentTrackingComponent} from './shipment-tracking/shipment-tracking.component';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {TranslationModule} from 'angular-l10n';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {ShipTrackService} from './shipment-tracking/ship.track.service';
import {SubscriberDetailsComponent} from './subscriber-details/subscriber-details.component';
import {DebitorSelectionModule} from '../../flow-sections/debitor-selection/debitor-selection.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {CreateEditAddressModule} from '../../flow-sections/address-selection/create-edit-address/create-edit-address.module';

@NgModule({
  imports: [
    CreateEditAddressModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgbModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrLoaderModule,
    TranslationModule,
    DebitorSelectionModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
  ],
  declarations: [
    CommentsHistoryComponent,
    OmDetailComponent,
    OrderCommonComponent,
    ShipmentTrackingComponent,
    SubscriberDetailsComponent
  ],
  exports: [
    CommentsHistoryComponent,
    OmDetailComponent,
    OrderCommonComponent,
    ShipmentTrackingComponent,
    SubscriberDetailsComponent
  ],
  providers: [
    OmDetailService,
    ShipTrackService,
  ]

})

export class OrderCommonModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids(
      'order-details-common',
      'order-review-panel'));
  }
}
