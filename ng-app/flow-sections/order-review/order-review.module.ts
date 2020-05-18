import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslationModule} from 'angular-l10n';
import {ClientOrderDetailsModule} from '../../client-order-details/client-order-details.module';
import {OrderOverviewModule} from '../order-overview/order-overview.module';
import {SaveShoppingCartModule} from '../../save-shopping-cart/save-shopping-cart.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {OrderReviewComponent} from './order-review.component';
import {OrderReviewService} from './order-review.service';
import {ShoppingCartService} from '../../shopping-cart/shopping-cart.service';
import {DeleteShoppingCartModule} from '../../delete-shopping-cart/delete-shopping-cart.module';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

@NgModule({
  imports: [
    CommonModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrNotificationModule,
    ClientOrderDetailsModule,
    OrderOverviewModule,
    SaveShoppingCartModule,
    SncrControlsModule,
    SncrLoaderModule,
    DeleteShoppingCartModule
  ],
  declarations: [
    OrderReviewComponent
  ],
  exports: [
    OrderReviewComponent
  ],
  providers: [
    OrderReviewService,
    ShoppingCartService
  ]
})
export class OrderReviewModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'save-shopping-cart'
      )
    );
  }
 }
