import {NgModule} from '@angular/core';
import {SubscriberSelectionService} from '../subscribers-selection/subscriber-selection.service';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {NgbButtonsModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SubscriberSelectionModule} from '../subscribers-selection/subscriber-selection.module';
import {SubUpdateInfoRouting} from './sub-update-info.routing';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SubUpdateInfoComponent} from './sub-update-info.component';
import {UserRolesResolver} from '../flow-maintainsoc/roles-resolver.service';
import {SubscribersResolver} from '../subscribers-selection/subscribers-resolver.service';
import {DynamicSharedService} from '../fixednet/order/dynamic-panels/dynamic-shared.service';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {SubUpdateInfoService} from './sub-update-info.service';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {ClientOrderDetailsModule} from '../client-order-details/client-order-details.module';
import {RolesService} from '../flow-maintainsoc/roles.service';
import {BulkEditModule} from '../orderflow-bulk-edits/bulk-edit.module';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {UploadChangesModule} from '../upload-changes/upload-changes.module';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {DeleteShoppingCartModule} from '../delete-shopping-cart/delete-shopping-cart.module';
import {SaveShoppingCartModule} from '../save-shopping-cart/save-shopping-cart.module';
import {SubManagementModule} from '../sub-management/sub-management.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    SubUpdateInfoRouting,
    SncrControlsModule,
    SncrDatatableModule,
    SncrFlowModule,
    RouterModule,
    SubscriberSelectionModule,
    SncrNotificationModule,
    ClientOrderDetailsModule,
    SncrLoaderModule,
    OrderConfirmationModule,
    BulkEditModule,
    UploadChangesModule,
    DeleteShoppingCartModule,
    SaveShoppingCartModule,
    SubManagementModule,
    NgbModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    SubUpdateInfoComponent
  ],
  providers: [
    SubscribersResolver,
    SubscriberSelectionService,
    DynamicSharedService,
    UserRolesResolver,
    RolesService,
    DataSelectionService,
    SubUpdateInfoService,
    ColumnsResolver,
    LazyCountResolver,
    PatternResolverService,
    CountriesResolverService,
    ShoppingCartService
  ],

})
export class SubUpdateInfoModule {

  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table',
      'default-column-headers', 'sub-update-info', 'shopping-cart', 'save-shopping-cart',
      'selection-panel', 'order-review-panel',  'order-confirmation-panel'));
  }
}
