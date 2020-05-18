import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {TranslationService} from 'angular-l10n';
import {FileService} from './service/file-explorer.service';
import {FileElement} from './file-explorer/model/file-element';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {LandingPageService} from '../order-manager/landing-page/landing-page.service';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';

@Component({
  selector: 'ed-reporting',
  templateUrl: './ed-reporting.component.html',
  styleUrls: ['ed-reporting.component.scss'],
})

export class EDReportingComponent implements OnInit {
  public fileElements: Observable<FileElement[]>;
  notifyError: NotificationHandlerService = new NotificationHandlerService();
  loading: boolean;
  clipBoard: FileElement;
  currentRoot: FileElement;
  parentElement: FileElement;
  currentPath: string;
  canNavigateUp = false;
  supportedFiles = [
    '.ppt', '.pptx', '.xls', '.xlsx', '.doc', '.docx',
    '.pdf', '.csv', '.txt', '.xml', '.jpg', '.jpeg', '.png', '.msg'
  ];
  foldersList: string[];
  writeAccess: boolean;
  navigationHistory: FileElement[];
  rootElement = {
    id: 'root',
    folder: true,
    fileName: '',
    createdBy: '',
    createdTs: '',
    parentId: '',
    fileType: ''
  };
  noFolders: boolean;
  regex: string;
  isReadOnlyVodafoneUser: boolean;
  vodafoneAccountManager: boolean;
  isReadOnlyUser: boolean;
  vfUser: boolean;

  constructor(public fileService: FileService,
              private orderDetailsService: EDOrderDetailsService,
              private landingPageService: LandingPageService,
              public translation: TranslationService) {
  }

  ngOnInit() {
    this.checkUserRoles();
    this.foldersList = [];
    this.loading = true;
    this.notifyError.clearNotification();
  }

  addFolder(folder: { name: string }) {
    this.notifyError.clearNotification();
    this.loading = true;
    let parentId;
    let dirPath;
    if (this.currentRoot) {
      parentId = this.currentRoot.id;
      dirPath = '/' + this.currentPath;
    } else {
      parentId = 'root';
      dirPath = '/';
    }
    this.fileService.createDir(parentId, dirPath, folder.name).then(res => {
      if (!res.status) {
        this.showGenericError();
      } else {
        this.handleSuccessResponse(res);
      }
    }).catch(err => {
      this.showGenericError();
    });
  }

  removeElement(element: FileElement) {
    this.loading = true;
    this.notifyError.clearNotification();
    let parentId;
    let location;
    if (this.currentRoot) {
      parentId = this.currentRoot.id;
      location = `/${this.currentPath}${element.fileName}`;
    } else {
      parentId = 'root';
      location = `/${element.fileName}`;
    }
    this.fileService.delete(element.id, parentId, location).then(res => {
      if (!res.status) {
        this.showGenericError();
      } else {
        this.handleSuccessResponse(res);
      }
    }).catch(err => {
      this.showGenericError();
    });
  }

  navigateToFolder(element: FileElement, goingBack: boolean, moveResult: boolean) {
    this.notifyError.clearNotification();
    this.loading = true;
    this.noFolders = false;
    this.fileService.clear();
    this.fileService.retrieveDir(element.id).then(res => {
      if (!res.status) {
        this.showGenericError();
      } else {
        if (res.uploadDetails.length < 1) {
          this.noFolders = true;
        }
        this.updateDirectoryList(res.uploadDetails);
        this.parentElement = this.currentRoot;
        this.currentRoot = element;
        this.canNavigateUp = true;
        this.loading = false;
        if (element.id === 'root') {
          this.navigationHistory = [];
          this.currentPath = '';
          this.canNavigateUp = false;
        } else {
          if (!moveResult) {
            if (goingBack) {
              this.currentPath = this.popFromPath(this.currentPath);
              this.navigationHistory.splice(-1, 1);
            } else {
              this.currentPath = this.pushToPath(this.currentPath, element.fileName);
              this.navigationHistory.push(element);
            }
          }
        }
      }
      this.updateFileElementQuery();
    }).catch(err => {
      this.showGenericError();
    });
  }

  navigateUp() {
    this.notifyError.clearNotification();
    let navigationElement = this.navigationHistory.length >= 2 ?
      this.navigationHistory[(this.navigationHistory.length - 2)] : this.rootElement;
    this.navigateToFolder(navigationElement, true, false);
  }

  moveElement(res) {
    this.notifyError.clearNotification();
    this.fileService.move(res.element.id, res.targetFolder.id,
      this.currentPath ? `${this.currentPath}${res.element.fileName}` : `/${res.element.fileName}`,
      res.newPath)
      .then(response => {
        if (!response.status) {
          let errMsg;
          if (response.invalidDestination) {
            errMsg = res.element.folder ? 'ED_DRIVE_INVALID_MOVE_DESTINATION_FOLDER' : 'ED_DRIVE_INVALID_MOVE_DESTINATION_FILE';
          } else {
            errMsg = 'ED_DRIVE_ERROR_INFO';
          }
          this.printError(errMsg);
        } else {
          this.fileService.clear();
          this.navigateToFolder(this.currentRoot, false, true);
        }
      }).catch(err => {
      this.showGenericError();
    });
  }

  downloadFile(element: FileElement) {
    this.notifyError.clearNotification();
    let path = this.currentPath ? `/${this.currentPath}` : '/';
    this.fileService.downloadFile(path, element.fileName)
      .then((val) => {
        if (val) {
          saveAs(val, element.fileName)
        } else {
          this.showGenericError();
        }
      }).catch(err => {
      this.showGenericError();
    });
  }

  renameElement(res) {
    this.loading = true;
    this.notifyError.clearNotification();
    let parentId = this.currentRoot ? this.currentRoot.id : '/';
    let folderPath = this.currentRoot ? `/${this.currentPath}` : `/`;
    this.fileService.rename(res.element.id, parentId, folderPath, res.oldName, res.element.fileName).then(response => {
      if (!response.status) {
        this.showGenericError();
      } else {
        this.handleSuccessResponse(response);
        this.currentRoot.fileName = res.element.fileName;
      }
    }).catch(err => {
      this.showGenericError();
    });
  }

  updateFileElementQuery() {
    this.notifyError.clearNotification();
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  uploadedFile(resFileElements: FileElement[]) {
    this.notifyError.clearNotification();
    this.loading = true;
    this.updateDirectoryList(resFileElements);
    this.loading = false;
    this.updateFileElementQuery();
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  printError(err: any) {
    this.loading = false;
    this.notifyError.printErrorNotification(err);
  }

  updateDirectoryList(dirs: FileElement[]) {
    this.regex = this.translation.translate('ED_DRIVE_FILENAME_REGEX');
    this.foldersList = [];
    dirs.forEach(dir => {
      if (dir.folder) {
        this.foldersList.push(dir.fileName.toUpperCase())
      }
      this.fileService.add(dir);
    });
  }

  clearAlert() {
    this.notifyError.clearNotification();
  }

  checkUserRoles(): void {
    this.landingPageService.checkUserRole('vodafone account manager').subscribe(res => {
      this.vodafoneAccountManager = res;
      if (res) {
        this.writeAccess = false;
      } else {
        this.orderDetailsService.getMenu().pipe(take(1)).subscribe(role => {
          this.isReadOnlyUser = role.isReadOnlyUser;
          this.vfUser = role.vfUser;
          if (!role.isReadOnlyVodafoneUser && !role.isReadOnlyUser && role.vfUser) {
            this.writeAccess = true;
          } else {
            this.writeAccess = false;
            this.isReadOnlyVodafoneUser = role.isReadOnlyVodafoneUser;
            if (!(this.isReadOnlyUser && this.vfUser)) {
              this.navigateToFolder(this.rootElement, false, false);
            }
          }
        })
      }
    });
  }

  showGenericError() {
    let errMsg = 'ED_DRIVE_ERROR_INFO';
    this.printError(errMsg);
  }

  handleSuccessResponse(apiResponse) {
    this.fileService.clear();
    this.updateDirectoryList(apiResponse.uploadDetails);
    this.loading = false;
    this.updateFileElementQuery();
  }

  shopSelected() {
    this.navigateToFolder(this.rootElement, false, false);
  }
}
