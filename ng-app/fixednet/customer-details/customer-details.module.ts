import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbButtonsModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {FormsModule} from '@angular/forms';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {CustomerDetailsComponent} from './customer-details.component';
import {CustomerDetailsRouting} from './customer-details.routing';
import {CustomerDetailsService} from './customer-details.service';
import {ShopSelectionComponent} from './shop-selection/shop-selection.component';
import {CustomerSelectionComponent} from './customer-selection/customer-selection.component';
import {SncrFlowModule} from '../../sncr-components/sncr-flow/sncr-flow.module';
import {ShopResolver} from './shop-selection/shop-resolver.service';
import {ShopSelectionService} from './shop-selection/shop-selection.service';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {CustomerSelctionService} from './customer-selection/customer-selection.service';
import {BillOrderProductComponent} from './bill-order-product/bill-order-product.component';
import {BillOrdProdService} from './bill-order-product/bill-order-product.service';
import {ProductDetailsComponent} from './bill-order-product/product-details/product-details.component';
import {OrderDetailsComponent} from './bill-order-product/order-details/order-details.component';
import {LoaderModule} from '../common/loader/loader.module';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

@NgModule({
  declarations: [
    CustomerDetailsComponent,
    ShopSelectionComponent,
    BillOrderProductComponent,
    CustomerSelectionComponent,
    ProductDetailsComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbButtonsModule,
    SncrControlsModule,
    SncrDatatableModule,
    RouterModule,
    CustomerDetailsRouting,
    SncrLoaderModule,
    SncrFlowModule,
    SncrNotificationModule,
    LoaderModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  providers: [
    CustomerDetailsService,
    ShopResolver,
    ShopSelectionService,
    CustomerSelctionService,
    BillOrdProdService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]
})
export class CustomerDetailsModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table', 'fixednet-customer-details'));
  }
}