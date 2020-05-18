import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbButtonsModule, NgbModalModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {TranslationModule} from 'angular-l10n';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {OmDetailService} from '../order-components/order-commons/om-detail/om-detail.service';
import {OrderManagerResolver} from './order-manager.resolver';
import {OrderManagerRouting} from './order-manager.route';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {OrderManagerComponent} from './order-manager.component';
import {KiasActivityComponent} from './kias-activity/kias-activity.component';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SystemHistoryComponent} from './system-history/system-history.component';
import {OrderBulkEditComponent} from './order-bulk-edit/order-bulk-edit.component';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {BulkEditContentComponent} from './order-bulk-edit/bulk-edit-content.component';
import {OrderCommonModule} from '../order-components/order-commons/order-common.module';
import {BulkEditContentService} from './order-bulk-edit/bulk-edit-content.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {CreateEditAddressModule} from '../flow-sections/address-selection/create-edit-address/create-edit-address.module';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CreateEditAddressModule,
    ReactiveFormsModule,
    CommonModule,
    OrderManagerRouting,
    FormsModule,
    NgbAccordionModule,
    NgbButtonsModule,
    NgbModalModule,
    NgbTabsetModule,
    SncrNotificationModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrLoaderModule,
    TranslationModule,
    OrderCommonModule,
    SvgIconModule
  ],
  declarations: [
    BulkEditContentComponent,
    KiasActivityComponent,
    OrderBulkEditComponent,
    OrderManagerComponent,
    SystemHistoryComponent
  ],
  providers: [
    CountriesResolverService,
    PatternResolverService,
    OrderManagerResolver,
    OmDetailService,
    BulkEditContentService
  ]
})
export class OrderManagerModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('common',
        'default-column-headers',
        'default-data-table',
        'address-selection-bundle',
        'order-details-common',
        'debitor-panel',
        'shipment-panel',
        'order-review-panel')
    );
  }
}
