import {Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DataReportService} from './data-rerport.service';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {Filter} from '../sncr-components/sncr-datatable/filter/filter';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TimeoutService} from '../app/timeout/timeout.service';
import {SavedReportOptions} from './model/savedreportoptions';
import {Language, TranslationService} from 'angular-l10n';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {DataSelectionService} from '../data-selection/data-selection.service';
import {DataReportConstants} from './model/constants';
import {LazyParams} from '../sncr-components/sncr-datatable/lazy-params';
import {DownloadParams} from '../sncr-components/sncr-download-selections/downloadParams';
import {TopBarService} from '../app/top-bar/top-bar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'data-report',
  templateUrl: 'data-report.component.html',
  styleUrls: ['data-report.component.scss']
})
export class DataReportComponent implements OnInit, OnDestroy {

  @ViewChild('dataTable') dataTableComponent: SncrDatatableComponent;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('overridecontent') overrideContent: TemplateRef<any>;
  @ViewChild('delete') deleteContent: TemplateRef<any>;

  @Language() lang: string;

  private modalRef: NgbModalRef;
  constants: DataReportConstants;

  processing = false;
  isTemplateDelete = false;
  currentReport: any;
  filterOptions = {basicReport: [], savedReport: []};
  loading = false;
  reports: any;
  selectedOption: any = '';
  selection = [];
  searchText: string;
  private savedReportOptions: any[];
  lazyLoadUrl: any;
  lazy: boolean;
  currentSelectedModel: any;
  isExistingTemplate: boolean;
  shopName: string;
  showDelete = false;
  reportOptions: any;
  downloadParam = new DownloadParams();
  alertNotify: NotificationHandlerService;
  saveReport: boolean;

  vfShopSelected: boolean;
  vfUser = false;
  vfLoading = true;

  resultMessage = [];
  selectionMessage = [];
  dtDataLoading = false;

  pattern = /^[äöüÄÖÜßa-zA-Z0-9 . \- ! # & '() + , : _]*$/;

  private onDTLoadingSubscription: Subscription;

  constructor(private dataReportService: DataReportService,
              private modalService: NgbModal,
              private timeoutService: TimeoutService,
              private topBarService: TopBarService,
              public translation: TranslationService,
              @Inject('NotificationHandlerFactory') public notificationHandlerFactory,
              private dataSelectionService: DataSelectionService) {
  }

  ngOnInit(): void {
    this.lazy = false;
    this.currentReport = {selected: false, cols: []};
    this.alertNotify = this.notificationHandlerFactory();
    this.constants = new DataReportConstants;
    this.vfShopSelected = false;
    this.topBarService.getData()
      .then(response => {
        this.vfUser = response.vfUser;
        if (!this.vfUser) {
          this.shopName = this.timeoutService.topBar.shop.name;
          this.loadReportData();
          this.setDownloadParams();
        }
        this.vfLoading = false;
      });
  }

  dataTableMessages(name) {
    this.resultMessage = ['Keine Ergebnisse gefunden', 'Eine Ergebnisse gefunden', 'Ergebnisse gefunden'];
    this.selectionMessage = ['Keine Ergebnisse ausgewählt', 'Alle Ergebnisse ausgewählt', 'Ergebnissen ausgewählt', name, name];
  }

  selectedShop(event: any) {
    if (event.data.reportConfig.toUpperCase() === 'Y') { // handle bad data FIX! (meet min criteria)
      this.dataReportService.banCount(event.data.shopId, event.data.contract).then(resp => {
        if (resp > 0) {
          let shopDto = {
            shopId: event.data.shopId,
            skeletonContractNo: event.data.contract,
            shopName: event.data.shopName
          };
          this.setSelectedShopToSession(shopDto);
        } else {
          this.alertNotify.printSuccessNotification(this.translation.translate('DATA_REPORT-CUSTOMER-NO-SHOP-ASSIGNED'));
        }
      });
    }
  }


  setSelectedShopToSession(shopDto) {
    this.dataReportService.setSelectedShopToSession(shopDto).then(resp => {
      if (resp) {
        this.shopName = shopDto.shopName;
        this.vfShopSelected = true;
        this.loadReportData();
        this.setDownloadParams();
      }
    }).catch((ex) => {
      this.alertNotify.printErrorNotification(ex);
    });
  }

  onModelChange(option) {
    this.dataTableComponent.selectedMap = new Map();
    this.loading = this.dtDataLoading = true;
    this.isTemplateDelete = false;
    this.currentReport.selected = true;
    this.selectedOption = option;
    const optionObj = this.currentSelectedModel = option, name = optionObj.type;
    this.showDelete = optionObj.group === 'saved';
    this.resetDTComponent();
    this.alertNotify.clearNotification();
    this.dataTableComponent.lazyLoadUrl = this.constants.dataReportConfigIds.lazyUrl + this.constants.dataReportConfigIds[name];
    this.downloadParam.reportKey = this.constants.sortSavedReport[name];
    this.dataTableMessages(optionObj.type);
    this.lazy = true;
    this.dataSelectionService.clearShoppingCart().then(() => this.dataSelectionService.getColumns(this.constants.dataReportConfigIds[name])
      .then(cols => {
        this.setBanToString(cols);
        if (optionObj.group === 'saved') {
          this.savedReports(name, optionObj, cols);
        } else {
          this.basicReports(name, optionObj, cols);
        }
        this.getLoadingDataStatus();
      }).catch((ex) => {
        this.alertNotify.printErrorNotification(ex);
      }));

  }

  getLoadingDataStatus() {
    this.onDTLoadingSubscription = this.dataTableComponent.getDtDataLoadFocus().subscribe(focus => {
      this.dtDataLoading = focus;
      if (!focus) {
        this.onDTLoadingSubscription.unsubscribe();
      }
    });
  }

  setBanToString(cols) {
    if (cols.find(c => c['field'] === '1') && this.lazy) {
      cols.find(c => c['field'] === '1')['type'] = 'text';
    }
  }

  basicReports(name, optionObj, cols) {
    this.showDelete = false;
    this.currentReport.cols = cols;
    this.downloadParam.configId = this.constants.dataReportConfigIds[name];
    this.dataTableComponent.initNotLoaded = true;
    this.dataTableComponent.resetAllFilters();
    this.loading = false;
  }

  savedReports(name, optionObj, cols) {
    this.downloadParam.configId = this.constants.dataReportConfigIds[name];
    this.applyFilters(optionObj, cols);
  }

  resetDTComponent() {
    this.reports = {};
    this.dataTableComponent.cols = [];
    this.dataTableComponent.value = [];
    this.dataTableComponent.previousSort = [];
    this.dataTableComponent.dt.sortField = '1';
    this.dataTableComponent.dt.sortOrder = 1;
  }

  setDownloadParams() {
    this.downloadParam.notificationHandler  = this.alertNotify;
    this.downloadParam.url = '/buyflow/rest/exportfile/csv';
  }

  onToggleSelection(event: any) {
    this.processing = event ? event.loading : false;
  }

  loadReportData() {
    this.dataReportService.getReport().then(data => {
      const basic = data[0].basicReportOptions;
      this.savedReportOptions = data[0].savedReportOptions;
      this.filterOptions = {
        basicReport: Object.keys(basic).filter(k => basic[k] === 'Y').map(b => {
          let report: any = {group: 'basic', name: b, type: b, sortVal: this.constants.sortSavedReport[b]};
          report.stringified = JSON.stringify(report);
          return report;
        }).sort((a, b) => {
          return (a.sortVal < b.sortVal) ? -1
            : (a.sortVal > b.sortVal) ? 1 : 0;
        }),
        savedReport: this.savedReportOptions.map(s => {
          let report: any = {
            group: 'saved',
            type: s.reportType,
            name: s.reportName,
            searchOptions: s.searchOptions,
            columnFilterOptions: s.columnFilterOptions,
            columnSortOptions: s.columnSortOptions
          };
          report.stringified = JSON.stringify(report);
          return report;
        }).sort((a, b) => {
          return a.name.toString().localeCompare(b.name.toString());
        })
      };
    });
  }

  private applyFilters(optionObj: any, cols: any) {
    if (optionObj.group === 'saved') {
      const columnSortOptions = JSON.parse(optionObj.columnSortOptions);
      this.showDelete = true;
      setTimeout(() => {
        this.dataTableComponent.initNotLoaded = true;
        this.dataTableComponent.dt.sortField = columnSortOptions.sortField;
        this.dataTableComponent.dt.sortOrder = columnSortOptions.sortOrder;
        this.dataTableComponent.previousFilters =
          this.parseFilters(JSON.parse(optionObj.columnFilterOptions.replace(/'/g, '"')));
        let savedCols = JSON.parse(optionObj.searchOptions.replace(/'/g, '"'));
        cols.map((col, i) => {
          let savedCol = savedCols.find(f => f.field === col.field);
          if (savedCol && savedCol.field === '1') {
            savedCol.type = 'text';
          }
          col.show = false;
          cols[i] = savedCol ? savedCol : col;
        });
        this.currentReport.cols = cols;
        this.dataTableComponent.goToFirstPage();
        this.loading = false;
      });
    }
  }

  private parseFilters(filters: any): Filter[] {
    return Object.keys(filters).map(k => {
      filters[k]['saved'] = true;
      return filters[k];
    });
  }

  openPopUp() {
    this.searchText = '';
    this.isExistingTemplate = false;
    this.modalRef = this.modalService.open(this.content);
  }

  deletePopUp() {
    this.modalRef = this.modalService.open(this.deleteContent);
    this.reportOptions = new SavedReportOptions();
    const selectedReport = this.selectedOption;
    this.reportOptions.reportName = selectedReport['name'];
  }

  private deleteSavedTemplate() {
    this.dataReportService.deleteSavedSearch(this.reportOptions).then(response => {
      if (response) {
        this.modalRef.close();
        this.selectedOption = '';
        this.showDelete = false;
        let index = this.filterOptions.savedReport.findIndex(v => v.name === this.reportOptions.reportName);
        if (index !== -1) {
          this.filterOptions.savedReport.splice(index, 1);
        }
        this.isTemplateDelete = true;
        this.resetDTComponent();
        this.currentReport.selected = false;
        this.selectedOption = '';
        this.alertNotify.printSuccessNotification(this.translation.translate('DATA_REPORT-DELETE_TEMPLATE-SUCCESS'));
      }
    }).catch((ex) => {
      this.alertNotify.printErrorNotification(ex);
    });
  }

  selectedTemplate(s) {
    this.searchText = s.name;
    this.isExistingTemplate = true;
    this.setReportOptions(s.type);
  }

  private existingTemplate() {
    this.modalRef.close();
    if (this.isExistingTemplate && this.filterOptions.savedReport.find(value => value.name === this.searchText)) {
      this.modalRef = this.modalService.open(this.overrideContent);
    } else {
      this.saveTemplate();
    }
  }

  private updateExistingTemplate() {
    if (this.reportOptions) {
      this.setReportOptions(this.currentSelectedModel.type);
      this.dataReportService.persistSavedReport(this.reportOptions).then(response => {
        if (response) {
          this.updateSavedReport(this.reportOptions);
          this.alertNotify.printSuccessNotification(this.translation.translate('DATA_REPORT-UPDATE_TEMPLATE-SUCCESS'));
        }
      }).catch((ex) => {
        this.alertNotify.printErrorNotification(this.translation.translate('DATA_REPORT-UPDATE_TEMPLATE-ERROR'));
      });
      this.modalRef.close();
    }
  }

  setReportOptions(name) {
    let filter = this.dataTableComponent.previousFilters.map(a => Object.assign({}, a));
    this.reportOptions = {
      reportName: this.searchText,
      reportType: name,
      searchOptions: JSON.stringify(this.dataTableComponent.currentCols),
      columnFilterOptions: JSON.stringify(filter),
      columnSortOptions: JSON.stringify({
        sortField: this.dataTableComponent.lazyParams.sortField,
        sortOrder: this.dataTableComponent.lazyParams.sortOrder
      })
    };
  }

  private saveTemplate() {
    this.isExistingTemplate = false;
    this.saveReport = true;
    this.setReportOptions(this.currentSelectedModel.type);
    this.dataReportService.persistSavedReport(this.reportOptions).then(response => {
      if (response) {
        this.saveReport = false;
        this.updateSavedReport(this.reportOptions);
        this.modalRef.close();
        this.alertNotify.printSuccessNotification(this.translation.translate('DATA_REPORT-UPDATE_TEMPLATE-SUCCESS'));
      }
    }).catch((ex) => {
      this.alertNotify.printErrorNotification(ex);
    });
  }

  private updateSavedReport(reportOptions) {
    let report: any = {
      group: 'saved',
      type: reportOptions.reportType,
      name: reportOptions.reportName,
      searchOptions: reportOptions.searchOptions,
      columnFilterOptions: reportOptions.columnFilterOptions,
      columnSortOptions: reportOptions.columnSortOptions
    };
    report.stringified = JSON.stringify(report);
    let index = this.filterOptions.savedReport.findIndex(v => v.name === report.name);
    if (index !== -1) {
      this.filterOptions.savedReport.splice(index, 1);
    }
    this.filterOptions.savedReport.push(report);
    this.filterOptions.savedReport.sort((a, b) => {
      return a.name.toString().localeCompare(b.name.toString());
    });
    this.selectedOption = report;
    this.showDelete = true;
  }

  invalidNameExists(value): boolean {
    if (value.match(this.pattern)) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.onDTLoadingSubscription) {
      this.onDTLoadingSubscription.unsubscribe();
    }
  }

}
