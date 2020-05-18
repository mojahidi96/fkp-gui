import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';

import {LazyParams} from '../lazy-params';
import {Column} from './features/base';
import {getTypeHelper} from './features/helpers/type';
import {FilterService} from '../filter/filter.service';

abstract class AbstractDatatableService {
  abstract getData(
    url: string,
    lazyParams: Partial<LazyParams>,
    selections: any
  ): Promise<any>;

  abstract getCount(
    url: string,
    lazyParams: Partial<LazyParams>
  ): Promise<number>;

  abstract getSelectCount(url: string, lazyParams: any): Promise<any>;

  abstract getmaxSelectCount(url, maxSelectKey): Promise<any>;

  abstract updateOnSelectDeselectAll(lazyParams: {}): Observable<any>;

  abstract persistSelections(lazyParams: {}): Observable<any>;
}

@Injectable()
export class InMemorySncrDatatableService extends AbstractDatatableService {
  columns: Column[] = [];
  rows: any[] = [];
  selectionMap: Map<any, any> = new Map();

  // API for changing state for test purposes

  reset() {
    this.columns = [];
    this.rows = [];
    this.selectionMap = new Map();
  }

  setColumns(columns: Column[]) {
    this.columns = columns;
  }

  setRows(rows: any[]) {
    this.rows = rows;
  }

  async getData(
    url: string,
    lazyParams: Partial<LazyParams>,
    selections: any
  ): Promise<any> {
    const idField =
      this.columns[0].field === '_sncrChecked'
        ? this.columns[1].field
        : this.columns[0].field;

    // update selection map
    selections.forEach(selection => {
      this.selectionMap[selection.id] = selection.sel === 'Y';
    });

    // update rows
    this.rows.forEach(row => {
      const isChecked =
        (lazyParams.selectAll === 'true' &&
          this.selectionMap[row[idField]] !== false) ||
        (lazyParams.selectAll !== 'true' &&
          this.selectionMap[row[idField]] === true);
      row._sncrChecked = isChecked;
    });

    let rowsSubset = JSON.parse(JSON.stringify(this.rows));

    // filter
    rowsSubset = this.filterRows(rowsSubset, lazyParams);

    // sort
    const sortField = lazyParams.sortField;
    const sortColumn = this.columns.find(c => c.field === sortField);

    if (sortColumn !== undefined) {
      const sortColumnTypeHelper = getTypeHelper(sortColumn.type);
      const sortColumnCompare = sortColumnTypeHelper.compare.bind(
        sortColumnTypeHelper
      );

      rowsSubset.sort((a, b): number =>
        sortColumnCompare(a[sortField], b[sortField])
      );
    }

    const isDescendingSortOrder = lazyParams.sortOrder === -1;
    if (isDescendingSortOrder) {
      rowsSubset.reverse();
    }

    // paginate
    if (rowsSubset.length > lazyParams.rows) {
      rowsSubset = rowsSubset.slice(
        lazyParams.first,
        lazyParams.first + lazyParams.rows
      );
    }

    return {
      id: idField,
      rows: JSON.stringify(rowsSubset)
    };
  }

  private filterRows(rows, lazyParams) {
    if (lazyParams.filters.length > 0) {
      const filterService = new FilterService();
      rows = lazyParams.filters.reduce((acc, currentFilter) => {
        return [
          ...acc.filter(row => {
            let currentValue = row[currentFilter.column];

            return filterService.filter(currentValue, currentFilter);
          })
        ];
      }, rows);
    }

    return rows;
  }

  async getCount(
    url: string,
    lazyParams: Partial<LazyParams>
  ): Promise<number> {
    return this.filterRows(this.rows, lazyParams).length;
  }

  async getSelectCount(url: string, lazyParams: any): Promise<any> {
    const count = this.rows.filter(row => row._sncrChecked === true).length;

    return {
      count
    };
  }

  async getmaxSelectCount(url: any, maxSelectKey: any): Promise<any> {
    return {
      maxSelectCount: 5000
    };
  }

  updateOnSelectDeselectAll(lazyParams: Partial<LazyParams>): Observable<any> {
    const count =
      lazyParams.selectAll === 'true'
        ? this.filterRows(this.rows, lazyParams).length
        : 0;
    return of({count});
  }

  persistSelections(lazyParams: {}): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
