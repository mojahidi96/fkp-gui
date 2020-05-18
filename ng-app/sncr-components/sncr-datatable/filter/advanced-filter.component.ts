import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';
import {NgbDateStruct, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Filter} from './filter';
import {FormControl, NgModel} from '@angular/forms';
import {DatepickerParserService} from '../../sncr-controls/datepicker/datepicker-parser.service';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../sncr-commons/utils.service';
import {FilterService} from './filter.service';
import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {FilterRestoreService} from '../../../sncr-components/sncr-commons/filter-restore.service';

/**
 * Internal component for datatable filters
 * @internal
 */
@Component({
  selector: 'sncr-advanced-filter',
  templateUrl: 'advanced-filter.component.html',
  styleUrls: ['advanced-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedFilterComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  static TEXT_FILTERS = [
    {value: 'E', text: 'leer'},
    {value: 'NE', text: 'nicht leer'},
    {value: 'EQ', text: 'gleich'},
    {value: 'NEQ', text: 'nicht gleich'},
    {value: 'INC', text: 'enthält'},
    {value: 'NINC', text: 'enthält nicht'}
  ];

  static NUMBER_FILTERS = [
    {value: 'E', text: 'leer'},
    {value: 'NE', text: 'nicht leer'},
    {value: 'EQ', text: 'gleich'},
    {value: 'NEQ', text: 'nicht gleich'},
    {value: 'GT', text: 'größer als'},
    {value: 'GTE', text: 'größer als oder gleich'},
    {value: 'LT', text: 'kleiner als'},
    {value: 'LTE', text: 'kleiner als oder gleich'}
  ];

  @Input() restoreFilters = false;
  @Input() col;
  @Input() isNew: boolean;
  @Input() prefix: string;
  @Input() type;
  @Input() quickSearchOptions: any[];
  @Input() filters: Filter[] = [];


  @Output() onFilter = new EventEmitter();

  @Output() saveFilterChange = new EventEmitter();

  @Input() advSearchFilter = false;

  @ViewChild(NgbPopover) popover: NgbPopover;
  @ViewChild('container') iconGroup: ElementRef;
  @ViewChild('inputFilter') inputFilter: NgModel;
  @HostBinding('class') role = 'no-margin-bottom';

  filterModel = new Filter();
  filtering = false;
  dateFilter1: NgbDateStruct;
  dateFilter2: NgbDateStruct;
  quickSearch = null;
  placeholder = 'DATATABLE-FILTER-PLACEHOLDER';

  textFilters = AdvancedFilterComponent.TEXT_FILTERS;
  numberFilters = AdvancedFilterComponent.NUMBER_FILTERS;

  private prevLogicalOperation;
  private advanced: boolean;
  private documentClick$: Subscription;
  private scroll$: Subscription;
  private inputFilter$: Subscription;
  private multiSelectClick$: Subscription;
  sessionData: { filters: any[]; advancedSearchfilters: any[]; cols: any[]; };
  previousFilters: any[];
  private filterExternallyApplied = false;

  constructor(private datepickerParserService: DatepickerParserService, private filterService: FilterService,
              private sncrTranslateService: SncrTranslateService, private cdr: ChangeDetectorRef,
              private filterRestoreService: FilterRestoreService) {

  }

  ngOnInit(): void {
    this.type = this.type || 'text';
    this.setModelDefaults();

    if (this.isNew) {
      this.textFilters = [
        {value: 'E', text: 'DATATABLE-FILTER-COMPARATOR-EMPTY'},
        {value: 'NE', text: 'DATATABLE-FILTER-COMPARATOR-NOT_EMPTY'},
        {value: 'EQ', text: 'DATATABLE-FILTER-COMPARATOR-EQUAL'},
        {value: 'NEQ', text: 'DATATABLE-FILTER-COMPARATOR-NOT_EQUAL'},
        {value: 'INC', text: 'DATATABLE-FILTER-COMPARATOR-CONTAINS'},
        {value: 'NINC', text: 'DATATABLE-FILTER-COMPARATOR-NOT_CONTAINS'}
      ];
      this.numberFilters = [
        {value: 'E', text: 'DATATABLE-FILTER-COMPARATOR-EMPTY'},
        {value: 'NE', text: 'DATATABLE-FILTER-COMPARATOR-NOT_EMPTY'},
        {value: 'EQ', text: 'DATATABLE-FILTER-COMPARATOR-EQUAL'},
        {value: 'NEQ', text: 'DATATABLE-FILTER-COMPARATOR-NOT_EQUAL'},
        {value: 'GT', text: 'DATATABLE-FILTER-COMPARATOR-GT'},
        {value: 'GTE', text: 'DATATABLE-FILTER-COMPARATOR-GTE'},
        {value: 'LT', text: 'DATATABLE-FILTER-COMPARATOR-LT'},
        {value: 'LTE', text: 'DATATABLE-FILTER-COMPARATOR-LTE'}
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters && this.filters.some(f => f.column === this.col.field)) {
      this.setModelDefaults();
    } else if (this.advSearchFilter) {
      this.resetAll();
    }
  }

  ngOnDestroy(): void {
    if (this.documentClick$) {
      this.documentClick$.unsubscribe();
    }
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
    if (this.inputFilter$) {
      this.inputFilter$.unsubscribe();
    }
    if (this.multiSelectClick$) {
      this.multiSelectClick$.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.restoreFilters) {
      this.filterExternallyApplied = true;
      const existingFilter = this.filterRestoreService.getFilters(this.col);
      if (existingFilter) {
        this.filterModel = existingFilter;
        this.resetQuickFilter(true);
      }
    }
    this.inputFilter$ = this.inputFilter.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value, callIndex) => {
          return callIndex > 0 && (!this.advanced || this.inputFilter.control.enabled);
        }),
        debounceTime(500)
      )
      .subscribe((value: any) => {
        if (UtilsService.notNull(value) && (value.year || value.toString().trim() !== '')) {
          this.setFilterModelDefaults();
          if (this.type.toLowerCase() === 'date') {
            this.dateFilter1 = value;
          } else {
            this.filterModel.filter1 = value;
          }
            this.filter({valid: true} as FormControl);
        } else {
          if (!this.filterExternallyApplied) {
            this.reset();
          }
        }
      });
  }

  filter(form: FormControl, isAdvanced?: boolean) {
    if (form.valid) {
      this.filterExternallyApplied = isAdvanced ? false : this.filterExternallyApplied;
      this.advanced = isAdvanced;
      this.filtering = true;
      this.resetQuickFilter();
      this.parseDates();
      if (this.restoreFilters && isAdvanced) {
        this.filterRestoreService.setFilters(this.col, this.filterModel);
      }
      if ((this.quickSearch === null || !isAdvanced) && !this.filterExternallyApplied) {
        this.onFilter.emit(this.filterModel);
      }
      this.popover.close();
    }
  }


  reset() {
    if (!this.filterModel.saved) {
      if (this.inputFilter.control.disabled) {
        this.placeholder = 'DATATABLE-FILTER-PLACEHOLDER';
        this.inputFilter.control.enable();
      }
      this.advanced = false;
      this.filtering = false;
      this.filterModel = new Filter();
      this.quickSearch = null;
      this.setFilterModelDefaults();
      if (this.restoreFilters) {
        this.filterModel.filter1 = '';
        this.onFilter.emit(this.filterModel);
      } else {
        this.onFilter.emit({column: this.filterModel.column});
      }
    } else {
      this.filterModel.saved = false;
      this.type = this.filterModel.type;
      this.placeholder = 'DATATABLE-ADVANCED-FILTER-PLACEHOLDER';
      this.inputFilter.control.disable();
    }
    this.popover.close();
  }

  logicalClick() {
    if (this.prevLogicalOperation === this.filterModel.logicalOperation) {
      this.filterModel.logicalOperation = null;
      this.prevLogicalOperation = null;
    } else {
      this.prevLogicalOperation = this.filterModel.logicalOperation;
    }
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

  filterChanged() {
    if (this.restoreFilters) {
      this.filterExternallyApplied = false;
      if (this.quickSearch) {
        this.filterRestoreService.setFilters(this.col, this.filterModel);
      } else {
        this.filterReset();
      }
    }
  }

  onOpen() {
    setTimeout(() => {
      this.documentClick$ = fromEvent(document, 'click')
        .subscribe(this.offClickHandler(this.iconGroup));

      // whenever view options is opened then close the filter popover
      const sncrMultiSelect = document.querySelector('sncr-multi-select .d-inline-block');
      if (UtilsService.notNull(sncrMultiSelect)) {
        this.multiSelectClick$ = fromEvent(sncrMultiSelect, 'click')
          .subscribe(this.offClickHandler(this.iconGroup));
      }
      const tableWrapper = document.querySelector('.ui-datatable-tablewrapper');
      this.scroll$ = fromEvent(tableWrapper, 'scroll')
        .subscribe(this.onParentScrollHandler(this));
    }, 10);
  }

  onClose() {
    if (this.documentClick$) {
      this.documentClick$.unsubscribe();
    }
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  getTranslation(key, params?) {
    return this.sncrTranslateService.getTranslation(key, this.prefix, params);
  }

  // START: TEMPORARY
  getTitle(key, params) {
    return this.isNew ? this.getTranslation(key, params) : 'Nach ' + this.col.header + ' filtern:';
  }

  getPlaceholderDate(key) {
    return this.isNew ? this.getTranslation(key) : 'tt.mm.jjjj';
  }

  getPlaceholderKeyword(key) {
    return this.isNew ? this.getTranslation(key) : 'Stichwort';
  }

  // END

  resetAll() {
    this.advanced = false;
    this.filtering = false;
    this.filterModel.comparator1 = this.filterModel.type === 'text' || 'number' ? 'INC' : 'EQ';
    this.filterModel.comparator2 = this.filterModel.type === 'text' || 'number' ? 'INC' : null;
    this.filterModel.filter1 = null;
    this.filterModel.filter2 = null;
    this.filterModel.logicalOperation = null;
    this.quickSearch = null;
    this.setFilterModelDefaults();
    this.setModelDefaults();
    this.resetQuickFilter();
  }

  private setModelDefaults() {
    let columnFilter = this.filters.find(f => f.column === this.col.field);
    if (!columnFilter) {
      this.setFilterModelDefaults();
    } else {
      this.filtering = true;
      this.filterModel = Object.assign({}, columnFilter);
    }
  }

  private setFilterModelDefaults() {
    this.filterModel.type = this.type === 'date' ? 'date' : this.type === 'text' ? 'text' : 'number';
    this.filterModel.column = this.col.field;
    if (this.filterModel.type === 'text') {
      this.filterModel.comparator1 = 'INC';
      this.filterModel.comparator2 = 'INC';
    } else {
      this.filterModel.comparator1 = 'EQ';
      this.filterModel.comparator2 = 'EQ';
    }
    this.dateFilter1 = undefined;
    this.dateFilter2 = undefined;
  }

  private parseDates() {
    if (this.type === 'date') {
      this.filterModel.filter1 = this.datepickerParserService.toNumber(this.dateFilter1);
      this.filterModel.filter2 = this.datepickerParserService.toNumber(this.dateFilter2);
    }
  }

  private offClickHandler(element: ElementRef) {
    return (event) => {
      let popoverWindow = document.querySelector('ngb-popover-window');

      if (!element.nativeElement.contains(event.target)
        && event.target.parentNode
        && event.target.parentNode.className !== 'ngb-dp-day'
        && popoverWindow && !popoverWindow.contains(event.target)) {
        this.popover.close();
      } else if (!element.nativeElement.contains(event.target)
        && popoverWindow && !popoverWindow.contains(event.target)) {
        this.popover.close();
      }
    };
  }

  private onParentScrollHandler(component: AdvancedFilterComponent) {
    return () => {
      if (component.popover.isOpen()) {
        component.popover.close();
      }
    };
  }

  private resetQuickFilter(stopLazyLoad = false) {
    if (this.filterModel.logicalOperation ||
      (this.filterModel.type === 'text' && this.filterModel.comparator1 !== 'INC') ||
      (this.filterModel.type !== 'text' && this.filterModel.comparator1 !== 'EQ')) {
      this.quickSearch = null;
      this.placeholder = 'DATATABLE-ADVANCED-FILTER-PLACEHOLDER';
      this.inputFilter.control.disable();
    } else {
      this.quickSearch = this.type === 'date' ? this.dateFilter1 : this.filterModel.filter1;
      this.placeholder = 'DATATABLE-FILTER-PLACEHOLDER';
      if (!stopLazyLoad) {
        this.inputFilter.control.markAsDirty();
        this.inputFilter.control.enable();
      }
    }
  }


  filterReset() {
    this.filterExternallyApplied = false;
    this.filterRestoreService.filterRemoved(this.col, false);
  }
}
