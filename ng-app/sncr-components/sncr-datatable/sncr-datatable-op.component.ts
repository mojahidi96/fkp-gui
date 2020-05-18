import {SncrDatatableComponent} from './sncr-datatable.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {LazyLoadEvent} from 'primeng/components/common/lazyloadevent';
import {DatatableModel} from './store/datatable.store';
import {SncrDatatableService} from './sncr-datatable.service';
import {FilterService} from './filter/filter.service';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CbChange, SelectionChangePayload} from './store/datatable.actions';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {TranslationService} from 'angular-l10n';
import {Filter} from './filter/filter';
import {Store} from '@ngxs/store';
import {Column} from './column';

@Component({
  selector: 'sncr-datatable-op',
  templateUrl: 'sncr-datatable.component.html',
  styleUrls: ['sncr-datatable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SncrDatatableOpComponent extends SncrDatatableComponent implements OnInit, OnChanges {

  @Input() state: DatatableModel;
  @Input() advSearchFilter = false;
  @Input() noDataFound: string;
  @Input() maxSelectKey = 'default-max-selection';

  @Output() onSelectionChange = new EventEmitter<SelectionChangePayload>();
  @Output() onColumnChange = new EventEmitter<Column[]>();

  /**
   * Callback to invoke when paging, sorting or filtering happens in lazy mode.
   */
  @Output() onLazyLoad: EventEmitter<any> = new EventEmitter();

  constructor(protected filterService: FilterService, protected formBuilder: FormBuilder,
              protected modalService: NgbModal, protected sncrDatatableService: SncrDatatableService,
              private cdr: ChangeDetectorRef, protected  sncrTranslateService: SncrTranslateService,
              private translation: TranslationService, private store: Store) {
    super(filterService, formBuilder, modalService, sncrDatatableService, sncrTranslateService);

    this.subscriptions$.push(translation.translationChanged().subscribe(() => cdr.markForCheck()));
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.state.maxSelectKey = this.maxSelectKey;
    const selectionChange$ = this.selectionChange.subscribe(event => {
      this.onSelectionChange.emit({selection: event});
    });

    const onHeaderCheckboxToggle$ = this.onHeaderCheckboxToggle.subscribe(event => {
      if (!event.checked) {
        this.state.maxSelectCountError = false;
      }
      this.onSelectionChange.emit({allSelected: event.checked});
    });

    this.subscriptions$.push(selectionChange$);
    this.subscriptions$.push(onHeaderCheckboxToggle$);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state && changes['state'] && !this.state.radioSelectedValue) {
      this.cols = this.state.cols || [];
      this.totalRecords = this.state.count;
      this.value = this.state.data;
      this.multiSelection = this.state.multiSelection;
      this.lazy = this.state.lazy;
      this.loading = this.state.loading;
      this.selection = this.state.selection;
      this.selectCount = this.state.selectCount;
      this.flowId = this.state.flowId;
      this.maxSelectCount = this.state.maxSelectCount;
      this.maxSelectCountError = this.state.maxSelectCountError;

      if (this.selection) {
        this.selection.forEach(row => this.toggleCheckbox(row, row._sncrChecked));
      }

      requestAnimationFrame(() => this.cdr.markForCheck());
    }
    if (this.advSearchFilter) {
      this.previousFilters = [];
      this.filtering(new Filter());
    }
  }

  cbChange($event, row) {
    this.store.dispatch(new CbChange({row}));

    if (this.editing) {
      this.editForm.controls['_sncrChecked'].setValue(row._sncrChecked);
    } else {
      this.dt.toggleRowWithCheckbox($event, row);
    }
  }

  colsChange(cols) {
    this.onColumnChange.emit(cols);
  }

  onLazyLoadEvent(event: LazyLoadEvent): any {
    if (this.isDataReloadRequired(event)) {
      const lazyParams = {
        ...event,
        filters: this.previousFilters,
        selectAll: this.selectAll ? 'true' : 'false',
        maxSelectKey: this.maxSelectKey
      };

      this.onLazyLoad.emit({lazyParams});

      if (event.first === 0) {
        this.first = 0;
        this.rows = event.rows;
      }
    }
  }

  toggleAllRowsWithCheckbox(event) {
    this.dt.onHeaderCheckboxToggle.emit({originalEvent: event, checked: event.checked});
    this.selectAll = event.checked;
  }

  resetPrevFilters() {
    this.previousFilters = [];
  }
}