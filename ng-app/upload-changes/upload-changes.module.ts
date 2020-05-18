import {FormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {NgxFileDropModule} from 'ngx-file-drop';
import {NgModule} from '@angular/core';
import {UploadChangesComponent} from './upload-changes.component';
import {CommonModule} from '@angular/common';
import {UploadChangesService} from './upload-changes.service';
import {SncrDownloadSelectionsModule} from '../sncr-components/sncr-download-selections/sncr-download-selections.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SvgIconModule} from '../sncr-components/svg-icon/svg-icon.module';

@NgModule({
  declarations: [UploadChangesComponent],
  imports: [
    CommonModule,
    SncrControlsModule,
    FormsModule,
    NgxFileDropModule,
    TranslationModule,
    SncrDownloadSelectionsModule,
    SncrNotificationModule,
    SncrLoaderModule,
    SncrDatatableModule,
    SvgIconModule
  ],
  exports: [UploadChangesComponent],
  providers: [UploadChangesService]
})
export class UploadChangesModule { }
