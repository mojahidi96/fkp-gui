import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataSelectionService} from '../../data-selection/data-selection.service';
import {OrderApprovalsComponent} from './order-approvals.component';
import {OrderApprovalsRouting} from './order-approvals.routing';
import {OrderCommonModule} from '../order-commons/order-common.module';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {OrderApprovalsDataResolver} from './order-approvals-data.resolver';
import {OrderApprovalsAcommentsResolver} from './order-approvals-acomments.resolver';
import {OrderApprovalsService} from './order-approvals.service';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    OrderApprovalsRouting,
    NgbModule,
    OrderCommonModule,
    SncrControlsModule,
    SncrNotificationModule,
    SncrLoaderModule,
    SncrDatatableModule
  ],
  declarations: [
    OrderApprovalsComponent
  ],
  providers: [
    NgbActiveModal,
    OrderApprovalsService,
    OrderApprovalsDataResolver,
    OrderApprovalsAcommentsResolver,
    DataSelectionService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ]

})

export class OrderApprovalsModule {

}
