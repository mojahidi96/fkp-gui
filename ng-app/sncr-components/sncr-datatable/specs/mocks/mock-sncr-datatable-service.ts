import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import Utils from '../utils';
import {SncrDatatableService} from '../../sncr-datatable.service';
import {FilterService} from '../../filter/filter.service';
import {LazyParams} from '../../lazy-params';

@Injectable()
export class MockSncrDatatableService {
  rows = Utils.generateValueForCols();

  static areDirtyFormsInvalid(rowsForm) {
    return SncrDatatableService.areDirtyFormsInvalid(rowsForm);
  }

  getData(
    url: string,
    lazyParams: Partial<LazyParams>,
    selections: any
  ): Promise<any> {
    if (lazyParams.configId === 'emptyTable') {
      return of({
        rows: JSON.stringify([])
      }).toPromise();
    }

    let newRows = this.rows;

    if (lazyParams.filters.length > 0) {
      const filterService = new FilterService();
      newRows = lazyParams.filters.reduce((rows, currentFilter) => {
        return [
          ...rows.filter(row => {
            let currentValue = row[currentFilter.column];

            return filterService.filter(currentValue, currentFilter);
          })
        ];
      }, newRows);
    }

    if (lazyParams.sortField !== '_sncrChecked') {
      newRows.sort(
        Utils.getSortFnct(lazyParams.sortField, lazyParams.sortOrder)
      );
    }

    if (newRows.length > lazyParams.rows) {
      newRows = newRows.slice(
        lazyParams.first,
        lazyParams.first + lazyParams.rows
      );
    }

    return of({
      rows: JSON.stringify(newRows),
      id: 'age'
    }).toPromise();
  }

  getCount(url: string, lazyParams: Partial<LazyParams>): Promise<any> {
    let count = lazyParams.configId === 'emptyTable' ? 0 : this.rows.length;
    return of(count).toPromise();
  }

  getSelectCount(url: string, lazyParams: Partial<LazyParams>): Promise<any> {
    return of({count: 0}).toPromise();
  }

  // TODO: match appropriate structure for the current API calls
  getmaxSelectCount(url, maxSelectKey): Promise<any> {
    return of(0).toPromise();
  }

  updateOnSelectDeselectAll(lazyParams: Partial<LazyParams>): Observable<any> {
    const count = lazyParams.selectAll ? this.rows.length : 0;
    return of(count);
  }

  persistSelections(lazyParams: Partial<LazyParams>): Observable<any> {
    return of(0);
  }
}
