import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileElement } from '../../model/file-element';
import { FileService } from '../../../service/file-explorer.service';
import { NotificationHandlerService } from '../../../../../../sncr-components/sncr-notification/notification-handler.service';


@Component({
  selector: 'ed-reporting-move-folder-dialog',
  templateUrl: './move-folder-dialog.component.html',
  styleUrls: ['./move-folder-dialog.component.scss']
})
export class MoveFolderDialogComponent implements OnInit {
  @Input() folderToMove: FileElement;
  folderList: FileElement[];
  duplicateName: boolean;
  targetFolder: any;
  oldName: string;
  isLoading: boolean;
  noFolders: boolean;
  presentFolder: FileElement;
  newPath: string;
  showMoveToRoot: boolean;
  rootElement = {
    id: 'root',
    folder: true,
    fileName: '',
    createdBy: '',
    createdTs: '',
    parentId: '',
    fileType: ''
  };
  navigationHistory: FileElement[];
  notifyError: NotificationHandlerService = new NotificationHandlerService();

  constructor(public activeModal: NgbActiveModal, private fileService: FileService) {
  }

  ngOnInit() {
    this.duplicateName = false;
    this.goHome();
    this.notifyError.clearNotification();
  }

  goHome() {
    this.notifyError.clearNotification();
    this.presentFolder = this.rootElement;
    this.getFolderList(this.rootElement, true);
  }

  goBack() {
    this.notifyError.clearNotification();
    let navigationElement = this.navigationHistory.length >= 2 ?
      this.navigationHistory[(this.navigationHistory.length - 2)] : this.rootElement;
    this.navigate(navigationElement, true);
  }

  isRoot() {
    let isRoot = !this.presentFolder || this.presentFolder && this.presentFolder.id === 'root';
    return isRoot;
  }

  getFolderList(element: FileElement, goingBack: boolean) {
    this.isLoading = true;
    this.noFolders = false;
    let inEmptyFolder = false;
    this.fileService.retrieveDir(element.id).then(res => {
      if (res.status) {
        this.presentFolder = element;
        if (element.id === 'root') {
          this.newPath = '/';
          this.navigationHistory = [];
        } else {
          if (goingBack) {
            this.newPath = this.popFromPath(this.newPath);
            this.navigationHistory.splice(-1, 1);
          } else {
            this.newPath = this.newPath + this.presentFolder.fileName + '/';
            this.navigationHistory.push(element);
          }
        }
        if (res.uploadDetails.length > 0) {
          this.folderList = [];
          res.uploadDetails.forEach((fileElement, fileIndex) => {
            if (fileElement.folder) {
              inEmptyFolder = true;
              this.folderList.push(fileElement);
            }
            if (fileIndex === (res.uploadDetails.length - 1)) {
              this.noFolders = !inEmptyFolder;
              this.isLoading = false;
            }
          });
        } else {
          this.noFolders = true;
          this.isLoading = false;
        }
      } else {
        this.folderList = [];
        let errMsg = 'ED_DRIVE_ERROR_INFO';
        this.printError(errMsg);
      }
    })
  }

  navigate(element: FileElement, goingBack: boolean) {
    this.notifyError.clearNotification();
    this.targetFolder = null;
    this.getFolderList(element, goingBack);
  }

  makeTargetFolder(element: FileElement) {
    if (this.targetFolder && element.id === this.targetFolder.id) {
      this.targetFolder = null;
    } else {
      this.targetFolder = element;
    }
  }

  moveToTarget() {
    this.activeModal.close({
      'element': this.folderToMove,
      'targetFolder': this.targetFolder,
      'newPath': `${this.newPath}${this.targetFolder.fileName}`
    });
  }

  printError(err: any) {
    this.isLoading = false;
    this.notifyError.printErrorNotification(err);
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
