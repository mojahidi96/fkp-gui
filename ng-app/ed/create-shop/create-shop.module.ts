import {NgModule} from '@angular/core';
import {CreateShopComponent} from './create-shop.component';
import {createShopRouting} from './create-shop.routing';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {TranslationModule} from 'angular-l10n';
import {SncrPipesModule} from '../../sncr-components/sncr-pipes/sncr-pipes.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {CreateShopService} from './create-shop.service';
import {EDService} from '../ed.service';
import {EDOrderDetailsService} from '../order/ed-order-details/ed-order-details.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SncrControlsModule,
    createShopRouting,
    SncrLoaderModule,
    SncrNotificationModule,
    TranslationModule,
    SncrPipesModule
  ],
  declarations: [
    CreateShopComponent
  ],
  providers: [CreateShopService, EDService, EDOrderDetailsService]
})
export class CreateShopModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-shop', 'default-data-table'));
  }
}
