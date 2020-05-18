import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {ButtonModule} from '../../../sncr-components/sncr-controls/button/button.module';
import {CheckGroupModule} from '../../../sncr-components/sncr-controls/check-group/check-group.module';
import {InputModule} from '../../../sncr-components/sncr-controls/input/input.module';
import {RadioModule} from '../../../sncr-components/sncr-controls/radio/radio.module';
import {SelectModule} from '../../../sncr-components/sncr-controls/select/select.module';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrCheckboxModule} from '../../../sncr-components/sncr-controls/checkbox/sncr-checkbox.module';
import {SncrCommonsModule} from '../../../sncr-components/sncr-commons/sncr-commons.module';
import {CreateEditAddressComponent} from './create-edit-address.component';
import {CreateEditAddressService} from './create-edit-address.service';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    ButtonModule,
    CheckGroupModule,
    InputModule,
    RadioModule,
    SelectModule,
    SncrNotificationModule,
    SncrCheckboxModule,
    SncrCommonsModule
  ],
  declarations: [CreateEditAddressComponent],
  exports: [CreateEditAddressComponent],
  providers: [CreateEditAddressService]
})
export class CreateEditAddressModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'address-selection-bundle'
      )
    );
  }
}
