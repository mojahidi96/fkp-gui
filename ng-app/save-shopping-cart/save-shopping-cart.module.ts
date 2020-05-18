import {NgModule} from '@angular/core';
import {SaveShoppingCartComponent} from './save-shopping-cart.component';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SaveShoppingCartService} from './save-shopping-cart.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    SncrControlsModule,
    ReactiveFormsModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    SaveShoppingCartComponent
  ],
  exports: [
    SaveShoppingCartComponent
  ],
  providers: [
    SaveShoppingCartService
  ]
})


export class SaveShoppingCartModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'shopping-cart', 'save-shopping-cart'));
  }
}
