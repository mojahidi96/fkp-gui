import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../../sncr-components/sncr-loader/sncr-loader.module';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageRouting} from './landing-page.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LandingPageService} from './landing-page.service';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ColumnsResolver} from '../../../data-selection/columns-resolver.service';
import {DataSelectionService} from '../../../data-selection/data-selection.service';
import {TranslationModule} from 'angular-l10n';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {NgxsModule} from '@ngxs/store';
import {OrderDetailsComponent} from '../order-details/order-details.component';
import {OrderModule} from '../../order/order.module';
import {OrderDetailsService} from '../order-details/order-details.service';
import {OrderManagerState} from './landing-page-store/landing-page-orders.store';
import {SncrPipesModule} from '../../../sncr-components/sncr-pipes/sncr-pipes.module';

@NgModule({
  declarations: [
    LandingPageComponent,
    OrderDetailsComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    SncrControlsModule,
    SncrDatatableModule,
    NgxsModule.forFeature([OrderManagerState]),
    LandingPageRouting,
    SncrLoaderModule,
    ReactiveFormsModule,
    SncrLoaderModule,
    SncrNotificationModule,
    NgbModule,
    OrderModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrPipesModule
  ],
  providers: [
    LandingPageService,
    ColumnsResolver,
    OrderDetailsService,
    DataSelectionService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})

export class LandingPageModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('default-column-headers', 'default-data-table', 'fixednet-order-manager',
      'common'));
  }
}