import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {EditShopComponent} from './edit-shop.component';
import {editShopRouting} from './edit-shop.routing';
import {EditShopService} from './edit-shop.service';
import {CommonModule} from '@angular/common';
import {ShopListComponent} from './shop-list/shop-list.component';
import {ShopListService} from './shop-list/shop-list.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FnCommonService} from '../common/fncommon.service';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
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
    TranslationModule
  ],
  declarations: [
    ShopListComponent,
    EditShopComponent
  ],
  providers: [EditShopService, ShopListService, FnCommonService]
})
export class EditShopModule {

  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('fixednet', 'default-data-table', 'fixednet-shop'));
  }
}
