import {EventEmitter, Input, Output} from '@angular/core';

/**
 * Primeng datatable internal @inputs and @outputs
 * @internal
 */
export class DatatableBase {
  /**
   * Array of row objects with field per column.
   */
  @Input() value: any[];

  /**
   * Should the pagination component be displayed?
   */
  @Input() paginator = true;

  /**
   * Number of rows to be displayed per page.
   */
  @Input() rows = 10;

  /**
   * Total number of rows.
   * <div style="color: red">⚠ This is usually derived from value or in case of lazy-loading this will be set
   * in the onLazyLoadEvent handler after it has been provided from the DatatableService.
   * Is this actually needed as @Input?</div>
   */
  @Input() totalRecords: number;

  /**
   * Options for "Number of rows per page" select box.
   */
  @Input() rowsPerPageOptions = [5, 10, 20, 40, 80];

  /**
   * One of undefined, or "radio".
   * <div style="color: red">⚠ According to PrimeNG Datatable documentation v5, this property is expected to
   * be one of "single" or "multiple". It looks like we are abusing this property giving it our own semantics
   * but still passing it with an invalid value to PrimeNG.</div>
   */
  @Input() selectionMode: string;

  /**
   * Selected row in single mode or an array of values in multiple mode.
   */
  @Input() selection: any;

  /**
   * Event that is emitted when row selection changes.
   */
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  /**
   * Load data lazily from server while navigating the Datatable.
   */
  @Input() lazy = false;

  /**
   * Style class of the component.
   * <div style="color: red">⚠ This is currently only forwarded to PrimeNG, and only used sparingly.</div>
   */
  @Input() styleClass: string;

  /**
   * Name of the field to sort data by default.
   */
  @Input() sortField = '_sncrChecked';

  /**
   * Order to sort when default sorting is enabled.
   */
  @Input() sortOrder = 1;

  /**
   * Character to use as the CSV separator.
   */
  @Input() csvSeparator = ';';

  /**
   * Name of the exported file.
   */
  @Input() exportFilename = 'download';

  /**
   * Text to display when there is no data.
   * <div style="color: red">⚠ This is hard-coded German text which should be refactored away to the
   * new translation system.</div>
   */
  @Input() emptyMessage = 'Kein Ergebnis gefunden';

  /**
   * Position of the paginator.
   * <div style="color: red">⚠ This is currently not used and should be removed.</div>
   */
  @Input() paginatorPosition = 'top';

  /**
   * Adds hover effect to rows without the need for selectionMode.
   * <div style="color: red">⚠ There should be a common concept when/how to use hover effect.
   * Currently this only enabled on some data tables.</div>
   */
  @Input() rowHover: boolean;

  /**
   * Displays a loader to indicate data load is in progress.
   * <div style="color: red">⚠ This might be removed as @Input and just be used internally.</div>
   */
  @Input() loading: boolean;

  /**
   * <div style="color: red">⚠ This has no references at all. It is never used.</div>
   */
  @Input() enableLoader = false;

  /**
   * Index of the first row to be displayed. It supports two-way binding so that model value can
   * be updated on pagination as well.
   */
  @Input() first = 0;

  /**
   * Event that is emitted when Select All / Deselect All button is clicked.
   */
  @Output() onHeaderCheckboxToggle: EventEmitter<any> = new EventEmitter();

  /**
   * Callback to invoke when a row is selected.
   */
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

  /**
   * Callback to invoke when a row is unselected with metakey.
   */
  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

  /**
   * Callback to invoke when a row is clicked.
   */
  @Output() onRowClick: EventEmitter<any> = new EventEmitter();
}
