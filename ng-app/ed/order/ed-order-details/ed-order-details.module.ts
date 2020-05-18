import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrPipesModule} from '../../../sncr-components/sncr-pipes/sncr-pipes.module';
import {OrderModule} from '../../../fixednet/order/order.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {edOrderDetailsRouting} from './ed-order-details.routing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {LandingPageService} from '../order-manager/landing-page/landing-page.service';
import {EDOrderDetailsService} from './ed-order-details.service';
import {EDOrderDetailsComponent} from './ed-order-details.component';
import {NgxFileDropModule} from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    edOrderDetailsRouting,
    SncrNotificationModule,
    SncrControlsModule,
    FormsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrDatatableModule,
    SncrLoaderModule,
    SncrPipesModule,
    NgxFileDropModule,
    OrderModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    EDOrderDetailsComponent
  ],
  providers: [EDOrderDetailsService, LandingPageService]
})
export class EDOrderDetailsModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager', 'default-data-table',
      'common'));
  }
}
