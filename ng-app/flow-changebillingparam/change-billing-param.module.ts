import {NgModule} from '@angular/core';
import {ChangeBillingParamComponent} from './change-billing-param.component';
import {ManageItemizedComponent} from './manage-itemized/manage-itemized.component';
import {OrderCompleteComponent} from './order-complete/order-complete.component';
import {OrderReviewComponent} from './order-review/order-review.component';
import {ChangeBillingParamRouting} from './change-billing-param.routing';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {OrderReviewService} from './order-review/order-review.service';
import {ChangeBillingParamService} from './change-billing-param.service';
import {SubscriberSelectionModule} from '../subscribers-selection/subscriber-selection.module';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {ManageItemizedService} from './manage-itemized/manage-itemized.service';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SubscriberSelectionService} from '../subscribers-selection/subscriber-selection.service';
import {UploadChangesService} from '../upload-changes/upload-changes.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbButtonsModule,
    ChangeBillingParamRouting,
    SncrCardSelectionModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrFlowModule,
    RouterModule,
    OrderConfirmationModule,
    SubscriberSelectionModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrLoaderModule
  ],
  declarations: [
    ChangeBillingParamComponent,
    ManageItemizedComponent,
    OrderCompleteComponent,
    OrderReviewComponent
  ],
  providers: [
    DataSelectionService,
    ColumnsResolver,
    SubscriberSelectionService,
    OrderReviewService,
    ChangeBillingParamService,
    LazyCountResolver,
    ManageItemizedService,
    UploadChangesService
  ]
})
export class ChangeBillingParamModule {

  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-column-headers', 'default-data-table',
      'change-bill-param-info', 'selection-panel', 'order-confirmation-panel'));
  }
}
