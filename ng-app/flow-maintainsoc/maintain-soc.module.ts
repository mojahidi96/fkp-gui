import {LOCALE_ID, NgModule} from '@angular/core';
import {MaintainSocComponent} from './maintain-soc.component';
import {SubscriberSelectionService} from '../subscribers-selection/subscriber-selection.service';
import {MaintainSocRouting} from './maintain-soc.routing';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {ColumnsResolver} from '../subscribers-selection/columns-resolver.service';
import {SubscribersResolver} from '../subscribers-selection/subscribers-resolver.service';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {MaintainSocService} from './maintain-soc.service';
import {ManagementSocComponent} from '../management-soc/management-soc.component';
import {ManagementSocService} from '../management-soc/management-soc.service';
import {SubscriberSelectionModule} from '../subscribers-selection/subscriber-selection.module';
import {OrderReviewComponent} from './order-review/order-review.component';
import {SncrPlannedChangesModule} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.module';
import {MaSocOrderReviewService} from './order-review/order-review.service';
import {RoundPipe} from './order-review/round.pipe';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {UserRolesResolver} from './roles-resolver.service';
import {RolesService} from './roles.service';
import {ClientOrderDetailsModule} from '../client-order-details/client-order-details.module';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {UploadChangesService} from '../upload-changes/upload-changes.service';
import {ShoppingCartResolver} from '../shopping-cart/shopping-cart-resolver.service';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {TranslationModule} from 'angular-l10n';
import {DeleteShoppingCartModule} from '../delete-shopping-cart/delete-shopping-cart.module';
import {SaveShoppingCartModule} from '../save-shopping-cart/save-shopping-cart.module';
import {SncrStickyModule} from '../sncr-components/sncr-sticky/sncr-sticky.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    MaintainSocRouting,
    SncrCardSelectionModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrFlowModule,
    RouterModule,
    OrderConfirmationModule,
    DeleteShoppingCartModule,
    SubscriberSelectionModule,
    SncrNotificationModule,
    SncrLoaderModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    ClientOrderDetailsModule,
    SncrPlannedChangesModule,
    SaveShoppingCartModule,
    SncrStickyModule
  ],
  declarations: [
    MaintainSocComponent,
    ManagementSocComponent,
    OrderReviewComponent,
    RoundPipe
  ],
  providers: [
    ShoppingCartResolver,
    ColumnsResolver,
    SubscribersResolver,
    ManagementSocService,
    UserRolesResolver,
    RolesService,
    SubscriberSelectionService,
    MaSocOrderReviewService,
    MaintainSocService,
    UploadChangesService,
    ShoppingCartService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})
export class MaintainSocModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table', 'shopping-cart', 'maintain-soc',
      'save-shopping-cart', 'selection-panel', 'soc-panel', 'order-review-panel', 'order-confirmation-panel'));
  }
}
