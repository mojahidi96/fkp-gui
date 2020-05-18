import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {FormsModule} from '@angular/forms';
import {NgxFileDropModule} from 'ngx-file-drop';
import {TranslationModule} from 'angular-l10n';
import {SncrNotificationModule} from '../sncr-notification/sncr-notification.module';
import {SncrLoaderModule} from '../sncr-loader/sncr-loader.module';
import {SvgIconModule} from '../svg-icon/svg-icon.module';
import {SncrFileDropComponent} from './sncr-file-drop.component';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-commons/translations-guids.service';
import {SncrFileDropService} from './sncr-file-drop.service';


@NgModule({
  declarations: [SncrFileDropComponent],
  imports: [
    CommonModule,
    SncrControlsModule,
    FormsModule,
    NgxFileDropModule,
    TranslationModule,
    SncrNotificationModule,
    SncrLoaderModule,
    SvgIconModule
  ],
  exports: [SncrFileDropComponent],
  providers: [SncrFileDropService]
})
export class SncrFileDropModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'sncr-file-drop'
      )
    );
  }
}
