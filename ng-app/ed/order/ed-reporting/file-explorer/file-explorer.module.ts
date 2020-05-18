import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslationModule} from 'angular-l10n';
import {NgxFileDropModule} from 'ngx-file-drop';
import {NewFolderDialogComponent} from './modals/new-folder-dialog/new-folder-dialog.component';
import {RenameDialogComponent} from './modals/rename-dialog/rename-dialog.component';
import {FileExplorerComponent} from './file-explorer.component';
import {UploadChangesModule} from '../../../../upload-changes/upload-changes.module';
import {SncrLoaderModule} from '../../../../sncr-components/sncr-loader/sncr-loader.module';
import {DeleteConfirmationDialogComponent} from './modals/delete-confirmation-dialog/delete-confirmation-dialog.component';
import {SncrNotificationModule} from '../../../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrControlsModule} from '../../../../sncr-components/sncr-controls/sncr-controls.module';
import {SncrTranslateService} from '../../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../../sncr-components/sncr-commons/translations-guids.service';
import {MoveFolderDialogComponent} from './modals/move-folder-dialog/move-folder-dialog.component';
import {SncrDatatableModule} from '../../../../sncr-components/sncr-datatable/sncr-datatable.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UploadChangesModule,
    SncrLoaderModule,
    NgxFileDropModule,
    SncrControlsModule,
    SncrNotificationModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrDatatableModule
  ],
  declarations: [
    FileExplorerComponent,
    NewFolderDialogComponent,
    DeleteConfirmationDialogComponent,
    RenameDialogComponent,
    MoveFolderDialogComponent
  ],
  exports: [FileExplorerComponent],
  entryComponents: [
    NewFolderDialogComponent,
    RenameDialogComponent,
    DeleteConfirmationDialogComponent,
    MoveFolderDialogComponent
  ]
})
export class FileExplorerModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager',
      'common', 'default-data-table'));
  }
}
