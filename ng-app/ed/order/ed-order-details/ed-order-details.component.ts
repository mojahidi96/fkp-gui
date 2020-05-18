/**
 * Created by dsag0002 on 26-Oct-18.
 */

import {Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {EDOrderDetailsService} from './ed-order-details.service';
import {Panel, Field} from '../../../fixednet/order/dynamic-panels/panel';
import {OrderService} from '../../../fixednet/order/order.service';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {BehaviorSubject, forkJoin, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, take} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {OrderViewModel} from './order-view-model';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {FileExtensionImage, FileObject, FileStatus} from '../../../sncr-components/sncr-commons/file-extension-image';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';


@Component({
  selector: 'ed-order-details',
  templateUrl: 'ed-order-details.component.html',
  styleUrls: ['ed-order-details.component.scss']
})

export class EDOrderDetailsComponent implements OnInit, OnDestroy {

  orderStatusForm: FormGroup;
  docMgtForm: FormGroup;
  manageOrders = [];
  isVodafoneAccountManager: boolean;
  transactionId: string;
  @ViewChild('createdDateTime', {static: true}) createdDateTime;
  @ViewChild('customerInfo', {static: true}) customerInfo;
  @ViewChild('milestoneStatus', {static: true}) milestoneStatus;
  @ViewChild('msgContentModal') msgContentModal: NgbModal;
  @ViewChild('deleteConfirmModal') deleteConfirmModal: NgbModal;
  @ViewChild('docOrderNumber') docOrderNumber;
  @ViewChild('downloadUrl', {static: true}) downloadUrl;
  @ViewChild('docSize', {static: true}) docSize;
  @ViewChild('deleteFileTemplate', {static: true}) deleteFileTemplate;
  @ViewChild('epochTime', {static: true}) epochTime;
  @ViewChild('downloadOrderFile', {static: true}) downloadOrderFile;
  toggleState: boolean;
  panels: Panel[];
  orderDetails: any = {};
  location: any = {};
  showValidation = false;
  routeSubscription: Subscription;
  private patternMap: any;
  comments = [];
  columns = [];
  docColumns = [];
  docList = [];
  archColumns = [];
  toggle: boolean;
  loadComments: boolean;
  loading: boolean;
  mileValues = {};
  isReadOnlyUser: boolean;
  orderValueDetails: OrderViewModel;
  loadsystemHistory: boolean;
  systemhistory = [];
  systemcolumns = [];
  private files: FileObject[] = [];
  private queue: BehaviorSubject<FileObject[]>;
  fileUploadSubscription: Subscription;
  fileExtImage: any;
  errorMsg: string;
  MAX_FILE_SIZE = 20 * 1024 * 1024;  // in bytes
  MAX_FILE_LENGTH = 10;
  FILE_EXT_ALLOWED = 'pdf,doc,docx,xls,xlsx,jpg';
  uploadedFileSize = 0;
  isReadOnly: boolean;
  uploadInProgress: boolean;
  messageKey: string;
  typeOfmessage: string;
  userDetails: any;
  showSAP = false;
  restoreSession: string;
  loadDocs: boolean;
  archFiles: any;
  vfUser: boolean;

  constructor(private fb: FormBuilder, private orderDetailsService: EDOrderDetailsService,
              private orderService: OrderService,
              private route: ActivatedRoute, private cd: ChangeDetectorRef,
              public alertNotify: NotificationHandlerService, private modalService: NgbModal,
              private router: Router) {
    this.location = {};
    this.queue = new BehaviorSubject<FileObject[]>(this.files);
  }

  ngOnInit(): void {
    if (UtilsService.notNull(sessionStorage.getItem('detail'))) {
      this.transactionId = sessionStorage.getItem('detail');
      this.isVodafoneAccountManager = JSON.parse(sessionStorage.getItem('vam'));
    } else {
      this.router.navigate(['ed/ordermanager'])
    }
    this.restoreSession = 'false';
    this.uploadInProgress = false;
    this.fileExtImage = FileExtensionImage;
    this.loading = true;
    this.routeSubscription = this.route.data.subscribe((data: { pattern: any }) => {
      this.patternMap = data.pattern ? data.pattern : '';
    });

    this.fileUploadSubscription = this.queue.subscribe(fileList => {
      let fileSuccess = 0;
      fileList.forEach(file => {
        if (file.status === FileStatus.Success) {
          fileSuccess++;
        }
      });
      if (fileSuccess === fileList.length) {
        this.getDocuments();
        this.files.length = 0;
        this.refreshOrderHistory();
        this.uploadInProgress = false;
      }
    });
    this.getUserDetails();
    this.getOrderEligibleStatus();
    this.createForm();
    this.getOrderDetails();
    this.columns = [
      {title: 'ED-OD-COL_TIME', field: 'lastRefreshedEpoch', sortable: true, type: 'date', show: true, bodyTemplate: this.createdDateTime},
      {title: 'ED-OD-COL_USERNAME', field: 'userName', sortable: true, type: 'text', show: true},
      {title: 'ED-OD-COL_COMMENTS', field: 'userComment', sortable: true, type: 'text', show: true, bodyTemplate: this.customerInfo}
    ];

    this.docColumns = [
      {
        title: 'ED-DOC-FILE-NAME', field: 'docName', sortable: true, type: 'text', show: true,
        filter: false, bodyTemplate: this.downloadUrl
      },
      {title: 'ED-DOC-FILE-SIZE', field: 'docSize', sortable: true, type: 'text', show: true, filter: false, bodyTemplate: this.docSize},
      {title: 'ED-DOC-UPLOADED-TS', field: 'createdTs', sortable: true, type: 'date', show: true, filter: false},
      {title: 'ED-DOC-UPLOADED-BY', field: 'userName', sortable: true, type: 'text', show: true, filter: false},
      {title: '', field: 'docId', sortable: false, type: 'text', show: true, filter: false, bodyTemplate: this.deleteFileTemplate}
    ];
    this.systemcolumns = [
      {title: 'ED-SYS-HISTORY-TIME', field: 'lastRefreshEpoch', sortable: true, type: 'date', show: true, bodyTemplate: this.epochTime},
      {title: 'ED-SYS-HISTORY-USERNAME', field: 'userName', sortable: true, type: 'text', show: true},
      {title: 'ED-SYS-HISTORY-STATUS', field: 'status', sortable: true, type: 'text', show: true},
      {title: 'ED-SYS-HISTORY-COMMENT', field: 'userComment', sortable: true, type: 'text', show: true, bodyTemplate: this.customerInfo},
      {title: 'ED-SYS-HISTORY-MILESTONE', field: 'currentMilestone', sortable: true, type: 'text', show: true},
      {
        title: 'ED-SYS-HISTORY-MILESTONE_STATUS', field: 'milestoneStatus', sortable: true, type: 'text', show: true,
        bodyTemplate: this.milestoneStatus
      },
      {title: 'ED-SYS-HISTORY-SAP_NUMBER', field: 'sapOrderNumber', sortable: true, type: 'text', show: true},
      {title: 'ED-SYS-HISTORY-DOC_NAME', field: 'documentName', sortable: true, type: 'text', show: true},
      {title: 'ED-ACCESS_IDENTIFIER1', field: 'accessIdentifier', sortable: true, type: 'text', show: true},
      {title: 'ED-ACCESS_IDENTIFIER2', field: 'accessIdentifier2', sortable: true, type: 'text', show: true},
      {title: 'ED-ORDER_BINDING_DATE', field: 'bindingDeliveryDateTs', sortable: true, type: 'date', show: true},
      {title: 'ED-ORDER_CURRENT_DATE', field: 'currentDeliveryDateTs', sortable: true, type: 'date', show: true},
      {title: 'ED-ADDITIONAL_CONTACT_1', field: 'additionalContact1', sortable: true, type: 'text', show: true},
      {title: 'ED-ADDITIONAL_CONTACT_2', field: 'additionalContact2', sortable: true, type: 'text', show: true},
      {title: 'ED-SYS-HISTORY_ACTION', field: 'action', sortable: true, type: 'text', show: true}
    ];
    this.archColumns = [
      {title: 'ED-ARCHIVE_FILENAME', field: 'fileName', type: 'text', show: true, bodyTemplate: this.downloadOrderFile},
      {title: 'ED-ARCHIVE_USERNAME', field: 'userName', type: 'text', show: true},
      {title: 'ED-ARCHIVE_DATE', field: 'lastRefreshEpoch', sortable: true, type: 'date', show: true}
    ];
    this.getMilestones();
    this.getDocuments();
  }

  getDocuments(): void {
    this.orderDetailsService.getDocuments(this.transactionId).pipe(take(1)).subscribe(value => {
        this.docList = value;
        this.calcUploadedFileSize();
        this.detectChanges();
      },
      error => {
        console.log('error', error);
      });
  }

  getArchFiles(): void {
    this.loadDocs = true;
    this.orderDetailsService.getArchFiles(this.transactionId).subscribe(value => {
    this.archFiles = value;
    this.loadDocs = false;
    })
  }

  calcUploadedFileSize(): void {
    this.uploadedFileSize = 0;
    this.docList.forEach(file => {
      this.uploadedFileSize = this.uploadedFileSize + Number(file.docSize);
    });
  }

  confirmDeleteDoc(item: any): void {
    this.modalService.open(this.deleteConfirmModal, {backdrop: 'static', keyboard: false}).result.then((result) => {
      if (result === 'OK') {
        this.deleteFile(item);
      }
    });
  }

  deleteFile(deletedItem: any): void {
    this.orderDetailsService.removeDocuments(this.transactionId, deletedItem.docId).subscribe(value => {
        this.uploadedFileSize = this.uploadedFileSize - parseInt(deletedItem.docSize, 10);
        this.docList = this.docList.filter(item => item !== deletedItem);
        this.refreshOrderHistory();
      },
      error => {
        this.errorMsg = 'ED-DOC-DELETE-FAILED';
      });
  }

  downloadFile(fileId: string, fileName: string): void {
    this.orderDetailsService.downloadDocuments(this.transactionId, fileId, fileName).subscribe(data => {
      saveAs(data, fileName)
      this.refreshOrderHistory();
    });
  }

  getOrdernum(ordervalueDetails: OrderViewModel): void {
    this.orderValueDetails = ordervalueDetails;
    if (UtilsService.notNull(this.orderValueDetails.sapOrderNumber)) {
      this.showSAP = false;
      this.orderStatusForm.controls['sapValue'].disable();
    } else if (!UtilsService.notNull(this.orderValueDetails.sapOrderNumber) && !this.userDetails.vfUser) {
      this.showSAP = true
    }
    this.orderStatusForm.get('accessIdentifier1').setValue(this.orderValueDetails.accessIdentifier);
    this.orderStatusForm.get('accessIdentifier2').setValue(this.orderValueDetails.accessIdentifier2);
    this.orderStatusForm.get('additionalContact1').setValue(this.orderValueDetails.additionalContact1);
    this.orderStatusForm.get('additionalContact2').setValue(this.orderValueDetails.additionalContact2);
    if (UtilsService.notNull(this.orderValueDetails.bindingDeliveryDate)) {
      let date = this.orderValueDetails.bindingDeliveryDate.split('.');
      this.orderStatusForm.get('bindingDate').setValue
      ({year: parseInt(date[2], 10), month: parseInt(date[1], 10), day: parseInt(date[0], 10)})
    }
    if (UtilsService.notNull(this.orderValueDetails.currentDeliveryDate)) {
      let currentDate = this.orderValueDetails.currentDeliveryDate.split('.');
      this.orderStatusForm.get('currentDate').setValue
      ({year: parseInt(currentDate[2], 10), month: parseInt(currentDate[1], 10), day: parseInt(currentDate[0], 10)})
    }
    this.cd.detectChanges();
  }

  getUserDetails(): void {
    forkJoin(this.orderDetailsService.getMenu(),
      this.orderDetailsService.getOrderView(this.transactionId))
      .subscribe(([userDetails, orderNum]) => {
        this.userDetails = userDetails;
        this.vfUser = userDetails.vfUser;
        this.isReadOnlyUser = userDetails.isReadOnlyUser;
        this.getOrdernum(orderNum);
        this.cd.detectChanges();
      });
  }

  getMilestones(): void {
    this.orderDetailsService.getMilestoneValues(this.transactionId).pipe(take(1))
      .subscribe(value => {
        this.mileValues = value;
      })
  }

  refreshOrderHistory() {
    this.loadsystemHistory = true;
    this.orderDetailsService.getSystemHistory(this.transactionId).subscribe(history => {
      this.systemhistory = history;
      this.loadsystemHistory = false;
      this.detectChanges();
    });
  }

  createForm() {
    this.orderStatusForm = this.fb.group({
      status: [''],
      sapValue: ['', [CustomValidators.sanitization(this.patternMap), Validators.maxLength(35)]],
      message: ['', [Validators.maxLength(1000), CustomValidators.sanitization(this.patternMap)]],
      accessIdentifier1: ['', [Validators.maxLength(60), CustomValidators.sanitization(this.patternMap)]],
      accessIdentifier2: ['', [Validators.maxLength(60), CustomValidators.sanitization(this.patternMap)]],
      bindingDate: [''],
      currentDate: [''],
      additionalContact1: ['', [Validators.maxLength(100), CustomValidators.sanitization(this.patternMap), CustomValidators.email]],
      additionalContact2: ['', [Validators.maxLength(100), CustomValidators.sanitization(this.patternMap), CustomValidators.email]]

    });
    this.docMgtForm = this.fb.group({
      uploadfile: ['', Validators.required],
      docsize: ['0']
    });
  }

  getOrderEligibleStatus() {
    let sapValue: any;
    this.orderDetailsService.getOrderEligiableStatus(this.transactionId)
      .pipe(take(1))
      .subscribe(eligbleStatus => {
        this.manageOrders = eligbleStatus
      });
    this.cd.detectChanges();
  }

  submitOrder(): void {
    this.showValidation = true;
    if ((this.orderStatusForm && this.orderStatusForm.valid) && (this.orderStatusForm.value && this.orderStatusForm.dirty)) {
        this.orderDetailsService.submitOrder(this.transactionId, this.orderStatusForm.controls)
          .subscribe(res => {
            if (res.messageKey && res.messageKey !== 'NOCHANGES') {
              this.panels = null;
              this.orderStatusForm.get('status').setValue('');
              this.orderStatusForm.get('message').setValue('');
              this.messageKey = res.messageKey;
              this.getOrderDetails();
              this.refreshOrderHistory();
              this.refreshComments();
              this.getOrderEligibleStatus();
              this.getUserDetails();
              if (res && res.updateOrder) {
                this.refreshArchiveSection();
                this.alertNotify.clearNotification();
                this.openMessageModal('success');
                this.orderStatusForm.markAsPristine()
              } else {
                this.openMessageModal('danger');
              }
            
          }
        });
    } else {
      this.alertNotify.clearNotification();
      this.alertNotify.printErrorNotification('ED-FORM_ERROR_MSG');
    }
  }


  openMessageModal(type: string): void {
    this.modalService.open(this.msgContentModal, {backdrop: 'static', keyboard: false});
    this.typeOfmessage = type
  }

  refreshComments(): void {
    this.loadComments = true;
    this.orderDetailsService.getCommentList(this.transactionId).subscribe(comments => {
      this.loadComments = false;
      this.comments = comments;
      this.detectChanges();
    });
  }

  toggleAcc(event): void {
    this.toggleState = !this.toggleState;
  }

  backbuttonClicked() {
    this.restoreSession = 'true';
    this.orderDetailsService.clearOrderDetailData();
    this.router.navigate(['ed/ordermanager'], {queryParams: {resume: 'true'}, queryParamsHandling: 'preserve'});
  }

  panelChange(event: any): void {
    this.toggle = !this.toggle;
    if (event.panelId === 'systemhistory') {
      this.panelChangegetHistory();
    }
    if (event.panelId === 'changeHistory') {
      this.getComments()
    }
    if (event.panelId === 'archivedocs' && this.vfUser) {
      this.getArchFiles();
    }
  }

  getComments(): void {
    if (this.comments.length === 0) {
      this.refreshComments();
    } else {
      this.detectChanges();
    }
  }

  panelChangegetHistory(): void {
    if (this.systemhistory.length === 0) {
      this.loadsystemHistory = true;
      this.orderDetailsService.getSystemHistory(this.transactionId).subscribe(history => {
        this.loadsystemHistory = false;
        this.systemhistory = history;
        this.detectChanges();
      });
    } else {
      this.detectChanges();
    }
  }

  detectChanges() {
    setTimeout(() => this.cd.detectChanges());
  }

  getOrderDetails() {
    forkJoin(
      this.orderDetailsService.getPanels(this.transactionId),
      this.orderDetailsService.getOrderDetail(this.transactionId)
    ).subscribe(([panels, data]) => {
        this.loading = false;
        this.orderDetails = data;
        this.panels = this.orderService.parsePanels(panels);
        this.panels.forEach(panel => {
          panel.contents.forEach(row => {
            row.forEach(field => {
              if (field.type === 'table') {
                const radio = Object.keys(field.rows[0]).find(k => {
                  return field.rows[0][k].type === 'radio';
                });
                const selectedRow = data.cartDetails.details.panelFields
                  .find(f => f.fieldId === field.rows[0][radio].fieldId);
                const fields = field.rows.find(r => r[radio].values[0].value === selectedRow.fieldValue);
                Object.keys(fields).forEach(key => {
                  let f = fields[key];
                  const splitId = f.fieldId.split('-');
                  if (splitId.length) {
                    f.fieldId = splitId[splitId.length - 1];
                  }
                  this.setDefaultValues(data, f);
                });
              } else {
                this.setDefaultValues(data, field);
              }
            });
          });
        });
        this.cd.detectChanges();
      },
      error => {
        console.log('error', error);
      });
  }

  private setDefaultValues(data, field: Field) {
    const defaultValue = data
      .find(f => f.fieldId === field.fieldId);
    if (defaultValue) {
      field.defaultValue = defaultValue.fieldValue === 'false' ? false : defaultValue.fieldValue;
    }
  }

  cancelOrder() {
    this.backbuttonClicked();
  }

  closeModal() {
    // reload the page whenever user clicks ok after he saw the message
    window.location.reload();
  }

  onFileDrop(files: NgxFileDropEntry[]) {
    this.errorMsg = '';
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile && !droppedFile.fileEntry.isDirectory) {
        this.uploadInProgress = false;
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.parseFileEntry(fileEntry).then((f: File) => {
          if (this.validateFileExt(f.name)) {
            this.files.push(new FileObject(f));
            this.queue.next(this.files);
          } else {
            this.errorMsg = 'DOC_INVALID_FORMAT_ERROR';
          }
        }).catch(err => {
          this.errorMsg = 'FILE_UPLOAD_ERROR';
        });
      } else {
        this.errorMsg = 'ED_DRIVE_ERROR_INVALIDFILE';
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

  handleFileInput(files: any) {
    this.errorMsg = '';
    let fileList = <Array<File>>files;
    for (let i = 0; i < fileList.length; i++) {
      if (this.validateFileExt(fileList[i].name)) {
        this.uploadInProgress = false;
        this.files.push(new FileObject(fileList[i]));
      } else {
        this.errorMsg = 'DOC_INVALID_FORMAT_ERROR';
      }
    }
    this.queue.next(this.files);
  }

  validateFileExt(fileName: string): boolean {
    let fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
    return this.FILE_EXT_ALLOWED.indexOf(fileExt.toLowerCase()) > -1;
  }

  removeFile(file: any, index: number) {
    this.files.splice(index, 1);
    this.queue.next(this.files);
    this.docMgtForm.controls.uploadfile.setValue(this.files);
  }

  validateUpload(): { error: boolean, errorMsg: string } {
    let selectedFilesSize = 0;
    this.errorMsg = '';
    this.files.forEach(doc => {
      selectedFilesSize = selectedFilesSize + doc.file.size;
    });
    if ((this.docList.length + this.files.length) > this.MAX_FILE_LENGTH) {
      return {error: true, errorMsg: 'ED-DOC-MAX_FILE_ERROR'}
    } else if ((this.uploadedFileSize + selectedFilesSize) > this.MAX_FILE_SIZE) {
      return {error: true, errorMsg: 'ED-DOC-MAX_FILE_ERROR'}
    } else {
      return {error: false, errorMsg: ''}
    }
  }

  uploadDocuments(): void {
    let fileValidation = this.validateUpload();
    if (!fileValidation.error) {
      this.uploadInProgress = true;
      this.errorMsg = '';
      this.files.forEach((fileitem, fileIndex) => {
        let formData = new FormData();
        formData.append('files', fileitem.file, fileitem.file['name']);
        fileitem.request = this.orderDetailsService.uploadDocuments(this.transactionId, formData)
          .subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round(100 * event.loaded / event.total);
                fileitem.status = FileStatus.Progress;
                fileitem.progress = percentDone;
              } else if (event.type === HttpEventType.Response) {
                fileitem.status = FileStatus.Success;
                fileitem.response = event;
                this.files.splice(fileIndex, 1);
                this.docMgtForm.controls.uploadfile.setValue('');
              }
              this.queue.next(this.files);
            },
            (err: HttpErrorResponse) => {
              fileitem.status = FileStatus.Error;
              fileitem.response = err;
              this.errorMsg = 'FILE_UPLOAD_ERROR';
            });
      });
    } else {
      this.errorMsg = fileValidation.errorMsg;
    }
  }

  downloadOrderArchFile(docId: string, docName: string): void {
    this.orderDetailsService.downloadArchFile(docId);
  }

  public getfileList() {
    return this.queue.asObservable();
  }

  getMinDate() {
    let date = new Date();
    let lastDay = new Date(date.getUTCFullYear(), date.getMonth() + 1, 0).getDate();
    let day = date.getUTCDate();
    let month = day > lastDay ? date.getUTCMonth() + 2 : date.getUTCMonth() + 1;
    return {
      day: day > lastDay ? 1 : day,
      month: month > 12 ? 1 : month,
      year: month > 12 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
    };
  }

  onDatepickerReset(event: any) {
    if (event) {
      this.orderStatusForm.markAsDirty();
    }
  }

  refreshArchiveSection(): void {
    if (this.vfUser) {
      this.getArchFiles();
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('detail');
    sessionStorage.setItem('restoreSession', this.restoreSession);
    sessionStorage.removeItem('vam');
    this.orderDetailsService.clearOrderDetailData();
    this.routeSubscription.unsubscribe();
  }

}
