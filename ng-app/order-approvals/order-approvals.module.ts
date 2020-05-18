/**
 * Created by bhav0001 on 06-Jul-17.
 */
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {OrderApprovalsComponent} from './order-approvals.component';
import {OrderApprovalsRouting} from './order-approvals.routing';
import {OrderApprovalsService} from './order-approvals.service';
import {OrderDetailsModule} from '../fixednet/common/order-details/order-details.module';
import {FixednetResolver} from '../fixednet/fixednet.resolver';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    FormsModule,
    SncrControlsModule,
    SncrDatatableModule,
    CommonModule,
    NgbModule,
    SncrLoaderModule,
    SncrNotificationModule,
    OrderApprovalsRouting,
    OrderDetailsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderApprovalsComponent
  ],
  providers: [
    FixednetResolver,
    PatternResolverService,
    OrderApprovalsService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]

})

export class OrderApprovalsModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('default-data-table', 'order-approvals-page'));
  }

}