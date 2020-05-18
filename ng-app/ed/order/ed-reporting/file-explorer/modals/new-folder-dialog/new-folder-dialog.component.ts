import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Language, TranslationService} from 'angular-l10n';
import {FileService} from '../../../service/file-explorer.service';

@Component({
  selector: 'ed-reporting-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['../dialog.component.scss']
})
export class NewFolderDialogComponent implements OnInit {
  @Language() lang: string;
  @Input() folderList: string[];
  folderName: string;
  elementNameError: boolean;
  elementNameErrorMessage: string;
  regex: string;

  constructor(public activeModal: NgbActiveModal,
              public fileService: FileService,
              public translation: TranslationService) {
  }

  ngOnInit() {
    this.elementNameError = false;
    this.regex = this.translation.translate('ED_DRIVE_FILENAME_REGEX');
  }

  createFolder() {
    if (this.folderList.includes(this.folderName.trim().toUpperCase())) {
      this.elementNameError = true;
      this.elementNameErrorMessage = 'ED_DRIVE_DUPLICATE_FOLDER_NAME';
    } else if (this.fileService.checkSpecialCharacters(this.folderName, this.regex)) {
      this.elementNameError = true;
      this.elementNameErrorMessage = 'ED_DRIVE_INVALID_FOLDER_NAME_SC';
    } else {
      this.activeModal.close(this.folderName);
    }
  }
}
