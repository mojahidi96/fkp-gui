import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit
} from '@angular/core';
import {NgbDateStruct, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UtilsService} from '../../../../sncr-components/sncr-commons/utils.service';
import {LandingPageService} from './landing-page.service';
import {Column} from '../../../../sncr-components/sncr-datatable/column';
import {NotificationHandlerService} from '../../../../sncr-components/sncr-notification/notification-handler.service';
import {LazyParams} from '../../../../sncr-components/sncr-datatable/lazy-params';
import {Filter} from '../../../../sncr-components/sncr-datatable/filter/filter';
import {LandingPageConfig} from './landing-page-config';
import {DatepickerParserService} from '../../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {EdOrderManagerModel, EdOrderManagerState} from './landing-page-store/landing-page-orders.store';
import {
  DatatableRequestPayload, LoadColumns, LoadData, SelectionChange, ShowLoader
} from '../../../../sncr-components/sncr-datatable/store/datatable.actions';
import {CustomValidators} from '../../../../sncr-components/sncr-controls/custom-validators';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {PageScrollInstance, PageScrollService} from 'ngx-page-scroll';
import {
  DownloadHistory,
  DownloadUOF,
  OrderStatusChange
} from './landing-page-store/landing-page-orders.actions';
import {Language, TranslationService} from 'angular-l10n';
import {EDOrderDetailsService} from '../../ed-order-details/ed-order-details.service';
import {RouterService} from '../../../../sncr-components/sncr-commons/route.service';
import {FilterRestoreService} from '../../../../sncr-components/sncr-commons/filter-restore.service';
import {SncrDatatableOpComponent} from '../../../../sncr-components/sncr-datatable/sncr-datatable-op.component';

/**
 * component with view for default set of orders in error state displayed in table
 * advanced search filter to filter the orders based on search criteria
 * component class to handle the business logic for OM functionality
 */
@Component({
  selector: 'ed-om-landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {

  static readonly COMPARE_EQUAL = 'EQ';
  static readonly LOGICAL_AND = 'AND';

  @ViewChild('orderNo') orderNo;
  @ViewChild('msgContentModal') msgContentModal: NgbModal;
  @Select(EdOrderManagerState) OrderManagerState$: Observable<EdOrderManagerModel>;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('overridecontent') overrideContent: TemplateRef<any>;
  @ViewChild('delete') deleteContent: TemplateRef<any>;
  @ViewChild('filterMsgModal') filterMsgModal: TemplateRef<any>;
  @ViewChild('omLandingPage') dataTableComponent: SncrDatatableOpComponent;


  @Language() lang;

  modalRef: NgbModalRef;

  shopName: string;
  isTemplateDelete = false;
  loading = false;
  dtDataLoading = false;
  selectedSavedFilter: any = '';
  showDelete = false;
  advancedSearchForm: FormGroup;
  columns: Array<Column> = [];
  processing = false;
  alertNotify: NotificationHandlerService;
  fieldOptions = {};
  orderStatusList = [];
  disableSubmitButton = true;
  statusSearch = [];
  readonly configId = '79ff53c1-7d62-1cdc-e053-1505100ac187';
  sortField = '2';
  sortOrder = -1;
  private advancedSearch = false;
  private error = false;
  private orderLocked = false;
  private noOrderSelected = false;
  private eligibilityFailed = false;
  readonly advancedSearchFields: any = LandingPageConfig.advancedSearchFields;
  toggle = false;
  public filters: Filter[];
  private patternMap: any;
  private defaultFormData: any;
  private scrollConfig: any = {};
  orderStatusForm: FormGroup;
  advSearchFilter = false;
  readonlyUser = false;
  private dateFieldSubscription: Subscription;
  private statusSubscription: Subscription;
  private dataTableSubscription: Subscription;
  private routeSubscription: Subscription;
  public vodafoneAccountManager: boolean;
  saveReport: boolean;
  sessionData: {
    filters: any[]; advancedSearchfilters: any[]; cols: any[]; selectOrderCount: number; orderIdSet: Set<string>;
    statusCountMap: Map<string, number>; orderStatusList: any[]
  };
  disablehistory = false;
  disableUOF = false;
  private updateOrder: boolean;
  private messageKey: string;
  statusMap = [];
  orderIdSet = new Set<string>();
  selectCount = 0;
  statusCountMap = new Map<string, number>();
  shopNames: Array<any> = [];
  vfUser = false;
  noSelectionChange = true;
  previousFilters: Array<any> = [];
  savedFilters: Array<any>;
  searchText: string;
  isExistingTemplate: boolean;
  dtFilters: Array<any>;

  pattern = /^[äöüÄÖÜßa-zA-Z0-9 . \- ! # & '() + , : _]*$/;
  showFilterReset = false;
  templateApplied = false;
  customSortField = '2';
  customSortOrder = -1;
  rows = 10;
  columnsWithoutBT = [];
  filterMessage: any;
  isAdvancedSearchFilter: boolean;
  public consolidatedDtFilters = [];
  nonEmptyFils = false;

  constructor(private formBuilder: FormBuilder, private landingPageService: LandingPageService,
              private datepickerParserService: DatepickerParserService, private store: Store,
              private edOrderDetailsService: EDOrderDetailsService, private router: Router,
              private routerService: RouterService, private filterRestoreService: FilterRestoreService,
              public translation: TranslationService,
              private cdr: ChangeDetectorRef, private route: ActivatedRoute, private modalService: NgbModal,
              @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService,
              @Inject('NotificationHandlerFactory') public notificationHandlerFactory) {

  }

  ngOnInit(): void {
    // load the columns
    this.alertNotify = this.notificationHandlerFactory();
    this.rows = 10;
    let fnUser = this.edOrderDetailsService.getFnUser();
    this.sessionData = this.landingPageService.getSessionData();
    this.dtFilters = this.filterRestoreService.getAllFilters() || [];
    this.landingPageService.getSavedFilters().then(filters => {
      this.savedFilters = filters || [];
    }).catch(err => {
      this.savedFilters = [];
    });


    // get the shopNames for advanced search prediction
    this.landingPageService.getFieldOptions().subscribe(fieldOptions => {
      this.fieldOptions = fieldOptions;
    });

    // get the complete status list
    this.landingPageService.getOrderStatusList().subscribe(orderStatusList => {
      this.statusMap = orderStatusList;
    });

    this.filters = [];

    this.routeSubscription = this.route.data.subscribe((data: { pattern: any }) => {
      this.patternMap = data.pattern ? data.pattern : '';
    });

    this.createForm();
    this.createStatusForm();
    this.subscribeDateField();

    this.statusSubscription = this.orderStatusForm.valueChanges.subscribe(val => {
      if (val.status !== '' || val.message !== '') {
        this.disableSubmitButton = false;
      } else {
        this.disableSubmitButton = true;
      }
    });
    if (fnUser) {
      this.readonlyUser = fnUser.isReadOnlyUser;
      this.vfUser = fnUser.vfUser;
    }

    this.scrollConfig = {
      document: this.document,
      scrollTarget: '#table',
      pageScrollOffset: 10,
      scrollingViews: [document.documentElement, document.body, document.body.parentNode]
    };

    this.dataTableSubscription = this.OrderManagerState$.subscribe(value => {
      this.processing = value.processing || value.selectAllLoading;
      let cols = value.cols;
      this.setColumnTemplate(cols, '16', this.orderNo);
      this.error = value.error;
      this.noOrderSelected = value.noOrderSelected;
      this.eligibilityFailed = value.eligibilityFailed;
      this.orderLocked = value.orderLocked;
      this.messageKey = value.messageKey;
      this.updateOrder = value.updateOrder;
      if (this.updateOrder || this.error || this.noOrderSelected || this.eligibilityFailed || this.orderLocked) {
        this.openModal();
      }
    });


    this.landingPageService.checkUserRole('vodafone account manager').subscribe(res => {
      this.vodafoneAccountManager = res;
      if (this.vfUser || this.vodafoneAccountManager) {
        // Ap Shop List
        this.landingPageService.getShopList().subscribe(response => {
          this.shopNames = this.reformatDropdownArray(response, 'shopName');
        });
      }
    });

    if (this.routerService.getPreviousUrl() === '/ed/orderdetails' &&
      UtilsService.notNull(sessionStorage.getItem('restoreSession')) &&
      sessionStorage.getItem('restoreSession') === 'true') {
      this.landingPageService.clearCartStatusDetails();
      this.selectedSavedFilter = this.filterRestoreService.getTemplate();
    } else {
      this.filters = [];
      this.dtFilters = [];
      this.filterRestoreService.filterRemoved('', true);
      this.filterRestoreService.viewOptionRemoved();
      this.filterRestoreService.setTemplate('');
      this.landingPageService.clearSessionData();
      this.store.dispatch(new LoadColumns({lazy: true}));
    }
  }

  ngAfterViewInit() {
    if (this.routerService.getPreviousUrl() === '/ed/orderdetails' &&
      UtilsService.notNull(sessionStorage.getItem('restoreSession')) &&
      sessionStorage.getItem('restoreSession') === 'true') {
      if (this.selectedSavedFilter) {
        this.dataTableComponent.resetPrevFilters();
        this.onModelChange(this.selectedSavedFilter, false);
      } else {
        this.restorePreviousFilters();
      }
    }
  }

  resetSearchForm(): void {
    this.advancedSearchForm.reset();
    this.filters = [];
    this.createForm();
    this.subscribeDateField();
  }

  subscribeDateField(): void {
    this.dateFieldSubscription = this.advancedSearchForm.get(this.advancedSearchFields.orderCreated.field).valueChanges.subscribe(val => {
      if (val && val === '2') {
        this.enableFields(this.advancedSearchForm, [this.advancedSearchFields.fromDate.field, this.advancedSearchFields.toDate.field]);
      } else {
        this.disableFields(this.advancedSearchForm, [this.advancedSearchFields.fromDate.field, this.advancedSearchFields.toDate.field]);
      }
    });
  }

  reformatDropdownArray(data: Array<any>, field: string): any[] {
    return data.map(element => {
      if (element[field]) {
        element.data = element[field];
      }
      return element;
    });
  }

  createForm() {
    let formObj = {};
    // iterate through the object keys then assign it to a object
    // which can be passed into the formBuilder
    Object.keys(this.advancedSearchFields).forEach((key: any) => {
      let searchField = {...this.advancedSearchFields[key]};
      let validators = [];
      if (searchField.field === this.advancedSearchFields.orderCreated.field) {
        // make sure to select the radio with value as 1
        searchField.defaultValue = '1';
      }
      if (searchField.field === this.advancedSearchFields.durationDays.field) {
        // on load set the date field with '0' means no time limit.
        searchField.defaultValue = '0';
      }
      if (searchField.field === this.advancedSearchFields.fromDate.field
        || searchField.field === this.advancedSearchFields.toDate.field) {
        // fromDate and toDate add range validator
        validators.push(this.doDateRangeValidations(), Validators.required);
      }
      validators.push(CustomValidators.sanitization(this.patternMap));
      formObj[searchField.field] = [searchField.defaultValue, validators];
    });

    // build the form instance using the formBuilder by passing formObj that we have constructed
    this.advancedSearchForm = this.formBuilder.group({...formObj});
    // disable the date range fields
    this.disableFields(this.advancedSearchForm, [this.advancedSearchFields.fromDate.field, this.advancedSearchFields.toDate.field]);
    // set the default object
    this.defaultFormData = {...this.advancedSearchForm.value};
  }

  createStatusForm(): void {
    // create the status form data object
    this.orderStatusForm = this.formBuilder.group(
      {
        'status': [''],
        'message': ['', [Validators.maxLength(1000), CustomValidators.sanitization(this.patternMap)]]
      }
    );
  }


  search() {
    // capture the form values and make an API call to search based on user requested search data
    if (this.advancedSearchForm && this.advancedSearchForm.valid) {
      this.selectedSavedFilter = '';
      this.filterRestoreService.setTemplate('');
      this.filterRestoreService.filterRemoved('', true);
      this.advancedSearch = true;
      this.showFilterReset = false;
      this.showDelete = false;
      this.store.dispatch(new ShowLoader());
      let formValue = this.advancedSearchForm.value;

      // everytime the user clicks search then reset the filters
      this.filters = [];
      this.dtFilters = [];
      Object.keys(this.advancedSearchFields).forEach((key) => {
        // If defaultValue is not same as formField value then
        // we can consider that field is changed by the user
        let searchField = this.advancedSearchFields[key];
        if (formValue[searchField.field] !== searchField.defaultValue) {
          // ignored fields should be considered for a separate logic to calculate the values
          if (!searchField.ignore
            && !searchField.compoundFields) {
            let fieldComparator = searchField.comparator ? searchField.comparator : LandingPageComponent.COMPARE_EQUAL;
            this.createFilters(this.createFilter(searchField,
              [{comparator: fieldComparator, filter: formValue[searchField.field]}]));
          } else if (UtilsService.notNull(searchField.compoundFields)) {
            // separate logic to get the filter object when user have selected
            // advanced search date ranges
            this.createFilters(this.createDateRangeFilter(searchField, formValue));
          }
        }
      });

      // scroll to data table of the page whenver search criteria is entered
      // so that user can see the results in the data table
      const pageScrollInstance = PageScrollInstance.newInstance(this.scrollConfig);
      this.pageScrollService.start(pageScrollInstance);
      this.advSearchFilter = true;
      this.landingPageService.updateSessionAdvancedSearchFilters(this.filters);
    }
  }

  toggleSelection(event: any) {
    this.processing = event ? event.loading : false;
  }

  createFilter(searchField: any, comparatorFilter: any[]) {
    let filter = new Filter();
    filter.column = searchField.field;
    filter.type = searchField.type;

    filter.comparator1 = comparatorFilter[0].comparator;
    filter.filter1 = comparatorFilter[0].filter;
    if (comparatorFilter && comparatorFilter.length > 1) {
      filter.comparator2 = comparatorFilter[1].comparator;
      filter.filter2 = comparatorFilter[1].filter;
      filter.logicalOperation = LandingPageComponent.LOGICAL_AND;
    }
    return filter;
  }

  createDateRangeFilter(searchField: any, formValue: any) {
    let comparatorFilter = [];
    // selected radio button val should be passed into compoundField
    // compound field will have keys with 1 & 2 with respective radio values
    if (searchField && UtilsService.notNull(searchField.compoundFields)) {
      const selectedRadioControl: any = searchField.compoundFields[formValue[searchField.field]];
      Object.keys(selectedRadioControl).forEach((control: any) => {
        // take the individual control value and then push it to an array
        let dateFieldObjVal = formValue[control];
        if (formValue[searchField.field] === '1' && dateFieldObjVal !== '0') {
          // if user have selected last 30days as their filter
          dateFieldObjVal = this.getDate(30, null);
        }
        if (dateFieldObjVal !== '0') {
          let dateTime = this.datepickerParserService.toNumber(dateFieldObjVal);
          comparatorFilter.push({comparator: selectedRadioControl[control].comparator, filter: dateTime});
        }
      });
    }
    return comparatorFilter.length ? this.createFilter(searchField, comparatorFilter) : null;
  }


  onLazyLoad(event) {
    this.nonEmptyFils = false;
    this.nonEmptyFils = event.lazyParams.filters.some(fil => {
      return fil.filter1 !== '';
    })
    let shouldLazyLoad = this.checkLazyLoad(event);
    this.filterRestoreService.getPageRows().subscribe(row => {
      if (row) {
        event.lazyParams.rows = row;
        this.rows = row;
      }
    });
    this.advSearchFilter = false;
    if (UtilsService.notNull(event) && UtilsService.notNull(event.lazyParams)) {
      this.consolidateFilters(event.lazyParams.filters);
      this.isAdvancedSearchFilter = this.dtFilters.some(dfilter => {
        return dfilter.comparator1 !== 'INC';
      })
      // table filters must consider the advanced search filters if any
      event.lazyParams.filters = [...this.dtFilters, ...this.filters];
      event.lazyParams.advancedSearch = this.isAdvancedSearchFilter || event.lazyParams.advancedSearch || this.advancedSearch;
      event.lazyParams.sortField = this.getSortField(event.lazyParams.sortField);
      this.sortField = this.customSortField = event.lazyParams.sortField;
      this.sortOrder = this.customSortOrder = event.lazyParams.sortOrder;
      this.filterRestoreService.setFlowFilters(event.lazyParams.filters);
      if (shouldLazyLoad) {
        this.store.dispatch(new LoadData(event));
      }
    }
  }

  onSelectionChange(event) {
    this.disablehistory = false;
    this.disableUOF = false;
    this.noSelectionChange = false;
    this.store.dispatch(new SelectionChange(event));
    this.getStatusList();
  }

  onColumnChange(event) {
    this.columns = event;
    this.removeColumnTemplate(event, '16')
    this.store.dispatch(new LoadColumns({lazy: false, columns: event}));
    this.landingPageService.updateSessionColumns(this.columns);
  }

  getLazyParamObject(filters: Filter[]): DatatableRequestPayload {
    let lazyParams = new LazyParams();
    lazyParams.configId = this.configId;
    lazyParams.sortField = this.sortField;
    lazyParams.sortOrder = this.sortOrder;
    lazyParams.first = 0;
    lazyParams.rows = 10;
    lazyParams.filters = [...filters];
    // whenever we have this method called then add advancedSearch attr as true
    lazyParams.advancedSearch = this.advancedSearch;
    return {lazyParams: lazyParams};
  }

  /**
   * Method to get the date as per arguement @days
   * if 30 days then it will calculate the sysdate-30days and gets the last date
   * if -30 days then it will calculate the sysdate+30days and gets the next date
   *
   * @dateTime is the miliseconds time value if available then use the same for calculation
   * @param {number} days
   */
  getDate(days: number, dateTime: number): NgbDateStruct {
    if (!dateTime) {
      dateTime = new Date().getTime();
    }
    let last = new Date(dateTime - (days * 24 * 60 * 60 * 1000));

    let day = last.getUTCDate();
    let month = last.getUTCMonth() + 1;
    let year = last.getUTCFullYear();

    return {
      day, month, year
    };
  }


  createFilters(filter: Filter) {
    if (filter) {
      this.filters.push(filter);
    }
  }


  advancedSearchToggle() {
    this.toggle = !this.toggle;
  }


  doDateRangeValidations(): ValidationErrors | null {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [groupControls[this.advancedSearchFields.fromDate.field],
          groupControls[this.advancedSearchFields.toDate.field],
          groupControls[this.advancedSearchFields.orderCreated.field]];

        const [fromDateControl, toDateControl] = fieldGroups;
        let error = {};

        if (fromDateControl && fromDateControl.dirty && fromDateControl.value &&
          toDateControl && toDateControl.dirty && toDateControl.value) {
          let fromDateTime = this.datepickerParserService.toNumber(fromDateControl.value);
          let toDateTime = this.datepickerParserService.toNumber(toDateControl.value);
          if (fromDateTime > toDateTime) {
            error = {fromDateError: true};
          } else {
            error = null;
            fromDateControl.setErrors(error);
            toDateControl.setErrors(error);
          }
          setTimeout(() => {
            if (control === fromDateControl && error) {
              toDateControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
            } else if (error) {
              fromDateControl.updateValueAndValidity({onlySelf: true, emitEvent: false});
            }
            this.cdr.detectChanges();
          });
        }
        return error;
      }
    };
  }


  orderStatusChange() {
    if (this.orderStatusForm && this.orderStatusForm.valid && this.orderStatusForm.value) {
      if (this.orderStatusForm.get('status').value !== '' || this.orderStatusForm.get('message').value) {
        this.processing = true;
        let statusRequest: any = {};
        statusRequest['22'] = this.orderStatusForm.get('status').value;
        statusRequest['50'] = this.orderStatusForm.get('message').value;
        this.store.dispatch(new OrderStatusChange({
          request: statusRequest
        }));
      }
    }
  }

  enableFields(form: FormGroup, fields: string[]) {
    fields.forEach(field => form.get(field).enable({onlySelf: true, emitEvent: false}));
  }

  disableFields(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.get(field).reset('');
      form.get(field).disable({onlySelf: true, emitEvent: false});
    });
  }

  showorderdetails(e) {
    sessionStorage.setItem('detail', e);
    sessionStorage.setItem('vam', JSON.stringify(this.vodafoneAccountManager));
    this.landingPageService.updateCartStatusDetails(this.selectCount, this.orderIdSet, this.statusCountMap,
      this.orderStatusList);
    this.router.navigate(['ed/orderdetails']);
  }


  openModal() {
    this.processing = false;
    this.modalService.open(this.msgContentModal, {backdrop: 'static', keyboard: false});
  }


  closeModal() {
    // reload the page whenever user clicks ok after he saw the message
    window.location.reload();
  }

  setColumnTemplate(cols: Column[], field: string, template: any) {
    if (cols && cols.find(c => c.field === field) && !cols.find(c => c.field === field).bodyTemplate) {
      cols.find(c => c.field === field).bodyTemplate = template;
    }
  }

  removeColumnTemplate(cols: Column[], field: string) {
    this.columnsWithoutBT = [];
    if (cols && cols.some(c => c.field === field && UtilsService.notNull(c.bodyTemplate))) {
      cols.forEach(col => {
        if (col.field === field) {
          delete col.bodyTemplate;
          let newcol = {
            title: col.title,
            field: col.field,
            sortable: col.sortable,
            show: col.show,
            type: col.type,
            nonEditable: col.nonEditable,
            fieldName: col.fieldName,
            filter: col.filter
          }
          this.columnsWithoutBT.push(newcol);
        } else {
          this.columnsWithoutBT.push(col);
        }
      })
    }
  }

  getSortField(field: string) {
    return field === '20' ? '16' : field;
  }

  downloadHistory(): void {
    if (!this.disablehistory) {
      this.store.dispatch(new DownloadHistory());
      this.disablehistory = true;
    }
  }

  downloadUOFfile(): void {
    if (!this.disableUOF) {
      this.store.dispatch(new DownloadUOF());
      this.disableUOF = true;
    }
  }

  /*removeFilterAndSorting(cols: Column[], field: string) {
    let col = cols && cols.length ? cols.find(c => c.field === field) : null;
    if (col) {
      col.sortable = false;
      col.filter = false;
    }
  }*/

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.dateFieldSubscription.unsubscribe();
    this.dataTableSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }

  restorePreviousFilters() {
    let rowNumber;
    this.filters = this.sessionData.advancedSearchfilters;
    this.filterRestoreService.getPageRows().subscribe(row => {
      rowNumber = row || this.rows;
    });
    this.filterRestoreService.setViewOption(rowNumber);
    if (this.dtFilters.length > 0 || this.filters.length > 0 || rowNumber !== 10) {
      let filterEvent = {
        lazyParams: {
          filters: [...this.dtFilters, ...this.filters],
          sortField: this.customSortField,
          sortOrder: this.customSortOrder,
          first: 0,
          rows: rowNumber,
          globalFilter: null,
          maxSelectKey: 'default-max-selection',
          selectAll: 'false',
          advancedSearch: this.filters.length > 0
        }
      }
      this.onLazyLoad(filterEvent);
    }
    if (this.sessionData.cols.length > 0) {
      this.store.dispatch(new LoadColumns({lazy: false, columns: this.sessionData.cols}));
    }
    this.selectCount = this.sessionData.selectOrderCount;
    this.orderIdSet = this.sessionData.orderIdSet;
    this.statusCountMap = this.sessionData.statusCountMap;
    this.orderStatusList = this.sessionData.orderStatusList;
  }

  getStatusList() {
    this.OrderManagerState$.subscribe(value => {
      if (this.noSelectionChange || value.selectCount === this.selectCount) {
        return;
      } else if (value.selectCount === 0) {
        this.noSelectionChange = true;
        this.selectCount = 0;
        this.orderStatusList = [];
        this.orderIdSet = new Set<string>();
        this.statusCountMap = new Map<string, number>();
        return;
      } else if (value.isSelectAll && (value.selectAll || value.selectCount > 0)) {
        this.noSelectionChange = true;
        this.orderStatusList = value.allOrderStatusList.eligibleStatuses;
        this.orderIdSet = new Set<string>();
        this.statusCountMap = new Map<string, number>();
        value.allOrderStatusList.orderIdList.forEach(entry => {
          this.orderIdSet.add(entry);
        });
        for (let k of Object.keys(value.allOrderStatusList.statusCountMap)) {
          this.statusCountMap.set(k, value.allOrderStatusList.statusCountMap[k]);
        }
        this.selectCount = value.selectCount;
      } else if (value.selectCount > this.selectCount) {
        this.noSelectionChange = true;
        this.selectCount = value.selectCount;
        value.data.forEach(entry => {
          if (entry._sncrChecked && !this.orderIdSet.has(entry['23'])) {
            this.orderIdSet.add(entry['23']);
            let status = entry['22'];
            let count = this.statusCountMap.get(status);
            if (UtilsService.isEmpty(count)) {
              count = 1;
              this.statusCountMap.set(status, count);
              this.getCommonStatus();
            } else {
              count = count + 1;
              this.statusCountMap.set(status, count);
            }
          }
        });
      } else if (value.selectCount < this.selectCount) {
        this.noSelectionChange = true;
        this.selectCount = value.selectCount;
        value.data.forEach(entry => {
          if (!entry._sncrChecked && this.orderIdSet.has(entry['23'])) {
            this.orderIdSet.delete(entry['23']);
            let status = entry['22'];
            let count = this.statusCountMap.get(status) - 1;
            if (count === 0) {
              this.statusCountMap.delete(status);
              this.getCommonStatus();
            } else {
              this.statusCountMap.set(status, count);
            }
          }
        });
      }
    });
  }

  getCommonStatus() {
    let commonStatus = [];
    this.statusMap.forEach(status => {
      commonStatus.push(status.id);
    });

    for (let key of Array.from(this.statusCountMap.keys())) {
      let eligibleStatus = this.statusMap.find(x => x.name === key).eligibleStatuses;
      let temp = [...commonStatus];
      commonStatus.forEach(id => {
        if (eligibleStatus.indexOf(id) === -1) {
          temp.splice(temp.indexOf(id), 1);
        }
      });
      commonStatus = temp;
    }

    this.orderStatusList = [];
    commonStatus.forEach(x => {
      this.orderStatusList.push(this.statusMap.find(entry => entry.id === x).name);
    });
  }

  onModelChange(filter, newFilter = true) {
    this.selectedSavedFilter = '';
    this.dtFilters = [];
    this.isAdvancedSearchFilter = false;
    this.resetSearchForm();
    this.templateApplied = true;
    let quickFilters = [];
    let advFilters = [];
    this.loading = true;
    this.alertNotify.clearNotification();
    this.store.dispatch(new LoadColumns({lazy: true}));
    this.showDelete = true;
    this.showFilterReset = true;
    this.isTemplateDelete = false;
    this.loading = false;
    this.selectedSavedFilter = filter;
    this.filterRestoreService.setTemplate(filter);
    if (newFilter) {
      this.dataTableComponent.resetPrevFilters();
      this.consolidatedDtFilters = [];
      this.filterRestoreService.filterRemoved('', true);
      advFilters = JSON.parse(filter.searchOptions) || [];
      quickFilters = JSON.parse(filter.columnFilterOptions) || [];
    } else {
      quickFilters = this.filterRestoreService.getAllFilters() || [];
      advFilters = this.sessionData.advancedSearchfilters;
    }
    this.isAdvancedSearchFilter = this.dtFilters.some(dfilter => {
      return dfilter.comparator1 !== 'INC';
    })
    let sortOptions = JSON.parse(filter.columnSortOptions) || [];
    advFilters.forEach(advFilter => {
      if (advFilter.column === '3') {
        if (advFilter.comparator2 && advFilter.comparator2 === 'LTE') {
          this.patchToAdvancedForm('3', '2');
          let fromDate = {
            'year': new Date(advFilter.filter1).getFullYear(),
            'month': new Date(advFilter.filter1).getMonth() + 1,
            'day': new Date(advFilter.filter1).getDate()
          }
          this.advancedSearchForm.patchValue({'fromDate': fromDate});
          let toDate = {
            'year': new Date(advFilter.filter2).getFullYear(),
            'month': new Date(advFilter.filter2).getMonth() + 1,
            'day': new Date(advFilter.filter2).getDate()
          }
          this.advancedSearchForm.patchValue({'toDate': toDate});
        } else {
          this.patchToAdvancedForm('3', '1');
          this.patchToAdvancedForm('durationDays', '30');
        }
      } else {
        this.patchToAdvancedForm(advFilter.column, advFilter.filter1);
      }
    });
    if (UtilsService.isEmpty(this.dtFilters)) {
      this.dtFilters = [];
    }
    if (newFilter) {
      this.dataTableComponent.goToFirstPage();
      this.filterRestoreService.setViewOption(sortOptions.rows);
    }
    let filterEvent = {
      lazyParams: {
        filters: [...quickFilters, ...advFilters],
        sortField: sortOptions.sortField,
        sortOrder: sortOptions.sortOrder,
        first: 0,
        rows: sortOptions.rows || 10,
        globalFilter: null,
        maxSelectKey: 'default-max-selection',
        selectAll: 'false',
        advancedSearch: this.isAdvancedSearchFilter || this.filters.length > 0
      }
    }
    this.onLazyLoad(filterEvent);
    if (!UtilsService.isEmpty(sortOptions.dtColumns)) {
      this.setColumnTemplate(sortOptions.dtColumns, '16', this.orderNo);
      this.columns = sortOptions.dtColumns;
      this.store.dispatch(new LoadColumns({lazy: false, columns: this.columns}));
    } else {
      this.store.dispatch(new LoadColumns({lazy: true}));
    }
  }

  deletePopUp() {
    this.alertNotify.clearNotification();
    this.modelServiceOpen(this.deleteContent);
  }

  openPopUp() {
    this.alertNotify.clearNotification();
    this.searchText = '';
    this.isExistingTemplate = false;
    this.modelServiceOpen(this.content);
  }

  private modelServiceOpen(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {backdrop: 'static', keyboard: false});
  }

  private existingTemplate() {
    this.modalRef.close();
    if (this.isExistingTemplate) {
      this.modelServiceOpen(this.overrideContent);
    } else {
      this.saveTemplate();
    }
  }

  private saveTemplate() {
    this.alertNotify.clearNotification();
    this.isExistingTemplate = false;
    this.saveReport = true;
    this.selectedSavedFilter = this.createFilterJSON();
    this.filterRestoreService.setTemplate(this.selectedSavedFilter);
    this.showDelete = true;
    this.showFilterReset = true;
    const newFilter = this.createFilterString('add');
    this.landingPageService.saveFilter(newFilter).then(response => {
      if (response) {
        this.saveReport = false;
        this.savedFilters.push(newFilter);
        this.savedFilters.sort((a, b) => a.reportName.toLowerCase().localeCompare(b.reportName.toLowerCase()));
        this.modalRef.close();
        this.filterMessage = 'ED_OM_FILTER_SAVE_SUCCESS';
        this.modelServiceOpen(this.filterMsgModal);
      }
    }).catch((ex) => {
      this.alertNotify.printErrorNotification(ex);
    });
  }

  invalidNameExists(value): boolean {
    if (value.match(this.pattern)) {
      return false;
    } else {
      return true;
    }
  }

  private updateExistingTemplate() {
    this.alertNotify.clearNotification();
    const newFilter = this.createFilterString('add');
    this.landingPageService.saveFilter(newFilter).then(response => {
      if (response) {
        this.selectedSavedFilter = this.createFilterJSON();
        this.showDelete = true;
        this.showFilterReset = true;
        this.filterRestoreService.setTemplate(this.selectedSavedFilter);
        const updatedFilter = this.savedFilters.findIndex(filter => {
          return filter.reportName.toLowerCase() === this.searchText.toLowerCase();
        });
        this.savedFilters[updatedFilter] = newFilter;
        this.filterMessage = 'ED_FILTER_UPDATE_SUCCESS';
        this.modelServiceOpen(this.filterMsgModal);
      }
    }).catch((ex) => {
      console.log(ex);
    });
    this.modalRef.close();
  }

  private deleteSavedFilter() {
    this.alertNotify.clearNotification();
    this.resetSearchForm();
    this.landingPageService.deleteFilter(this.createFilterString('')).then(response => {
      if (response) {
        this.modalRef.close();
        let index = this.savedFilters.findIndex(f => f.reportName === this.selectedSavedFilter.reportName);
        if (index !== -1) {
          this.savedFilters.splice(index, 1);
        }
        this.resetDtFilters();
        this.filterMessage = 'ED_OM_FILTER_DELETE_SUCCESS';
        this.modelServiceOpen(this.filterMsgModal);
      }
    }).catch((ex) => {
      this.loading = false;
      this.alertNotify.printErrorNotification(ex);
    });
  }

  private createFilterString(type: string) {
    return {
      reportName: type === 'add' ? this.searchText.trim() : this.selectedSavedFilter.reportName,
      searchOptions: JSON.stringify(this.filters) || [],
      columnFilterOptions: JSON.stringify(this.dtFilters) || [],
      columnSortOptions: JSON.stringify({
        sortField: this.customSortField,
        sortOrder: this.customSortOrder,
        rows: this.rows,
        dtColumns: this.columnsWithoutBT || []
      })
    }
  }

  private createFilterJSON() {
    return {
      reportName: this.searchText.trim(),
      searchOptions: this.filters,
      columnFilterOptions: this.dtFilters,
      columnSortOptions: {
        sortField: this.customSortField,
        sortOrder: this.customSortOrder,
        rows: this.rows,
        dtColumns: this.columnsWithoutBT || []
      }
    }
  }

  selectedTemplate(s) {
    this.searchText = s.reportName;
    this.isExistingTemplate = true;
  }

  checkFilterExists() {
    this.isExistingTemplate = this.savedFilters.some(filter => {
      return filter.reportName.toLowerCase() === this.searchText.trim().toLowerCase();
    });
  }

  resetDtFilters() {
    this.dataTableComponent.resetPrevFilters();
    this.selectedSavedFilter = '';
    this.filterRestoreService.filterRemoved('', true);
    this.filterRestoreService.setTemplate('');
    this.filterRestoreService.viewOptionRemoved();
    this.consolidatedDtFilters = [];
    this.isAdvancedSearchFilter = false;
    this.resetSearchForm();
    this.filters = [];
    this.dtFilters = [];
    this.showFilterReset = false;
    this.templateApplied = false;
    this.showDelete = false;
    this.store.dispatch(new LoadColumns({lazy: true}));
    let filterEvent = {
      lazyParams: {
        filters: [],
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        first: 0,
        globalFilter: null,
        maxSelectKey: 'default-max-selection',
        rows: 10,
        selectAll: 'false'
      }
    }
    this.onLazyLoad(filterEvent);
  }

  saveExistingOrNewTemplate() {
    if (this.searchText.trim() !== '' && !this.invalidNameExists(this.searchText) && this.searchText.length <= 70) {
      if (this.isExistingTemplate) {
        this.existingTemplate();
      } else {
        this.saveTemplate();
      }
    }
  }

  consolidateFilters(lazyLoadFilters: Array<any>) {
    lazyLoadFilters.forEach(lazyLoadFilter => {
      let changedFilter = this.consolidatedDtFilters.findIndex(conolidatedDtFilter => {
        return conolidatedDtFilter.column === lazyLoadFilter.column;
      })
      if (changedFilter > -1) {
        if (lazyLoadFilter.filter1 && lazyLoadFilter.filter1 !== '') {
          this.consolidatedDtFilters[changedFilter] = lazyLoadFilter;
        } else {
          this.consolidatedDtFilters.splice(changedFilter, 1);
        }
      } else {
        if (lazyLoadFilter.filter1 && lazyLoadFilter.filter1 !== '') {
          this.consolidatedDtFilters.push(lazyLoadFilter);
        } else if (lazyLoadFilter.comparator1 !== 'INC') {
          this.consolidatedDtFilters.push(lazyLoadFilter);
        }
      }
      this.dtFilters = this.consolidatedDtFilters;
    })
  }

  checkLazyLoad(event) {
    if (this.selectedSavedFilter !== '') {
      if ((event.lazyParams.filters.length !== 0)) {
        if (this.nonEmptyFils) {
          return true;
        } else {
          return (this.dtFilters.length > 0);
        }
      } else {
        return ((event.lazyParams.first !== 0) || (event.lazyParams.rows !== this.rows));
      }
    } else {
      return true;
    }
  }

  patchToAdvancedForm(key, value) {
    let fieldToPatch = `{"${key}" : "${value}"}`
    this.advancedSearchForm.patchValue(JSON.parse(fieldToPatch));
  }
}
