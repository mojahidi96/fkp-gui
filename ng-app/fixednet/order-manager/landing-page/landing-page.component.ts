import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {LandingPageService} from './landing-page.service';
import {Column} from '../../../sncr-components/sncr-datatable/column';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {LazyParams} from '../../../sncr-components/sncr-datatable/lazy-params';
import {Filter} from '../../../sncr-components/sncr-datatable/filter/filter';
import {LandingPageConfig} from './landing-page-config';
import {DatepickerParserService} from '../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {OrderManagerModel, OrderManagerState} from './landing-page-store/landing-page-orders.store';
import {
  DatatableRequestPayload, LoadColumns, LoadData, SelectionChange, ShowLoader
} from '../../../sncr-components/sncr-datatable/store/datatable.actions';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {PageScrollInstance, PageScrollService} from 'ngx-page-scroll';
import {OrderStatusChange} from './landing-page-store/landing-page-orders.actions';
import {TranslationService} from 'angular-l10n';
import {FixedNetService} from '../../fixednet.service';

/**
 * component with view for default set of orders in error state displayed in table
 * advanced search filter to filter the orders based on search criteria
 * component class to handle the business logic for OM functionality
 */
@Component({
  selector: 'fn-om-landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LandingPageComponent implements OnInit, OnDestroy {

  static readonly COMPARE_EQUAL = 'EQ';
  static readonly LOGICAL_AND = 'AND';

  @ViewChild('msgContentModal') msgContentModal: NgbModal;
  @ViewChild('orderNo') orderNo;
  @ViewChild('customerInfo') customerInfo;
  @ViewChild('createdDateTime') createdDateTime;
  @ViewChild('emailSentTime') emailSentTime;
  @ViewChild('bpaAckReceivedTime') bpaAckReceivedTime;
  @ViewChild('isEmailSent') isEmailSent;
  @ViewChild('isBPAEmailReceived') isBPAEmailReceived;
  @ViewChild('locked') locked;
  @ViewChild('reasonCode') reasonCode;
  @Select(OrderManagerState) OrderManagerState$: Observable<OrderManagerModel>;
  advancedSearchForm: FormGroup;
  columns: Array<Column> = [];
  processing = false;
  alertNotify: NotificationHandlerService;
  statusAllowed = [];
  statusSearch = [];
  readonly configId = '6f7ab7b1-13a8-72af-e053-1405100af944';
  readonly sortField = '5';
  readonly sortOrder = 1;
  private advancedSearch = false;
  // advancedSearchFields Array configured to generate form
  readonly advancedSearchFields: any = LandingPageConfig.advancedSearchFields;
  private salesProducts = [];
  private toggle = false;
  private filters: Filter[];
  private patternMap: any;
  private defaultFormData: any;
  private scrollConfig: any = {};
  transactionId: string;
  isOrderDetail = false;
  private orderStatusForm: FormGroup;
  private noOrderSelected = false;
  private statusChangeSuccess = false;
  private error = false;
  private advSearchFilter = false;
  private eligibilityFailed = false;
  private orderLocked = false;
  private readonlyUser = false;
  private dateFieldSubscription: Subscription;
  private statusSubscription: Subscription;
  private dataTableSubscription: Subscription;
  private routeSubscription: Subscription;


  constructor(private formBuilder: FormBuilder, private landingPageService: LandingPageService,
              private datepickerParserService: DatepickerParserService, private store: Store,
              private cdr: ChangeDetectorRef, private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: any, private pageScrollService: PageScrollService,
              @Inject('NotificationHandlerFactory') public notificationHandlerFactory,
              private translation: TranslationService, private modalService: NgbModal,
              private fixedNetService: FixedNetService) {

  }


  ngOnInit(): void {
    this.alertNotify = this.notificationHandlerFactory();

    // load the columns
    this.store.dispatch(new LoadColumns({lazy: true}));

    // get the shopNames for advanced search prediction
    this.landingPageService.getSalesProducts().subscribe(products => {
      this.salesProducts = products;
    });

    // set the default status allowed for an order to change
    this.statusAllowed = [
      {text: 'OM-STATUS-COMPLETE', value: '10'},
      {text: 'OM-STATUS-CANCEL', value: '11'},
      {text: 'OM-STATUS-RESUBMIT', value: '1'}
    ];

    // set the default status which the user can search in advanced search
    this.statusSearch = [
      {text: 'OM-STATUS-COMPLETE', value: 'Abgeschlossen'},
      {text: 'OM-STATUS-CANCEL', value: 'Storniert'},
      {text: 'OM-STATUS-INPROGRESS', value: 'In Bearbeitung'},
      {text: 'OM-STATUS-ERROR', value: 'Fehler'}
    ];


    this.filters = [];

    this.routeSubscription = this.route.data.subscribe((data: { pattern: any }) => {
      this.patternMap = data.pattern ? data.pattern : '';
    });

    this.createForm();

    this.dateFieldSubscription = this.advancedSearchForm.get(this.advancedSearchFields.orderCreated.field).valueChanges.subscribe(val => {
      if (val && val === '2') {
        this.enableFields(this.advancedSearchForm, [this.advancedSearchFields.fromDate.field, this.advancedSearchFields.toDate.field]);
      } else {
        this.disableFields(this.advancedSearchForm, [this.advancedSearchFields.fromDate.field, this.advancedSearchFields.toDate.field]);
      }
    });


    this.statusSubscription = this.orderStatusForm.get('status').valueChanges.subscribe(val => {
      if (val && val !== 'choose') {
        this.enableFields(this.orderStatusForm, ['message']);
      } else {
        this.disableFields(this.orderStatusForm, ['message']);
      }
    });

    this.scrollConfig = {
      document: this.document,
      scrollTarget: '#table',
      pageScrollOffset: 10,
      scrollingViews: [document.documentElement, document.body, document.body.parentNode]
    };


    this.dataTableSubscription = this.OrderManagerState$.subscribe(value => {
      this.processing = value.processing || value.selectAllLoading;
      let cols = value.cols;
      this.setColumnTemplate(cols, '1', this.orderNo);
      this.setColumnTemplate(cols, '5', this.createdDateTime);
      this.setColumnTemplate(cols, '6', this.emailSentTime);
      this.setColumnTemplate(cols, '9', this.bpaAckReceivedTime);
      this.setColumnTemplate(cols, '7', this.isEmailSent);
      this.setColumnTemplate(cols, '8', this.isBPAEmailReceived);
      this.setColumnTemplate(cols, '15', this.customerInfo);
      this.setColumnTemplate(cols, '21', this.reasonCode);
      this.removeFilterAndSorting(cols, '7');
      this.removeFilterAndSorting(cols, '8');

      this.statusChangeSuccess = value.statusChangeSuccess;
      this.error = value.error;
      this.noOrderSelected = value.noOrderSelected;
      this.eligibilityFailed = value.eligibilityFailed;
      this.orderLocked = value.orderLocked;
      if (this.statusChangeSuccess || this.error || this.noOrderSelected || this.eligibilityFailed || this.orderLocked) {
        this.openModal();
      }
    });

    let fnUser = this.fixedNetService.getFnUser();
    if (fnUser) {
      this.readonlyUser = fnUser.isReadOnlyUser;
    }
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
        // on load set the date field with initial last 30days option
        searchField.defaultValue = '30';
      }
      if (searchField.field === this.advancedSearchFields.fromDate.field
        || searchField.field === this.advancedSearchFields.toDate.field) {
        // fromDate and toDate add range validator
        validators.push(this.doDateRangeValidations(), Validators.required);
      }
      if (searchField.field === this.advancedSearchFields.customerNo.field
        || searchField.field === this.advancedSearchFields.customerHierarchyNo.field) {
        validators.push(CustomValidators.onlyNumbers);
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

    // create the status form data object
    this.orderStatusForm = this.formBuilder.group(
      {
        'status': ['', CustomValidators.requiredWithTrim],
        'message': ['', [Validators.maxLength(4000), CustomValidators.sanitization(this.patternMap)]]
      }
    );
    // disable the orderStatus form message form control on load
    this.disableFields(this.orderStatusForm, ['message']);
  }


  search() {
    // capture the form values and make an API call to search based on user requested search data
    if (this.advancedSearchForm && this.advancedSearchForm.valid) {
      this.advancedSearch = true;
      this.store.dispatch(new ShowLoader());
      let formValue = this.advancedSearchForm.value;

      // everytime the user clicks search then reset the filters
      this.filters = [];
      Object.keys(this.advancedSearchFields).forEach((key) => {
        // If defaultValue is not same as formField value then
        // we can consider that field is changed by the user
        let searchField = this.advancedSearchFields[key];
        if (formValue[searchField.field] !== searchField.defaultValue) {
          // ignored fields should be considered for a separate logic to calculate the values
          if (!searchField.ignore
            && !searchField.compoundFields) {
            this.createFilters(this.createFilter(searchField,
              [{comparator: LandingPageComponent.COMPARE_EQUAL, filter: formValue[searchField.field]}]));
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
        if (formValue[searchField.field] === '1') {
          // if user have selected last 30days as their filter
          dateFieldObjVal = this.getDate(30, null);
        }
        if (dateFieldObjVal) {
          let dateTime = this.datepickerParserService.toNumber(dateFieldObjVal);
          comparatorFilter.push({comparator: selectedRadioControl[control].comparator, filter: dateTime});
        }
      });
    }
    return comparatorFilter.length ? this.createFilter(searchField, comparatorFilter) : null;
  }


  onLazyLoad(event) {
    this.advSearchFilter = false;
    if (UtilsService.notNull(event) && UtilsService.notNull(event.lazyParams)) {
      // table filters must consider the advanced search filters if any
      event.lazyParams.filters = [...event.lazyParams.filters, ...this.filters];
      event.lazyParams.advancedSearch = this.advancedSearch;
      event.lazyParams.sortField = this.getSortField(event.lazyParams.sortField);
      this.store.dispatch(new LoadData(event));
    }
  }

  onSelectionChange(event) {
    this.store.dispatch(new SelectionChange(event));
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
          } else if (((toDateTime - fromDateTime) / (1000 * 3600 * 24)) >= 30) {
            error = {dateRangeError: true};
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
      let statusSelected = this.orderStatusForm.get('status').value;
      if (statusSelected && statusSelected !== 'choose') {
        this.processing = true;
        let statusRequest: any = {};
        // set the status
        statusRequest['3'] = this.orderStatusForm.get('status').value;
        // set the message
        statusRequest['15'] = this.orderStatusForm.get('message').value;
        this.store.dispatch(new OrderStatusChange({
          request: statusRequest
        }));
      }
    } else {
      this.alertNotify.printErrorNotification('OM-FORM_ERROR_MSG');
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
    this.isOrderDetail = true;
    this.transactionId = e;
  }

  backbuttonClicked(e) {
    this.isOrderDetail = false;
  }

  onColumnChange(event) {
    this.columns = event;
    this.store.dispatch(new LoadColumns({lazy: false, columns: event}));
    this.landingPageService.updateSessionColumns(this.columns);
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


  getSortField(field: string) {
    switch (field) {
      case '5':
        return '22';
      case '6':
        return '23';
      case '9':
        return '24';
      default:
        return field;
    }
  }

  removeFilterAndSorting(cols: Column[], field: string) {
    let col = cols && cols.length ? cols.find(c => c.field === field) : null;
    if (col) {
      col.sortable = false;
      col.filter = false;
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.dateFieldSubscription.unsubscribe();
    this.dataTableSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }
}
