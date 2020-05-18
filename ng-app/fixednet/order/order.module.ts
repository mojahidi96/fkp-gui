import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbButtonsModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrderComponent} from './order.component';
import {OrderRouting} from './order.routing';
import {OrderService} from './order.service';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {DataEntryComponent} from './data-entry/data-entry.component';
import {DynamicPanelsComponent} from './dynamic-panels/dynamic-panels.component';
import {DynamicFieldsComponent} from './dynamic-panels/dynamic-fields.component';
import {ProductLocationComponent} from './product-location/product-location.component';
import {ProductLocationService} from './product-location/product-location.service';
import {BandwidthFilterPipe} from './product-location/product-location.filter.pipe';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {DataEntryService} from './data-entry/data-entry.service';
import {LoaderModule} from '../common/loader/loader.module';
import {ConfirmationTabComponent} from './confirmation-tab/confirmation-tab.component';
import {CustomerSelectionComponent} from './customer-selection/customer-selection.component';
import {DynamicSharedService} from './dynamic-panels/dynamic-shared.service';
import {FieldSwitchComponent} from './dynamic-panels/field-switch.component';
import {ClickStopPropagationDirective} from '../common/directive/click-stop-propagation-directive';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';


@NgModule({
  declarations: [
    ConfirmationTabComponent,
    DataEntryComponent,
    DynamicFieldsComponent,
    DynamicPanelsComponent,
    FieldSwitchComponent,
    ProductLocationComponent,
    OrderComponent,
    BandwidthFilterPipe,
    CustomerSelectionComponent,
    ClickStopPropagationDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbButtonsModule,
    SncrNotificationModule,
    SncrControlsModule,
    SncrDatatableModule,
    ReactiveFormsModule,
    RouterModule,
    OrderRouting,
    SncrLoaderModule,
    LoaderModule
  ],
  exports: [
    DynamicFieldsComponent,
    DynamicPanelsComponent
  ],
  providers: [OrderService, ProductLocationService, DataEntryService, DynamicSharedService]
})
export class OrderModule {

  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('fixednet', 'default-data-table'));
  }
}