import {NgModule} from '@angular/core';
import {EditShopComponent} from './edit-shop.component';
import {ShopListComponent} from './shop-list/shop-list.component';
import {editShopRouting} from './edit-shop.routing';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {ShopListService} from './shop-list/shop-list.service';
import {EDService} from '../ed.service';
import {EDOrderDetailsService} from '../order/ed-order-details/ed-order-details.service';
import {EditShopService} from './edit-shop.service';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    FormsModule,
    SncrControlsModule,
    editShopRouting,
    SncrDatatableModule,
    CommonModule,
    NgbModule,
    SncrLoaderModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    ShopListComponent,
    EditShopComponent
  ],
  providers: [ShopListService, EDService, EDOrderDetailsService, EditShopService]
})
export class EditShopModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-shop', 'default-data-table'));
  }
}
