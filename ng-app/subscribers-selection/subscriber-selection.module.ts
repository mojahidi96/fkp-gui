import {NgModule} from '@angular/core';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {CommonModule} from '@angular/common';
import {SubscriberSelectionComponent} from './subscriber-selection.component';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {FormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {SncrDownloadSelectionsModule} from '../sncr-components/sncr-download-selections/sncr-download-selections.module';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';
import {NgxFileDropModule} from 'ngx-file-drop';

@NgModule({
  declarations: [
    SubscriberSelectionComponent
  ],
  imports: [
    CommonModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrNotificationModule,
    FormsModule,
    TranslationModule,
    SncrDownloadSelectionsModule,
    NgxFileDropModule,
    SvgIconModule
  ],
  exports: [SubscriberSelectionComponent]
})
export class SubscriberSelectionModule {

}
