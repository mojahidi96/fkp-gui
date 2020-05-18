import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {SubscriberSelectionService} from './subscriber-selection.service';
import {LazyParams} from '../sncr-components/sncr-datatable/lazy-params';
import {ActivatedRoute} from '@angular/router';
import {Language, TranslationService} from 'angular-l10n';
import {DownloadParams} from '../sncr-components/sncr-download-selections/downloadParams';
import {UploadChangesService} from '../upload-changes/upload-changes.service';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';


@Component({
  selector: 'subscriber-selection',
  templateUrl: 'subscriber-selection.component.html',
  styleUrls: ['subscriber-selection.component.scss']
})
export class SubscriberSelectionComponent implements OnInit {

  emptyMessage: string;
  resultMessage = [];
  noSubscriberInfo: string;

  @ViewChild('subscriberTable') subscriberTable: SncrDatatableComponent;
  @ViewChild('socs', {static: true}) gridSocs;
  @Input() subscribers = [];
  @Input() columns = [];
  @Input() subsFlow;
  @Input() properties: Map<any, any>;
  @Input() lazy = false;
  @Input() lazyLoadUrl = '';
  @Input() csvUpload = false;

  @Output() onDataChange = new EventEmitter();

  @Language() lang;

  configId = '';
  selectAllEvent = false;
  manageSubsConfigId = '5c60e182-4a75-511c-e053-1405100af36b';
  hasChanged = false;
  processing = false;
  downLoading = false;
  lazyCount = 0;
  downloadParams = new DownloadParams();
  csvSelectCount = -1;
  errorCsvFile = {blob: null, count: 0};
  uploading = false;
  csvError: any;

  constructor(public subscriberNotify: NotificationHandlerService,
              private subscriberSelectionService: SubscriberSelectionService,
              private uploadChangesService: UploadChangesService,
              private route: ActivatedRoute,
              public translation: TranslationService) {

  }

  ngOnInit(): void {
    this.configId = this.lazyLoadUrl.substring(this.lazyLoadUrl.lastIndexOf('/') + 1);
    this.setDownloadParams();
    if (this.columns && this.columns.length) {
      if (this.columns.find(c => c['field'] === '40' && c['title'] === 'Tarifoptionen')) {
        this.columns.find(c => c['field'] === '40').bodyTemplate = this.gridSocs;
      }

      if (this.columns.find(c => c['field'] === '28') && this.lazy) {
        this.columns.find(c => c['field'] === '28').showInfoIcon = true;
        this.columns.find(c => c['field'] === '28').infoMsg = 'SELECTION-TOOLTIP-INTERNAL_CODE';
      }
      /**
       * to set Ban column as text
       */
      if (this.columns.find(c => c['field'] === '1') && this.lazy) {
        this.columns.find(c => c['field'] === '1')['type'] = 'text';
      }

      if (this.columns.find(c => c['field'] === '27')) {
        this.columns.find(c => c['field'] === '27').sortable = 'custom';
        this.columns.find(c => c['field'] === '27').sortFunction = event => {
          this.subscriberTable.dt.value.sort((a, b) =>
            this.sortByBasePrice(a, b, event)
          );
          return this.subscriberTable.dt.value;
        }
      }
    }

    this.emptyMessage = 'Kein Teilnehmer gefunden';
    this.resultMessage = ['Keine Teilnehmer gefunden', 'Ein Teilnehmer gefunden', 'Teilnehmer gefunden'];
    this.noSubscriberInfo = `<p class="alertTitle">Bitte beachten Sie:</p>
      <p class="messageText">Es sind keine Teilnehmer vorhanden.</p>
      `;
    if (this.lazy) {
      this.route.data.subscribe((data: { lazyCount: any }) => {
        if (data.lazyCount) {
          this.lazyCount = data.lazyCount;
        }
      });
    }

    if (window.location.hash.includes('maintainsoc')) {
      this.subscriberSelectionService.getCDACategory().subscribe(category => {
        this.csvUpload = UtilsService.notNull(category.name);
        if (this.csvUpload) {
          this.subsFlow.model.cdaCategoryName = category.name;
        }
      });
    }
  }

  manageUploadSection() {
    this.uploadChangesService.clearPreviousUpload(this.manageSubsConfigId).then(data => {
      this.subscriberNotify.clearNotification();
      this.proceedToUpload();
    });
  }

  proceedToUpload() {
    this.subsFlow.model.uploadChanges = true;
    this.subsFlow.model.uploadCount = 0;
    this.hasChanged = !this.hasChanged;
    this.subsFlow.model.hasChanged = this.hasChanged;
    this.subsFlow.next(this.subsFlow.model);
  }

  setDownloadParams() {
    this.downloadParams.configId = this.configId;
    this.downloadParams.notificationHandler = this.subscriberNotify;
    this.downloadParams.url = '/buyflow/rest/exportfile/excel';
  }

  manageNextSection(bulkEdit: boolean) {
    if (this.lazy) {
      this.processing = true;
      let selectCount = 0;
      if (this.configId === this.properties.get('subscriber.selections.configId')) {
        this.uploadChangesService.clearUploadContent(this.configId).then(res => {
          this.persistAndNavigate(bulkEdit);
        });
      } else {
        this.persistAndNavigate(bulkEdit);
      }
    } else if (UtilsService.notNull(this.subsFlow.model['selected']) && this.subsFlow.model['selected'].length > 0) {
      this.subscriberNotify.clearNotification();
      this.subsFlow.next(this.subsFlow.model);
    } else {
      this.printErrorMsg();
    }
  }

  persistAndNavigate(bulkEdit) {
    this.subscriberSelectionService.persistSubscribersForUpdate(this.getLazyParams()).then(data => {
      this.subscriberTable.selectedMap = new Map();
      this.getCountNavigateNext(bulkEdit);
    });
  }

  getLazyParams(): LazyParams {
    let selectedMap = this.subscriberTable.selectedMap;
    let selections = selectedMap.size ? Array.from(selectedMap.values()) : [];
    let lazyParams = new LazyParams();
    lazyParams['configId'] = this.configId;
    lazyParams['selections'] = selections;
    lazyParams['selectAll'] = this.subscriberTable.selectAll ? 'true' : 'false';

    return lazyParams;
  }

  getSocs(socs: string) {
    if (UtilsService.notNull(socs)) {
      return socs.split(';');
    } else {
      return [];
    }
  }

  private sortByBasePrice(a, b, event) {
    let order1 = a['27'] ? a['27'].toString().replace(',', '.').trim() : null;
    let order2 = b['27'] ? b['27'].toString().replace(',', '.').trim() : null;
    let result = null;
    let value1 = order1 ? parseFloat(order1) : null;
    let value2 = order2 ? parseFloat(order2) : null;
    if (value1 == null && value2 != null) {
      result = -1;
    } else if (value1 != null && value2 == null) {
      result = 1;
    } else if (value1 == null && value2 == null) {
      result = 0;
    } else {
      result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    }
    return (event.order * result);
  }

  getCountNavigateNext(bulkEdit: boolean) {
    let selectCount = 0;
    this.subscriberSelectionService.getSelectCount(this.manageSubsConfigId).then(data => {
      selectCount = data && data.count ? data.count : 0;
      this.processing = false;
      if (selectCount) {
        this.subscriberNotify.clearNotification();
        this.subsFlow.model.selectCount = selectCount;
        let reviewMsg = this.translation.translate('REVIEW-BULK_EDIT_INFO_MESSAGE',
          {selectCount: selectCount});
        this.subsFlow.model.reviewMsg = reviewMsg;
        this.hasChanged = !this.hasChanged;
        this.subsFlow.model.hasChanged = this.hasChanged;
        // this checks for single subscriber
        this.subsFlow.model.singleEdit = bulkEdit;
        this.subsFlow.model.uploadChanges = false;
        this.subsFlow.next(this.subsFlow.model);
      } else {
        this.printErrorMsg();
      }
    });
  }


  printErrorMsg() {
    this.processing = false;
    this.subscriberNotify.printErrorNotification('VALIDATION_MSG-NONE_SELECTED_ERROR');
  }

  processDrop(files: NgxFileDropEntry[]) {
    const fileEntry = files[0].fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => this.processCsvUpload(files, [file]));
  }

  processCsvUpload(event, files) {
    this.resetUpload();

    if (files && files.length) {
      const file: File = files[0];

      if (!file.name.endsWith('.csv')) {
        this.csvError = 'WRONG_FILE_FORMAT';
        return;
      }

      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.processCsv(reader.result);
        if (event.target) {
          event.target.value = '';
        }
      }
    }
  }

  downloadErrorCsv() {
    const fileName = 'CDAError.csv';
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(this.errorCsvFile.blob, 'CDAError.csv');
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(this.errorCsvFile.blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  disableCda() {
    this.subsFlow.model.cdaSelection = false;
    this.resetUpload();
  }

  private processCsv(csv) {
    this.resetUpload();

    const csvLines = csv.split('\n');
    const csvList = csvLines.slice(1);
    const subscribers = csvList.map(c => {
      if (c.trim() !== '') {
        const subNumber = c.split(';')[2];
        return subNumber ? subNumber.replace(/"/g, '') : false;
      }
    });

    let toSelect = [], notFoundIndexes = [];

    subscribers.forEach((subNumber, i) => {
      if (UtilsService.notNull(subNumber)) {
        const sub = this.subscribers.find(s => s[2].toString() === subNumber.toString().replace(/^0+/, ''));
        if (sub) {
          toSelect.push(sub);
        } else {
          notFoundIndexes.push(i);
        }
      }
    });

    this.csvSelectCount = toSelect.length;
    if (toSelect.length) {
      const currentSelection = new Set(this.subsFlow.model.selected);
      toSelect.forEach(s => currentSelection.add(s));
      this.subsFlow.model.cdaSelection = true;
      this.subsFlow.model.selected = Array.from(currentSelection);

      setTimeout(() => {
        this.subscriberTable.resetAllFilters();
        this.subscriberTable.filtering(null);
        const dt = this.subscriberTable.dt;
        dt.sortOrder = 1;
        dt.sortField = '_sncrChecked';
      }, 0);
    }

    if (notFoundIndexes.length) {
      let errorCsv = csvLines.slice(0, 1);
      notFoundIndexes.forEach(i => errorCsv += '\n' + csvList[i]);
      const blob = new Blob([errorCsv], {type: 'data:text/csv;charset=utf-8'});
      this.errorCsvFile = {blob: blob, count: notFoundIndexes.length};
    }

    this.uploading = false;
  }

  private resetUpload() {
    this.errorCsvFile = {blob: null, count: 0};
    this.csvError = null;
    this.csvSelectCount = -1;
    this.uploading = false;
  }

  updateFlowEvent(event) {
    this.onDataChange.emit(event);
  }
}
