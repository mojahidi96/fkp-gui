import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {DataTable} from 'primeng/datatable';
import {DatatableBase} from './datatable-base';
import {Column} from './column';
import {Filter} from './filter/filter';
import {FilterService} from './filter/filter.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UtilsService} from '../sncr-commons/utils.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Removable} from './removable';
import {LazyParams} from './lazy-params';
import {LazyLoadEvent} from 'primeng/components/common/lazyloadevent';
import {Observable, Subject, Subscription} from 'rxjs';
import {SncrDatatableService} from './sncr-datatable.service';
import {BanSubConfig} from '../../ban-sub-common/ban-sub.config';
import {SncrTranslateDirective} from '../sncr-translate/sncr-translate.directive';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {Language} from 'angular-l10n';
import {AdvancedFilterComponent} from './filter/advanced-filter.component';

/**
 * Component to extend PrimeNG datatable with our custom configurations. Please, refer to the official documentation:
 * http://www.primefaces.org/primeng/#/datatable
 *
 * For header and footer use the following components:
 * - {@link SncrHeaderComponent}
 * - {@link SncrFooterComponent}
 *
 * To define columns use the input 'cols'.
 */
@Component({
  selector: 'sncr-datatable',
  templateUrl: 'sncr-datatable.component.html',
  styleUrls: ['sncr-datatable.component.scss']
})
export class SncrDatatableComponent extends DatatableBase implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  filteredValue: any[];

  /**
   * List of column objects.
   *
   * ### Example of bodyTemplate
   * #### In component html
   * ``` html
   * <ng-template #test let-context>
   *  <b>Name:</b> {{context.row[context.col.field]}}
   * </ng-template>
   * ```
   * #### In component ts
   * ```
   * &#64;ViewChild('test') test;
   * ...
   * cols = [
   *  ...
   *  {bodyTemplate: this.test}
   *  ...
   * ]
   * ```
   */
  @Input()
  get cols(): Column[] {
    return this._cols;
  }

  set cols(value: Column[]) {
    this._cols = value.map(col => {
      if (col.filter === undefined) {
        col.filter = true;
      }
      return col;
    });
    this.currentCols = this._cols.filter(c => c.show).map(c => {
      if (c.sortable !== false && c.sortable !== 'false') {
        c.sortable = 'custom';
      } else {
        c.sortable = false;
      }
      return c;
    });
  }

  /**
   * Whether filters should be shown in all columns or not.
   * If true, single columns can be disabled with `filter` property of {@link Column}.
   * @type {boolean}
   */
  @Input() filter = true;

  /**
   * Enables/disables a column on the left of the table with checkboxes to select multiple rows.
   * It will store the selected rows into the provided `selection` input and will emit an event on row selection under
   * `selectionChange` output.
   * ###Example
   * ``` html
   * <sncr-datatable  [value]="rows"
   *                  [cols]="columns"
   *                  [(selection)]="selected"
   *                  (selectionChange)="onSelect($event)"
   *                  [multiSelection]="true">
   * ```
   * <div style="color: red">⚠ In a later refactoring this should be refactored to selectionMode with enums
   * like NONE, SINGLE and MULTI.</div>
   */
  @Input() multiSelection: boolean;

  /**
   * When set, restricts the maximum select count of rows.
   */
  @Input() maxSelectCount: number;

  /**
   * An identifier that is used to request max select count in lazy-load mode.
   */
  @Input() maxSelectKey = 'default-max-selection';

  /**
   * Allow to hide/show columns.
   */
  @Input() columnSelection: boolean;

  /**
   * <div style="color: red">⚠ Part of legacy translation for selection count summary.</div>
   */
  @Input() selectionTitle: string;

  /**
   * Enable edit mode support.
   */
  @Input() editable: boolean;

  /**
   * Object that describes a modal popup that will be shown when a row is going to be deleted, e.g. used for delete confirmation.
   */
  @Input() removableContent: Removable;

  /**
   * Show/hide the total number of results summary.
   */
  @Input() resultCount = true;

  /**
   * <div style="color: red">⚠ Part of legacy translation for constructing the total number of results summary.</div>
   */
  @Input() resultMessage = [];

  /**
   * <div style="color: red">⚠ Part of legacy translation for constructing the number of selected results summary.</div>
   */
  @Input() selectionMessage = [];

  /**
   * Enable export to CSV.
   */
  @Input() exportToCsv: boolean;


  /**
   * In some cases this is used as the column header of the selection column.
   * <div style="color: red">⚠ This needs to be refactored away.</div>
   */
  @Input() header: string;

  /**
   * <div style="color: red">⚠ Part of legacy translation for constructing the number of selected results summary.</div>
   */
  @Input() singleSelectionMsg = 'Ein';

  /**
   * <div style="color: red">⚠ Part of legacy translation for constructing the number of selected results summary.</div>
   */
  @Input() selectMessage = 'Teilnehmer';

  /**
   * Name passed through to the sncr-check-group in case of single selection mode.
   */
  @Input() radioSelectionName = 'sncrChecked';

  /**
   * Base URL from which to lazily load data.
   */
  @Input() lazyLoadUrl: string;

  /**
   * Show cell content in edit mode.
   */
  @Input() allEditable = false;

  /**
   * Form wrapping an array of forms, one form for each row.
   */
  @Input() allEditForm: FormGroup;

  /**
   * If set to true do not make separate getCount() call when in lazy load mode.
   * <div style="color: red">⚠ Maybe this can be refactored away. To be investigated.</div>
   */
  @Input() countAlreadySet = false;

  /**
   * Enable use of FilterRestoreService to populate filters. This is e.g. used in the context of
   * ED OrderManager where the user can select a saved template to show a prefiltered data table.
   */
  @Input() restoreFilters = false;

  /**
   * Array of rows used only in non-lazy mode.
   */
  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this.currentValue = value;
    this._value = value;
    if (!this.lazy) {
      this.totalRecords = value ? value.length : 0;
    }
  }

  /**
   * Event that is emitted after saving in single row edit mode.
   */
  @Output() onEditSave = new EventEmitter();

  /**
   * Event that is emitted after entering single row edit mode.
   */
  @Output() onOpenEdit = new EventEmitter();

  /**
   * Event that is emitted after canceling edit in single row edit mode.
   */
  @Output() onCancelEdit = new EventEmitter();

  /**
   * Event that is emitted when deleting in single row edit mode.
   */
  @Output() onDelete = new EventEmitter();

  /**
   * <div style="color: red">⚠ This is currently not consumed and needs to be refactored away.</div>
   */
  @Output() allEditFormChange = new EventEmitter();

  /**
   * <div style="color: red">⚠ This is currently not consumed and needs to be refactored away.</div>
   */
  @Output() paymentFieldsChanges = new EventEmitter();

  /**
   * Event that is emitted when changing selected radio button in single selection mode.
   */
  @Output() onRadioChange = new EventEmitter();

  /**
   * Event that is emitted after filtering, sorting, selection, or pagination has changed.
   */
  @Output() onDataChange = new EventEmitter();

  /**
   * Event that is emitted when the header link in a column with assignAll=true is clicked.
   * In the context of subscriber management this is used to auto assign existing MSISDNs to subscribers.
   */
  @Output() assignAll = new EventEmitter();

  /**
   * Disable hide/show of editable fields in the view options dropdown.
   */
  @Input() hideColSelect = false;

  /**
   * Translation key prefix to be used.
   */
  @Input() prefix: string;

  /**
   * Number of selected rows which is passed through to sncr-results.
   * <div style="color: red">⚠ This should only be used internally and not as an @Input.</div>
   */
  @Input() selectCount = 0;

  /**
   * The custom column template to be used. This is used for example to display a Download button
   * for each of the rows.
   */
  @Input() customCol: TemplateRef<any>;

  /**
   * By default custom column is rendered as the first column.
   * When lastCustomCol is set to true this will render the custom column template as the last column.
   */
  @Input() lastCustomCol = false;

  @Language() lang: string;

  /**
   * @internal
   */
  @ViewChild('datatable', {static: true}) dt: DataTable;
  @ViewChild('dtWrapper') dtWrapper: ElementRef;
  @ViewChildren(SncrTranslateDirective) viewTranslations: QueryList<SncrTranslateDirective>;
  @ViewChildren('advFilters') private advFilters: QueryList<AdvancedFilterComponent>;

  editForm: FormGroup;
  showValidation: boolean;

  public currentValue = [];
  public previousFilters: Filter[] = [];
  public previousSort: any = {};
  public initNotLoaded = true;
  public selectedMap = new Map();
  public selectAll = false;
  public flowId = '';

  /**
   * This gets internally set to true when the number of selected rows is greater than or equals to maxSelectCount.
   */
  public maxSelectCountError = false;

  public editing: any;
  protected subscriptions$: Subscription[] = [];

  private dataLoadingProgress = new Subject();
  public isSelectAllLoading = false;

  private _value;
  private _cols;
  public currentCols = [];
  private currentSelection;
  public lazyParams = new LazyParams();
  private totalRecordsWithoutFilter: number;
  private originalDataWithoutEdit = [];

  private _isNew = null;

  static compareFilters(f1: Filter, f2: Filter): boolean {
    return f1.column === f2.column &&
      f1.comparator1 === f2.comparator1 &&
      f1.comparator2 === f2.comparator2 &&
      f1.filter1 === f2.filter1 &&
      f1.filter2 === f2.filter2 &&
      f1.logicalOperation === f2.logicalOperation &&
      f1.type === f2.type;
  }

  constructor(protected filterService: FilterService, protected formBuilder: FormBuilder,
              protected modalService: NgbModal, protected sncrDatatableService: SncrDatatableService,
              protected sncrTranslate: SncrTranslateService) {
    super();
  }

  ngOnInit(): void {
    if (!this.paginator) {
      this.paginatorPosition = ''; // Bug in primeng datatable
    }

    if (this.allEditable) {
      this.showValidation = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (UtilsService.notNull(this.value) && this.value.length > 0) {
        this.sortUpdatedValues();
      }
    }
    if (changes['selection']) {
      let currentSelected = changes['selection'].currentValue;
      let previousSelected = changes['selection'].previousValue;
      if (currentSelected instanceof Array && currentSelected.length) {
        currentSelected.forEach(s => s._sncrChecked = true);
      }

      if (!changes['selection'].firstChange && previousSelected instanceof Array && currentSelected instanceof Array) {
        let unchecked = previousSelected.filter(p => !currentSelected.some(c =>
          JSON.stringify(c) === JSON.stringify(p)
        ));
        unchecked.forEach(u => u._sncrChecked = false);
      }
    }
  }

  ngAfterViewInit(): void {
    this.subscriptions$.push(this.viewTranslations.changes.subscribe(() => {
      this.viewTranslations.forEach(t => t.prefix = this.prefix);
    }));

    if (!this.lazy && this.sortField === '_sncrChecked') {
      this.dt.handleDataChange();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }


  /**
   * @internal
   */
  filtering(filter: Filter) {
    this.onDataChange.emit('filter_change');
    let isPreviousExist = this.previousFilters.length;
    let index = this.previousFilters.findIndex(f => f.column === filter.column);
    if (filter && !filter.comparator1 && index !== -1) {
      this.previousFilters.splice(index, 1);
    } else if (filter && filter.comparator1) {
      if (index === -1) {
        this.previousFilters.push(filter);
      } else {
        this.previousFilters[index] = filter;
      }
    }

    if (this.lazy) {
      this.goToFirstPage();
    } else {
      if (this.previousFilters.length) {
        this.currentValue = this.previousFilters.reduce((rows, currentFilter) => {
          const col = this.cols.find(c => c.field === currentFilter.column);
          return [...rows.filter(e => {
            let currentValue = e[currentFilter.column];
            if (col.valueFunction) {
              currentValue = col.valueFunction(currentValue);
            }

            return this.filterService.filter(this.getTranslation(currentValue), currentFilter);
          })];
        }, this.value);
      } else {
        this.currentValue = this.value && this.value.length ? [...this.value] : [];
      }

      this.totalRecords = this.currentValue.length;
      if (isPreviousExist || this.previousFilters.length) {
        this.goToFirstPage();
      }
      // enabling the radio button for the selected row - filter event
      if (UtilsService.notNull(this.selectionMode) && this.selectionMode === 'radio') {
        this.currentValue.forEach(row => {
          if (row === this.dt.selection) {
            row._sncrChecked = 0;
          } else {
            row._sncrChecked = undefined;
          }
        });
      }
      this.sortUpdatedValues();
      this.filteredValue = this.currentValue;
    }
  }

  resetAllFilters() {
    this.onDataChange.emit('filter_change');
    this.previousFilters = [];
    this.filtering({} as Filter);
  }

  resetAdvancedFilter() {
    this.onDataChange.emit('filter_change');
    this.advFilters.forEach((filter: AdvancedFilterComponent) => {
      filter.resetAll();
    });
  }

  /**
   * @internal
   */
  toggleAllRowsWithCheckbox(event) {
    this.onDataChange.emit('cb_change');
    if (this.lazy) {
      this.dt.onHeaderCheckboxToggle.emit({loading: true});
      this.isSelectAllLoading = true;
    }
    let data = this.dt.filteredValue || this.dt.value;
    let oldSelectionCount;
    if (event.checked) {
      this.dt.selection = (this.dt.filteredValue && this.dt.filteredValue.length < this.value.length) ? this.dt.selection : [];
      if (UtilsService.notNull(this.maxSelectCount) && this.maxSelectCount > 0) {
        this.dt.selection.push(...data.filter((r, i) => !r.readonly && i < this.maxSelectCount));
      } else {
        this.dt.selection.push(...data.filter(r => !r.readonly));
      }
      this.dt.selection.forEach(row => row._sncrChecked = true);
      this.selectAll = true;
    } else {
      data.forEach(row => row._sncrChecked = false);
      this.maxSelectCountError = false;
      this.selectAll = false;
      this.selectedMap = new Map();
      if (this.currentValue.length !== this.value.length) {
        this.currentValue.forEach(currentVal => {
          let index = this.selection.findIndex(selec => {
            return selec === currentVal
          })
          if (index !== -1) {
            this.selection.splice(index, 1);
          }
        })
        oldSelectionCount = this.selection.length;
      } else {
        this.dt.selection = [];
        oldSelectionCount = this.selectCount;
      }
    }
    this.selectedMap = new Map();
    this.dt.selectionChange.emit(this.dt.selection);
    if (this.lazy) {
      let lazyParams = new LazyParams();
      lazyParams.configId = this.lazyLoadUrl.substring(this.lazyLoadUrl.lastIndexOf('/') + 1);
      lazyParams.selectAll = event.checked ? 'true' : 'false';
      lazyParams.filters = this.previousFilters.map(a => Object.assign({}, a));
      this.sncrDatatableService.updateOnSelectDeselectAll(lazyParams).subscribe(response => {
        if (event.checked) {
          this.selectCount = response.count || this.totalRecords;
        } else {
          this.selectCount = response.count || 0;
        }
        this.isSelectAllLoading = false;
        this.dt.onHeaderCheckboxToggle.emit({
          originalEvent: event, checked: event.checked, count: oldSelectionCount,
          loading: false
        });
      });
    } else {
      if (event.checked) {
        this.selectCount = this.totalRecords;
      } else {
        this.selectCount = 0;
      }
      this.dt.onHeaderCheckboxToggle.emit({
        originalEvent: event,
        checked: event.checked,
        count: oldSelectionCount
      });
    }
  }

  exportCustomCSV(overrideSelected: any[]) {
    let tempValue = this.dt.value;
    this.dt.value = overrideSelected ? overrideSelected :
      (this.selection && this.selection.length) ? this.selection : tempValue;
    this.dt.exportCSV();
    this.dt.value = tempValue;
  }

  colsChange(cols) {
    this.currentCols = cols.filter(c => c.show);

    if (!this.currentCols.length) {
      this.currentSelection = this.dt.selection === undefined ? null : [...this.dt.selection];
      this.selection = [];
      this.selectionChange.emit([]);
    } else if (this.currentSelection) {
      this.selection = this.currentSelection;
      this.currentSelection = null;
      this.selectionChange.emit(this.selection);

    }

  }

  rowClass(row) {
    let styleClass = '';
    if (row.editing) {
      styleClass += 'editRow';
    }
    if (row.color) {
      styleClass += ' ' + row.color;
    }
    return styleClass;
  }

  cbChange($event, row) {
    this.onDataChange.emit('cb_change');
    if (this.lazy) {
      let id = row[this.flowId];
      if (this.selectedMap.has(id)) {
        this.selectedMap.get(id)['sel'] = row._sncrChecked ? 'Y' : 'N';
      } else {
        this.selectedMap.set(id, {id: id, sel: row._sncrChecked ? 'Y' : 'N'});
      }
    }
    if (this.editing) {
      this.editForm.controls['_sncrChecked'].setValue(row._sncrChecked);
    } else {
      if (UtilsService.notNull(this.selection) && UtilsService.notNull(this.maxSelectCount) && this.maxSelectCount > 0) {
        this.maxSelectCountError = row._sncrChecked && this.selectCount >= this.maxSelectCount;
      }
      if (!this.maxSelectCountError) {
        this.selectCount = row._sncrChecked ? this.selectCount + 1 : this.selectCount - 1;
        this.dt.toggleRowWithCheckbox($event, row);
      } else {
        row._sncrChecked = false;
      }
    }
  }

  onEdit(row) {
    this.editing = Object.assign({}, row);
    row.editing = true;
    let group = {_sncrChecked: [row._sncrChecked]};
    this.cols.filter(c => !c.nonEditable).forEach(c => {
      if (c.type === 'boolean') {
        group[c.field] = [UtilsService.stringToBoolean(row[c.field])];
      } else {
        group[c.field] = [row[c.field]];
      }

      if (c.editInfo && c.editInfo.validators) {
        group[c.field].push(...c.editInfo.validators);
      }
    });

    this.editForm = this.formBuilder.group(group);

    setTimeout(() => {
      const input = this.dtWrapper.nativeElement.querySelector('.editRow')
        .querySelector('input:not([type="checkbox"]):not([type="radio"]),textarea');
      if (input) {
        input.focus();
      }
    });
    this.onOpenEdit.emit(row);
  }

  cancelEdit(row) {
    Object.keys(this.editing).forEach(k => {
      row[k] = this.editing[k];
    });
    row.editing = false;
    this.editing = null;
    this.onCancelEdit.emit(row);
  }

  saveEdit(row) {
    if (this.editForm.invalid) {
      this.showValidation = true;
    } else {
      this.showValidation = false;
      Object.keys(this.editForm.controls).forEach(k => {
        row[k] = this.editForm.controls[k].value;
      });

      row.editing = false;
      this.editing = null;
      if (row._sncrChecked !== null) {
        this.dt.toggleRowWithCheckbox({}, row);
      }
      this.onEditSave.emit(row);
    }
  }

  onDeleteRow(popup, row) {
    this.removableContent.message = this.removableContent.param1 = row[this.removableContent.name];
    this.removableContent.row = row;
    this.modalService.open(popup, {backdrop: 'static'});
  }

  deleteRow() {
    this.onDelete.emit(this.removableContent.row);
  }

  sortChecked(event) {
    this.onDataChange.emit('sort_change');
    this.currentValue.sort((a, b) => {
      let first = !!b._sncrChecked ? 1 : 0, second = !!a._sncrChecked ? 1 : 0;
      return (first - second) * event.order;
    });
    this.currentValue = [...this.currentValue];
    this.goToFirstPage();
  }

  customSortFunction(event, retainFilterOrder = false) {
    this.onDataChange.emit('sort_change');
    this.previousSort.field = event.field;
    this.previousSort.order = event.order;
    if (this.value && this.value.length > 0) {
      const col = this.cols.find(c => c.field === event.field);
      this.dt.value = UtilsService.notNull(this.dt.value) ? this.dt.value : this.value;
      this.dt.value.sort((data1, data2) => {
        let value1 = this.dt.resolveFieldData(data1, event.field);
        let value2 = this.dt.resolveFieldData(data2, event.field);
        if (UtilsService.notNull(col) && col.valueFunction) {
          value1 = col.valueFunction(value1);
          value2 = col.valueFunction(value2);
        }
        value1 = this.getTranslation(value1);
        value2 = this.getTranslation(value2);
        let result = null;

        if (value1 == null && value2 != null) {
          result = -1;
        } else if (value1 != null && value2 == null) {
          result = 1;
        } else if (value1 == null && value2 == null) {
          result = 0;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
          result = value1.localeCompare(value2);
        } else {
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        }

        return (event.order * result);
      });
      if (this.previousSort.field === event.field && this.previousSort.order !== event.order && !retainFilterOrder) {
        this.previousSort.order = event.order;
        this.dt.value.reverse();
      }
    }
    this.goToFirstPage();
  }

  public goToFirstPage() {
    this.dt.onPageChange({first: 0, rows: this.rows});
    this.first = 0;
  }

  onLazyLoadEvent(event: LazyLoadEvent) {
    if (this.lazyLoadUrl && this.isDataReloadRequired(event)) {
      setTimeout(() => {
        this.loading = true;
        this.dataLoadingProgress.next(this.loading);
      });
      Object.assign(this.lazyParams, event || {});
      this.lazyParams.filters = this.previousFilters.map(a => Object.assign({}, a));
      let url;
      if (this.lazyLoadUrl) {
        this.lazyParams['configId'] = this.lazyLoadUrl.substring(this.lazyLoadUrl.lastIndexOf('/') + 1);
        url = this.lazyLoadUrl.substring(0, this.lazyLoadUrl.lastIndexOf('/'));
      }

      let maxSelectionAPI;
      if (this.multiSelection) {
        this.lazyParams['selectAll'] = this.selectAll ? 'true' : 'false';
        this.lazyParams['maxSelectKey'] = this.maxSelectKey;
        maxSelectionAPI = this.sncrDatatableService.getmaxSelectCount(url, this.maxSelectKey);
      }

      if (this.allEditable && this.allEditForm) {
        this.lazyParams['editData'] = [...this.getEditedRows()];
      }

      let selections = this.selectedMap.size ? Array.from(this.selectedMap.values()) : [];
      let rows;
      if (url) {
        rows = this.sncrDatatableService.getData(url, this.lazyParams, selections);
      }
      let count;
      if (!this.countAlreadySet) {
        if (this.initNotLoaded || !this.totalRecordsWithoutFilter ||
          (UtilsService.notNull(this.previousFilters) && this.previousFilters.length > 0)) {
          count = this.sncrDatatableService.getCount(url, this.lazyParams);
        } else {
          count = this.totalRecordsWithoutFilter;
        }
      } else {
        count = this.totalRecords;
      }

      return Promise.all([rows, count, maxSelectionAPI])
        .then((res: any[]) => {
          const [response, c, maxSelection] = res;
          if (this.selectionMode !== 'radio') {
            this.selectedMap.clear();
          }
          let data = JSON.parse(response.rows);
          let editedData = response.editedRows;
          this.flowId = response.id ? response.id : '';

          if (this.multiSelection) {
            this.sncrDatatableService.getSelectCount(url, this.lazyParams).then((selectCount: any) => {
              this.selectCount = selectCount && selectCount.count ? selectCount.count : 0;
            });
            this.maxSelectCount = UtilsService.notNull(maxSelection)
            && UtilsService.notNull(maxSelection.maxSelectCount) ? Number.parseInt(maxSelection.maxSelectCount) : 0;
          }
          if (data && data.length) {
            data.map((row, i) => {
              if (row['_sncrChecked']) {
                if (this.lazy && this.selectionMode === 'radio') {
                  row['_sncrChecked'] = event.first + i;
                } else {
                  row['_sncrChecked'] = row['_sncrChecked'] === '1' || row['_sncrChecked'] === true;
                }
              } else {
                row['_sncrChecked'] = false;
              }
              return row;
            });
          }
          this.value = [...data];
          this.originalDataWithoutEdit = [...this.value.map(x => Object.assign({}, x))];
          this.selection = [];
          this.selection.push(...data.filter(val => val._sncrChecked));
          this.dt.selectionChange.emit(this.selection);
          this.totalRecords = c;
          if (this.initNotLoaded && !this.previousFilters.length) {
            this.totalRecordsWithoutFilter = c;
          }
          // this.rows = data.iDisplayLength;

          if (this.allEditable) {
            if (editedData && editedData.length) {
              let editedRowsData = [...this.prepopulateEditedData([...data], editedData)];
              if (editedRowsData && editedRowsData.length) {
                this.value = [...editedRowsData];
                this.totalRecords = c;
              }
            }
            let formArray: FormGroup[] = [];
            this.value.forEach(row => {
              let group = {};
              this.cols.filter(col => !col.nonEditable || col.requiredInForm).forEach(col => {
                if (col.type === 'boolean') {
                  group[col.field] = [UtilsService.stringToBoolean(row[col.field])];
                } else {
                  if (this.flowId === '1' && (col.field === BanSubConfig.IBAN || col.field === BanSubConfig.BIC)) {
                    // for ban maintain a copy of fields iban & bic since they are masked
                    group[col.field] = [UtilsService.maskAllButLastFour(row[col.field])];
                    group[col.field + '_copy'] = [row[col.field]];
                  } else {
                    group[col.field] = [row[col.field]];
                  }
                }
                if (col.editInfo && col.editInfo.validators) {
                  group[col.field].push(...col.editInfo.validators);
                }
              });
              row.form = this.formBuilder.group(group);
              formArray.push(row.form);
            });
            this.allEditForm = this.formBuilder.group({
              rows: this.formBuilder.array(formArray)
            });
            this.allEditFormChange.emit(this.allEditForm);

          }

          setTimeout(() => {
            if (this.lazyParams.first === 0) {
              this.first = 0;
            }
            this.loading = false;
            this.initNotLoaded = false;
            this.dataLoadingProgress.next(this.loading);
          });
        }).catch(error => console.log(error));
    }
  }

  radioChange(row, i) {
    this.value.forEach(r => {
      r._sncrChecked = null;
    });
    row._sncrChecked = i;
    if (this.lazy) {
      let id = row[this.flowId];
      this.selectedMap.forEach(map => {
        map['sel'] = 'N';
      });
      if (this.selectedMap.has(id)) {
        this.selectedMap.get(id)['sel'] = 'Y';
      } else {
        this.selectedMap.set(id, {id: id, sel: 'Y'});
      }
    }
    this.dt.selectRowWithRadio(null, row);
    this.onRadioChange.emit(row);
  }

  getEditedRows() {
    let editedRows = [];

    this.originalDataWithoutEdit.forEach((row, i) => {
      const rowFormControls = this.allEditForm.controls['rows']['controls'][i];
      const formRow = this.allEditForm.controls['rows']['controls'][i].controls;
      Object.keys(formRow).forEach(key => {
        const field = formRow[key];
        let val;
        if (field) {
          if (this.flowId === BanSubConfig.FL_TYPE_BAN && (key === BanSubConfig.IBAN || key === BanSubConfig.BIC)) {
            val = formRow[key + '_copy'] ? formRow[key + '_copy'].value : null;
          } else if (BanSubConfig.formControlCopies[this.flowId] && BanSubConfig.formControlCopies[this.flowId].includes(key)
            && field.disabled) {
            // if disabled for special cases then make it to empty
            val = typeof (field.value) === 'boolean' ? false : '';
          } else {
            val = field.value;
          }
        }

        if (rowFormControls.dirty) {
          if ((UtilsService.notNull(row[key]) || UtilsService.notNull(val))
            && ((typeof (val) === 'boolean' && row[key] !== val.toString().trim())
              || ((typeof (val) !== 'boolean') && val.trim() !== row[key])) && !key.includes('_copy')) {
            // the value is changed so set it with the new value and if type is boolean then ignore type and check
            editedRows.push({
              id: row[this.flowId],
              field: key,
              newValue: val.toString().trim()
            });
          }
          // if previously navigated to review and coming back again to edit page
          // changing back the value to same as original value then pass it backend
          // so that it can be deleted there

          if ((field.touched || (BanSubConfig.formControlCopies[this.flowId] &&
            BanSubConfig.formControlCopies[this.flowId].includes(key)))
            && ((typeof (val) === 'boolean' && row[key] === val.toString().trim())
              || ((typeof (val) !== 'boolean') && val.trim() === row[key])) && !key.includes('_copy')) {
            editedRows.push({
              id: row[this.flowId],
              field: key,
              newValue: val.toString().trim(),
              // mark the disabled as true so that it can be deleted in backend if it exists in db
              disabled: true
            });
          }
        }
      });
    });

    return editedRows;
  }


  prepopulateEditedData(actualRows: any[], editedRows: any[]): any[] {
    actualRows.forEach(row => {
      let editedRowsForFlowId = editedRows.filter(edited => edited.id === row[this.flowId]);

      let keys = Object.keys(row);

      editedRowsForFlowId.forEach(edited => {
        keys.forEach(key => {
          if (keys.includes(edited.field) && edited.field === key && UtilsService.notNull(edited.newValue)
            && ((typeof (edited.newValue) === 'boolean' && edited.newValue.toString() !== row[key])
              || (typeof (edited.newValue) !== 'boolean' && edited.newValue !== row[key]))) {
            // the value is changed so set it with the new value and if type is boolean then ignore type and check
            row[key] = edited.newValue;
          } else if (!keys.includes(edited.field) && edited.newValue) {
            // key doesnt exist in rows means it was null
            // add that key with modified data
            row[edited.field] = edited.newValue;
          }
        });
      });
    });
    return actualRows;
  }

  isDataReloadRequired(event: LazyLoadEvent): boolean {
    // check for pagination/filter/sorting if changed then only reload
    let newFilters = this.previousFilters;
    if (this.lazyParams && event) {
      if (event.first !== this.lazyParams.first || event.rows !== this.lazyParams.rows ||
        (this.lazyParams.filters.length !== newFilters.length ||
          !this.lazyParams.filters.every((v, i) => UtilsService.notNull(newFilters[i]) &&
            SncrDatatableComponent.compareFilters(v, newFilters[i]))) ||
        event.sortOrder !== this.lazyParams.sortOrder || event.sortField !== this.lazyParams.sortField ||
        this.initNotLoaded) {
        return true;
      }
    }
    return false;
  }

  handlePaymentFields(data: any) {
    this.paymentFieldsChanges.emit(data);
  }

  getForm(row) {
    return this.editForm || row.form;
  }

  toggleCheckbox(row: any, checked: boolean) {
    this.onDataChange.emit('cb_change');
    row._sncrChecked = checked;
  }

  getTranslation(key, prefix = null, params = {}) {
    if (isNaN(key)) {
      return this.sncrTranslate.getTranslation(key, prefix, params);
    } else {
      return key;
    }
  }

  // START: Temporary code for translations
  isNew() {
    if (this._isNew === null) {
      this._isNew = !this.resultMessage.length &&
        this.selectMessage === 'Teilnehmer' &&
        !this.selectionMessage.length &&
        !this.selectionTitle &&
        !this.header &&
        this.singleSelectionMsg === 'Ein' &&
        this.emptyMessage === 'Kein Ergebnis gefunden' &&
        (!this.removableContent || !this.removableContent.bodyTitle1);
      if (!this._isNew) {
        console.warn('[sncr-datatable] The usage of text parameters is drepecated.');
      }
    }
    return this._isNew;
  }

  getEmptyMessage(key) {
    return this.isNew() ? this.getTranslation(key, this.prefix) : this.emptyMessage;
  }

  getSelectionTitle(key) {
    return this.isNew() ? key :
      !this.selectionTitle ? 'Auswählen' : (!this.header ? this.selectionTitle : this.header);
  }

  // END

  getDtDataLoadFocus(): Observable<any> {
    return this.dataLoadingProgress.asObservable();
  }

  stringToBoolean(str: string): boolean {
    return UtilsService.stringToBoolean(str);
  }

  radioChecked(value): boolean {
    return value !== false && UtilsService.notNull(value);
  }

  getCol(col): any {
    return this.cols.find(c => c.field === col.field) || {};
  }

  /**
   * enabling  the radio button for the selected row - sort event
   * @param event
   */
  sort(event) {
    this.onDataChange.emit('sort_change');
    this.resetSelection();
  }

  onPageChange(event) {
    this.onDataChange.emit('page_change');
    this.dt.onPageChange(event);
    this.resetSelection();
  }

  resetSelection() {
    if (UtilsService.notNull(this.selectionMode) && this.selectionMode === 'radio') {
      this.dt.value.forEach((row, index) => {
        if (this.dt._selection === row) {
          row._sncrChecked = index;
        } else {
          row._sncrChecked = undefined;
        }
      });
    }
  }

  sortUpdatedValues() {
    if (UtilsService.notNull(this.previousSort.field)) {
      this.customSortFunction(this.previousSort, true);
    } else {
      this.customSortFunction({field: this.sortField, order: this.sortOrder}, true)
    }
  }

  assignToCol() {
    this.assignAll.emit(true);
  }
  resetSort() {
    this.dt.reset();
  }
}
