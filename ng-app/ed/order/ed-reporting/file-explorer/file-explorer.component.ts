import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {NewFolderDialogComponent} from './modals/new-folder-dialog/new-folder-dialog.component';
import {RenameDialogComponent} from './modals/rename-dialog/rename-dialog.component';
import {DeleteConfirmationDialogComponent} from './modals/delete-confirmation-dialog/delete-confirmation-dialog.component';
import {NotificationHandlerService} from '../../../../sncr-components/sncr-notification/notification-handler.service';
import {FileElement} from './model/file-element';
import {FileService} from '../service/file-explorer.service';
import {Language} from 'angular-l10n';
import {MoveFolderDialogComponent} from './modals/move-folder-dialog/move-folder-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit, OnChanges {
  firstLoad: boolean;
  fileUploaded: boolean;
  loading: boolean;
  notifyError: NotificationHandlerService = new NotificationHandlerService();
  uploadFile: File;
  files: any[] = [];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    centered: true
  };

  @Input() writeAccess: boolean;
  @Input() isReadOnlyVodafoneUser: boolean;
  @Input() vodafoneAccountManager: boolean;
  @Input() isReadOnlyUser: boolean;
  @Input() vfUser: boolean;
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;
  @Input() root: string;
  @Input() isLoading: boolean;
  @Input() supportedFiles: string[];
  @Input() folderList: string[];
  @Input() noFolders: boolean;
  @Input() regex: string;

  @Language() lang: string;
  @Output() shopSelected = new EventEmitter();
  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<{ element: FileElement, oldName: string }>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement, targetFolder: FileElement, newPath: string }>();
  @Output() fileDownloaded = new EventEmitter<FileElement>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() uploadedFile = new EventEmitter();
  @Output() clearParentAlert = new EventEmitter();
  shopDto: { shopId: any; skeletonContractNo: any; shopName: any; };
  shopList: any;
  shopListCols: Array<any> = [];
  shopLoading: boolean;

  constructor(private modalService: NgbModal, private router: Router, private fileService: FileService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.writeAccess && changes.writeAccess.currentValue) || this.isReadOnlyVodafoneUser || this.vodafoneAccountManager 
      || (this.vfUser && this.isReadOnlyUser)) {
      this.fileService.getShops().then(shops => {
        this.shopLoading = false;
        this.shopList = shops;
      }).catch(err => {
        console.log(err);
        this.router.navigate(['ed/home']);
      })
    }
  }

  ngOnInit() {
    this.shopListCols = [
      {title: 'ED_ROOT_CUSTOMER_NO', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'ED_SHOP_NAME', field: 'shopName', show: true, sortable: true},
      {title: 'ED_CUSTOMER_COUNT', field: 'customerCount', type: 'number', show: true, sortable: true}
    ];
    this.firstLoad = true;
    this.shopLoading = true;
    this.clearAlerts();
  }

  navigate(element: FileElement) {
    this.clearAlerts();
    if (element.folder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.clearAlerts();
    this.navigatedUp.emit();
  }

  downloadFile(element: FileElement) {
    this.clearAlerts();
    this.fileDownloaded.emit(element);
  }

  openNewFolderDialog() {
    this.clearAlerts();
    const modalRef = this.modalService.open(NewFolderDialogComponent, this.ngbModalOptions);
    modalRef.componentInstance.folderList = this.folderList;
    modalRef.result.then((folderName) => {
      if (folderName) {
        this.folderAdded.emit({name: folderName});
      }
    });
  }

  openRenameDialog(element: FileElement) {
    this.clearAlerts();
    const modalRef = this.modalService.open(RenameDialogComponent, this.ngbModalOptions);
    modalRef.componentInstance.folderName = element.fileName;
    modalRef.componentInstance.folderList = this.folderList;
    modalRef.result.then((res) => {
      if (res) {
        element.fileName = res.folderName;
        this.elementRenamed.emit({element: element, oldName: res.oldName});
      }
    });
  }

  openDeleteConfirmationDialog(element: FileElement) {
    this.clearAlerts();
    const modalRef = this.modalService.open(DeleteConfirmationDialogComponent, this.ngbModalOptions);
    modalRef.componentInstance.elementName = element.fileName;
    modalRef.result.then((confirmation) => {
      if (confirmation) {
        this.elementRemoved.emit(element);
      }
    });
  }

  openMoveDialog(element: FileElement) {
    this.clearAlerts();
    const modalRef = this.modalService.open(MoveFolderDialogComponent, this.ngbModalOptions);
    modalRef.componentInstance.folderToMove = element;
    modalRef.result.then((res) => {
      if (res) {
        this.elementMoved.emit({element: element, targetFolder: res.targetFolder, newPath: res.newPath});
      }
    });
  }

  onFileSelect(event, reUpload) {
    this.clearParentAlert.emit();
    this.clearAlerts();
    this.fileUploaded = false;
    this.loading = true;
    let file = event.target.files[0];
    if (this.fileService.checkSpecialCharacters(file.name, this.regex)) {
      let errMsg = 'ED_DRIVE_INVALID_FOLDER_NAME_SC';
      this.printError(errMsg);
    } else {
      if (event.target.files) {
        this.uploadChanges(file, reUpload);
      }
    }
  }

  onFileDrop(files: NgxFileDropEntry[], reUpload) {
    this.clearAlerts();
    this.clearParentAlert.emit();
    this.loading = true;
    let droppedFile = files[0];
    if (this.fileService.checkSpecialCharacters(droppedFile.fileEntry.name, this.regex)) {
      let errMsg = 'ED_DRIVE_INVALID_FOLDER_NAME_SC';
      this.printError(errMsg);
    } else {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.parseFileEntry(fileEntry).then((f: File) => {
          this.uploadChanges(f, reUpload);
        }).catch(err => {
          this.notifyError.printErrorNotification(err);
        });
      } else {
        let errMsg = 'ED_DRIVE_ERROR_INVALIDFILE';
        this.printError(errMsg);
      }
    }
  }

  validateFileType(file) {
    let fileExtn = '.' + file.name.split('.').pop();
    return this.supportedFiles.includes(file.type) || this.supportedFiles.includes(fileExtn)
  }

  uploadChanges(file: File, reUpload: any) {
    this.uploadFile = file;
    if (this.uploadFile && this.validateFileType(this.uploadFile)) {
      this.fileUploaded = false;
      let fd = new FormData();
      fd.append('fileimport', this.uploadFile);
      fd.append('fileName', this.uploadFile.name);
      fd.append('reupload', reUpload);
      this.fileService.uploadChanges(fd, this.root, this.path ? '/' + this.path : '/').then((res) => {
        if (!res.status) {
          let errMsg;
          if (res.invalidDestination) {
            errMsg = 'ED_DRIVE_INVALID_MOVE_DESTINATION_FILE';
          } else {
            errMsg = 'ED_DRIVE_ERROR_UPLOAD';
          }
          this.printError(errMsg);
        } else {
          this.fileService.clear();
          this.fileUploaded = true;
          this.uploadedFile.emit(res.uploadDetails);
          this.loading = false;
        }
      }).catch(err => {
        let errMsg = 'ED_DRIVE_ERROR_INFO';
        this.printError(errMsg);
      });
    } else {
      let errMsg = 'ED_DRIVE_ERROR_INVALIDFILE';
      this.printError(errMsg);
    }
  }

  parseFileEntry(fileEntry) {
    return new Promise((resolve, reject) => {
      fileEntry.file(
        file => {
          resolve(file);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  printError(err: any) {
    this.loading = false;
    this.notifyError.printErrorNotification(err);
  }

  clearAlerts() {
    this.fileUploaded = false;
    this.notifyError.clearNotification();
    this.noFolders = false;
  }

  showShopSelection() {
    if (this.writeAccess || this.isReadOnlyVodafoneUser || this.vodafoneAccountManager 
      || (this.vfUser && this.isReadOnlyUser)) {
      if (this.firstLoad) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  navigateShopSelection() {
    this.firstLoad = true;
    this.shopLoading = true;
    this.fileService.getShops().then(shops => {
      this.shopLoading = false;
      this.shopList = shops;
    }).catch(err => {
      console.log(err);
      this.router.navigate(['ed/home']);
    })
  };

  selectedShop(event: any) {
    this.shopDto = {
      shopId: event.data.shopId,
      skeletonContractNo: event.data.fnRootCustomerNumber,
      shopName: event.data.shopName
    }
    this.setSelectedShopToSession(this.shopDto);
  }

  setSelectedShopToSession(shopDto) {
    this.fileService.setSelectedShopToSession(shopDto).then(resp => {
      if (resp.status) {
        this.shopSelected.emit();
        this.firstLoad = false;
      } else {
        this.router.navigate(['ed/home']);
      }
    }).catch((err) => {
      this.notifyError.printErrorNotification(err);
      this.router.navigate(['ed/home']);
    });
  }

}
