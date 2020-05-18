import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TranslationModule} from 'angular-l10n';

import {ButtonModule} from '../../sncr-components/sncr-controls/button/button.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrDisplayAddressModule} from '../../sncr-components/sncr-display-address/sncr-display-address.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {ShipmentSelectionComponent} from './shipment-selection.component';
import {ShipmentSelectionService} from './shipment-selection.service';
import {CreateEditAddressModule} from '../address-selection/create-edit-address/create-edit-address.module';
import {SvgIconModule} from '../../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    TranslationModule,
    CreateEditAddressModule,
    ButtonModule,
    SncrNotificationModule,
    SncrDatatableModule,
    SncrDisplayAddressModule,
    SncrLoaderModule,
    SvgIconModule
  ],
  declarations: [ShipmentSelectionComponent],
  exports: [ShipmentSelectionComponent],
  providers: [ShipmentSelectionService]
})
export class ShipmentSelectionModule {}
