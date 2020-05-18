import {NgModule} from '@angular/core';
import {DebitorSelectionService} from './debitor-selection.service';
import {DebitorSelectionComponent} from './debitor-selection.component';
import {SncrNotificationModule} from '../../sncr-components/sncr-notification/sncr-notification.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {SncrDatatableModule} from '../../sncr-components/sncr-datatable/sncr-datatable.module';
import {SncrLoaderModule} from '../../sncr-components/sncr-loader/sncr-loader.module';
import {CreateEditAddressModule} from '../address-selection/create-edit-address/create-edit-address.module';
import {SvgIconModule} from '../../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CreateEditAddressModule,
    FormsModule,
    CommonModule,
    NgbModule,
    SncrControlsModule,
    SncrNotificationModule,
    SncrDatatableModule,
    SncrLoaderModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SvgIconModule
  ],
  declarations: [DebitorSelectionComponent],
  exports: [DebitorSelectionComponent],
  providers: [DebitorSelectionService]
})
export class DebitorSelectionModule {}
