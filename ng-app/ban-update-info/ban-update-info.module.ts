import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {BanUpdateInfoRouting} from './ban-update-info.routing';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrFlowModule} from '../sncr-components/sncr-flow/sncr-flow.module';
import {RouterModule} from '@angular/router';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {BanUpdateInfoComponent} from './ban-update-info.component';
import {BanSelectionComponent} from './ban-selection/ban-selection.component';
import {BanUpdateInfoService} from './ban-update-info.service';
import {ColumnsResolver} from '../data-selection/columns-resolver.service';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {BanManagementComponent} from './ban-management/ban-management.component';
import {BanManagementReviewComponent} from './ban-management-review/ban-management-review.component';
import {OrderConfirmationModule} from '../order-confirm/order-confirmation.module';
import {ClientOrderDetailsModule} from '../client-order-details/client-order-details.module';
import {UserRolesResolver} from '../flow-maintainsoc/roles-resolver.service';
import {RolesService} from '../flow-maintainsoc/roles.service';
import {BulkEditModule} from '../orderflow-bulk-edits/bulk-edit.module';
import {CountriesResolverService} from '../ban-sub-common/countries-resolver.service';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {LazyCountResolver} from '../subscribers-selection/lazy-count.resolver';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {SncrDownloadSelectionsModule} from '../sncr-components/sncr-download-selections/sncr-download-selections.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    BanUpdateInfoRouting,
    SncrControlsModule,
    SncrDatatableModule,
    SncrFlowModule,
    RouterModule,
    SncrLoaderModule,
    SncrNotificationModule,
    OrderConfirmationModule,
    ClientOrderDetailsModule,
    BulkEditModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrDownloadSelectionsModule
  ],
  declarations: [
    BanUpdateInfoComponent,
    BanSelectionComponent,
    BanManagementComponent,
    BanManagementReviewComponent
  ],
  providers: [
    DataSelectionService,
    ColumnsResolver,
    BanUpdateInfoService,
    UserRolesResolver,
    RolesService,
    CountriesResolverService,
    PatternResolverService,
    LazyCountResolver,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})
export class BanUpdateInfoModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table', 'default-column-headers',
      'ban-update-info',  'selection-panel', 'order-review-panel', 'order-confirmation-panel'));
  }
}
