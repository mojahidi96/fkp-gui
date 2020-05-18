import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {CreateShopComponent} from './create-shop.component';
import {createShopRouting} from './create-shop.routing';
import {CommonModule} from '@angular/common';
import {CreateShopService} from './create-shop.service';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {FnCommonService} from '../common/fncommon.service';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SncrControlsModule,
    createShopRouting,
    SncrLoaderModule,
    SncrNotificationModule,
  ],
  declarations: [
    CreateShopComponent,
  ],
  providers: [CreateShopService, FnCommonService]
})
export class CreateShopModule {

}
