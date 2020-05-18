import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Language, TranslationService} from 'angular-l10n';
import {FileService} from '../../../service/file-explorer.service';

@Component({
  selector: 'ed-reporting-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['../dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {
  @Language() lang: string;
  @Input() folderName: string;
  @Input() folderList: string[];
  elementNameError: boolean;
  elementNameErrorMessage: string;
  oldName: string;
  regex: string;

  constructor(public activeModal: NgbActiveModal,
              public fileService: FileService,
              public translation: TranslationService) {
  }

  ngOnInit() {
    this.elementNameError = false;
    this.oldName = this.folderName;
    this.regex = this.translation.translate('ED_DRIVE_FILENAME_REGEX');
  }

  clickOk() {
    if (this.folderList.includes(this.folderName.trim().toUpperCase())
      || this.folderName.trim().toUpperCase() === this.oldName.trim().toUpperCase()) {
      this.elementNameError = true;
      this.elementNameErrorMessage = 'ED_DRIVE_DUPLICATE_FOLDER_NAME';
    } else if (this.fileService.checkSpecialCharacters(this.folderName, this.regex)) {
      this.elementNameError = true;
      this.elementNameErrorMessage = 'ED_DRIVE_INVALID_FOLDER_NAME_SC';
    } else {
      this.activeModal.close({'folderName': this.folderName, 'oldName': this.oldName});
    }
  }
}
