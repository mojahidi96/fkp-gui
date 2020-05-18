import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FileSystemFileEntry} from 'ngx-file-drop';
import {UploadChangesService} from './upload-changes.service';
import {DownloadParams} from '../sncr-components/sncr-download-selections/downloadParams';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {Language, TranslationService} from 'angular-l10n';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'upload-changes',
  templateUrl: 'upload-changes.component.html',
  styleUrls: ['upload-changes.component.scss']
})
export class UploadChangesComponent implements OnInit, OnChanges {
  @Input() initialLoad = false;
  @Input() nonData = false;
  @Input() changed: boolean;
  @Input() properties: Map<any, any>;
  @Input() reviewConfigId = '';
  @Input() manageConfigId = '';
  @Input() uploadCount = 0;
  @Input() uploadUrl = '';
  @Input() submitUploadUrl = '';
  @Input() showTable = false;
  @Input() columns = [];
  @Input() showErrorTable = false;

  showResults = false;
  errorRows = [];
  errorTableCols = [];
  successMsg = '';
  notifySuccess: NotificationHandlerService = new NotificationHandlerService();
  notifyinvalidRec: NotificationHandlerService = new NotificationHandlerService();
  notifyError: NotificationHandlerService = new NotificationHandlerService();
  uploadFile: File;
  loading = false;
  processToReview = false;
  files: any[] = [];
  uploadRes: any;
  @Output() onUploadFinish = new EventEmitter();
  downloadParams = new DownloadParams();
  @Input() managementFlow: SncrFlowSectionComponent;
  hasChanged = false;
  @Input() fileType = '.xlsx';
  @Language() lang: string;
  showSuccess = false;
  loadingTable = false;
  showUploadButton = true;
  orders = [];
  @Input() isReadOnlyUser;
  disableSubmit = false;

  constructor(
    private uploadChangesService: UploadChangesService,
    @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
    public translation: TranslationService
  ) {
  }

  ngOnInit() {
    if (this.showErrorTable) {
      this.errorTableCols = [
        {
          title: 'ED_UOF_ERROR_ROW',
          field: 'row',
          show: true,
          sortable: true
        },
        {title: 'ED_UOF_ERROR_CELL', field: 'cell', show: true, sortable: true},
        {
          title: 'ED_UOF_ERROR_FIELD_NAME',
          field: 'fieldName',
          type: 'number',
          show: true,
          sortable: true
        },
        {
          title: 'ED_UOF_ERROR_DESC',
          field: 'errorDesc',
          type: 'number',
          show: true,
          sortable: true
        }
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.downloadParams.url = '/buyflow/rest/exportfile/getinavalidrows';
    this.downloadParams.configId = this.manageConfigId;
    this.downloadParams.notificationHandler = this.notifyError;

    if (
      this.managementFlow &&
      this.managementFlow.prefilled &&
      this.uploadCount
    ) {
      this.managementFlow.prefilled = false;
      this.uploadRes = {};
      this.uploadRes.validRecords = this.uploadCount;
      this.uploadRes.invalidRecords = 0;
      this.setResponseRecords({});
    } else if (changes['changed']) {
      this.initialLoad = true;
      this.loading = false;
      this.uploadRes = {};
      this.managementFlow.model = {};
      this.showSuccess = false;
      this.notifyinvalidRec.clearNotification();
      this.notifySuccess.clearNotification();
      this.notifyError.clearNotification();
    }
  }

  validateFileType(file) {
    let fileExtn = '.' + file.name.split('.').pop();
    return (
      file.type === this.fileType ||
      fileExtn === this.fileType ||
      fileExtn === '.csv'
    );
  }

  uploadChanges(file: File, reUpload: any) {
    this.uploadFile = file;
    this.errorRows = [];
    if (this.uploadFile && this.validateFileType(this.uploadFile)) {
      this.showSuccess = false;
      this.notifySuccess.clearNotification();
      this.notifyinvalidRec.clearNotification();
      let fd = new FormData();
      fd.append('fileimport', this.uploadFile);
      fd.append('fileName', this.uploadFile.name);
      fd.append('reupload', reUpload);

      this.uploadChangesService
        .uploadChanges(fd, this.manageConfigId, this.uploadUrl)
        .then(res => {
          if (res.totalRecords === -1) {
            let errMsg = 'UPLOAD_CHANGES-ERROR_INAVLIDFILE';
            this.printError(errMsg);
          } else {
            this.initialLoad = false;
            if (!this.uploadRes) {
              this.uploadRes = {};
            }
            this.uploadRes.totalRecords = res.totalRecords;
            this.uploadRes.validRecords = res.validRecords;
            this.uploadRes.invalidRecords = res.invalidRecords;
            if (this.showErrorTable && res.errorRows.length > 0) {
              this.errorRows = res.errorRows;
            }
            this.notifyError.clearNotification();
            this.setResponseRecords(res);
            this.loading = false;
            this.onUploadFinish.emit(true);
          }
        })
        .catch(err => {
          let errMsg = 'UPLOAD_CHANGES-ERROR_INFO';
          this.printError(errMsg);
        });
    } else {
      this.notifyError.clearNotification();
      this.notifySuccess.clearNotification();
      this.notifyinvalidRec.clearNotification();
      this.showSuccess = false;
      let errMsg = 'UPLOAD_CHANGES-ERROR_INAVLIDFILE';
      this.printError(errMsg);
    }
  }

  printError(err: any) {
    this.initialLoad = true;
    this.loading = false;
    this.disableSubmit = true;
    this.notifyError.printErrorNotification(err);
  }

  setResponseRecords(res: any) {
    let invalidRecords = {invalidRecords: this.uploadRes.invalidRecords};
    if (this.uploadRes.invalidRecords === 1) {
      if (this.uploadUrl.includes('milestoneupload')) {
        this.setInvalidRows(
          res,
          invalidRecords,
          'UPLOAD_CHANGES-MILESTONE-INVALID_RECORD'
        );
      } else {
        this.setInvalidRows(
          res,
          invalidRecords,
          'UPLOAD_CHANGES-INVALID_RECORD'
        );
      }
    } else if (this.uploadRes.invalidRecords > 1) {
      if (this.uploadUrl.includes('milestoneupload')) {
        this.setInvalidRows(
          res,
          invalidRecords,
          'UPLOAD_CHANGES-MILESTONE-INVALID_RECORDS'
        );
      } else {
        this.setInvalidRows(
          res,
          invalidRecords,
          'UPLOAD_CHANGES-INVALID_RECORDS'
        );
      }
    }
    if (this.uploadRes.validRecords) {
      if (!this.uploadRes.invalidRecords) {
        if (this.uploadUrl.includes('milestoneupload')) {
          this.successMsg = 'UPLOAD_CHANGES-MILESTONE-VALID_RECORDS';
        } else {
          this.successMsg = 'UPLOAD_CHANGES-VALID_RECORDS';
        }
      } else {
        if (this.uploadUrl.includes('milestoneupload')) {
          this.successMsg = 'UPLOAD_CHANGES-MILESTONE-PARTIAL_VALID_RECORDS';
        } else {
          this.successMsg = 'UPLOAD_CHANGES-PARTIAL_VALID_RECORDS';
        }
      }
      this.showSuccess = true;
      this.disableSubmit = false;
    }
  }

  onFileSelect(evnt, reUpload) {
    this.loading = true;
    if (evnt.target.files) {
      this.uploadChanges(evnt.target.files[0], reUpload);
    }
  }

  onFileDrop(event, reUpload) {
    this.loading = true;
    this.files = event;
    for (const droppedFile of event) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        // Here you can access the real file
        this.parseFileEntry(fileEntry)
          .then((f: File) => {
            this.uploadChanges(f, reUpload);
          })
          .catch(err => {
            this.notifyError.printErrorNotification(err);
          });
      } else {
        let errMsg = 'UPLOAD_CHANGES-INVALID_RECORDS';
        this.printError(errMsg);
      }
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

  reloadPage() {
    this.loading = true;
    // API to call to clear any saved data
    this.uploadChangesService
      .clearPreviousUpload(this.manageConfigId)
      .then(data => {
        this.showSuccess = false;
        this.notifySuccess.clearNotification();
        this.notifyinvalidRec.clearNotification();
        this.notifyError.clearNotification();
        this.managementFlow.model = {};
        this.initialLoad = true;
        this.uploadRes = [];
        this.loading = false;
      });
  }

  loadReviewPage() {
    if (this.uploadRes.validRecords) {
      this.processToReview = true;
      this.uploadChangesService
        .persistUploadChanges(this.manageConfigId)
        .then(data => {
          let selectCount = 0;
          this.uploadChangesService
            .getSelectCount(this.reviewConfigId)
            .then(res => {
              this.processToReview = false;
              selectCount = res && res.count ? res.count : 0;
              if (selectCount) {
                this.uploadRes.invalidRecords = 0; // to make sure when they click 'Ändern' we show only valid upload
                this.notifyError.clearNotification();
                this.notifyinvalidRec.clearNotification();
                this.managementFlow.model.selectCount = selectCount;
                this.hasChanged = !this.hasChanged;
                this.managementFlow.model.hasChanged = this.hasChanged;
                this.managementFlow.next(this.managementFlow.model);
              } else {
                this.notifyError.printErrorNotification(
                  'MANAGE_DETAILS-NO_CHANGE_INFO'
                );
              }
            });
        })
        .catch(err => {
          this.processToReview = false;
          this.notifyError.printErrorNotification('UPLOAD_CHANGES-ERROR_INFO');
        });
    }
  }

  uploadFileChanges() {
    if (
      this.uploadRes &&
      this.uploadRes.validRecords &&
      !this.isReadOnlyUser &&
      this.showSuccess
    ) {
      this.errorRows = [];
      this.loadingTable = true;
      this.showUploadButton = false;
      this.showSuccess = false;
      this.uploadChangesService
        .persistFileUpload(this.submitUploadUrl)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          results => {
            if (this.showTable) {
              if (results.fileUploaded) {
                this.showUploadButton = false;
                if (results.orders.length > 0) {
                  this.orders = results.orders;
                  this.loadingTable = false;
                  this.showResults = true;
                  this.showSuccess = false;
                } else {
                  this.loadingTable = false;
                }
                this.notifyError.printSuccessNotification(
                  'OM-UPLOAD-UPLOAD_SUCCESS'
                );
              } else {
                this.loadingTable = false;
                this.notifyError.printErrorNotification('UPLOAD_CHANGES-ERROR_INFO');
              }
            } else {
              this.loadingTable = false;
              if (!results.fileUploaded) {
                this.notifyError.printErrorNotification('UPLOAD_CHANGES-ERROR_INFO');
              } else {
                this.notifyError.printSuccessNotification(
                  'OM-UPLOAD-UPLOAD_SUCCESS'
                );
              }
            }
          },
          error => {
            this.loadingTable = false;
            this.notifyError.printErrorNotification('UPLOAD_CHANGES-ERROR_INFO');
          }
        );
    }
  }

  setInvalidRows(res: any, invalidRecords: any, message: string) {
    if (res.invalidRows && Array.isArray(res.invalidRows)) {
      this.notifyinvalidRec.printErrorNotification(`${message}`, {
        ...invalidRecords,
        invalidRows: res.invalidRows
      });
    } else {
      this.notifyinvalidRec.printErrorNotification(`${message}`, invalidRecords);
    }
  }
}
