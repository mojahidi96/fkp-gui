import {Action, State, StateContext, Store} from '@ngxs/store';
import {
  CbChange,
  LoadColumns,
  LoadData,
  ShowLoader,
  RetrieveData,
  SelectionChange,
  SelectionChangePayload
} from './datatable.actions';
import {SncrDatatableService} from '../sncr-datatable.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UtilsService} from '../../sncr-commons/utils.service';
import {LazyParams} from '../lazy-params';
import {Injector} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {flatMap} from 'rxjs/internal/operators';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

export interface SelectionModel {
  id: string;
  sel: 'Y' | 'N';
}

export interface DatatableModel {
  cols?: any[];
  configId?: string;
  count?: number;
  _count?: number;
  data?: any[];
  flowId?: string;
  multiSelection?: boolean;
  lazy: boolean;
  lazyParams?: LazyParams;
  loading?: boolean;
  deleteProcessing?: boolean;
  errorMessage?: string;
  selectAll?: boolean;
  selection?: any[];
  selectionMap?: SelectionModel[];
  selectCount?: number;
  url?: string;
  selectAllLoading?: boolean;
  radioSelectedValue?: any;
  maxSelectCount?: number;
  maxSelectCountError?: boolean;
  maxSelectKey?: string;
}

@State<DatatableModel>({
  name: 'datatable'
})
export class DatatableState {

  constructor(protected injector: Injector, protected datatableService: SncrDatatableService, protected store: Store) {

  }

  @Action(LoadColumns)
  loadColumns(sc: StateContext<DatatableModel>, {payload}: LoadColumns) {
    if (payload.lazy) {
      sc.patchState({
        selection: [],
        selectionMap: []
      });
      const state = sc.getState();
      return this.datatableService.getColumns$(state.url, {configId: state.configId}).pipe(
        tap((cols: any[]) => {
          sc.patchState({cols});
        })
      );
    } else {
      sc.patchState({
        cols: payload.columns
      });
    }
  }

  @Action(LoadData)
  loadData(sc: StateContext<DatatableModel>, {payload}: LoadData) {
    sc.patchState({
      lazyParams: payload.lazyParams,
      loading: true
    });

    this.store.dispatch(new RetrieveData(payload));
  }

  @Action(ShowLoader)
  showLoader(sc: StateContext<DatatableModel>) {
    sc.patchState({
      loading: true
    });
  }

  @Action(RetrieveData)
  retrieveData(sc: StateContext<DatatableModel>, {payload}: RetrieveData) {
    const state = sc.getState();

    payload.url = state.url;
    payload.lazyParams.configId = state.configId;
    payload.selectAll = state.selectAll;
    payload.selections = [...state.selectionMap];

    const data$ = this.datatableService.getData$(payload).pipe(
      tap((data: any) => data.rows = JSON.parse(data.rows))
    );
    const count$ = this.datatableService.getCount$(payload);
    const selectCount$ = state.multiSelection ? this.datatableService.getSelectCount$(payload) : of(0);
    const maxSelectCount$ = this.datatableService.getmaxSelectCount(payload.url, state.maxSelectKey);

    return data$.pipe(
      flatMap(d => forkJoin(of(d), count$, selectCount$, maxSelectCount$)),
      tap((result: any[]) => {
        const [data, count, selectCount, maxSelectCount] = result,
          currentSelectCount = (selectCount && selectCount.count) || 0;

        let selectionMap = [...state.selectionMap];
        data.rows.forEach((row) => {
          row['_sncrChecked'] = (row['_sncrChecked'] === '1' || row['_sncrChecked']) === true;
          if (row['_sncrChecked']) {
            selectionMap = this.mergeSelectionMap(
              [...selectionMap],
                {id: row[data.id], sel: row._sncrChecked ? 'Y' : 'N'} as SelectionModel
            );
          }
        });

        sc.patchState({
          count,
          _count: UtilsService.notNull(state._count) ? state._count : count,
          data: data.rows,
          flowId: data.id,
          lazyParams: payload.lazyParams,
          loading: false,
          selection: [],
          selectionMap,
          selectCount: currentSelectCount,
          maxSelectCount: Number.parseInt(maxSelectCount.maxSelectCount)
        });
      })
    );
  }

  @Action(SelectionChange)
  selectionChange(sc: StateContext<DatatableModel>, {payload}: SelectionChange) {
    const state = sc.getState(),
      id = state.flowId;

    if (UtilsService.notNull(payload.allSelected)) {
      state.data.forEach(r => {
        if (!r.readonly && !r.selectHidden) {
          r._sncrChecked = payload.allSelected;
        }
      });

      if (state.lazy) {
        sc.patchState({selectAllLoading: true});
        let lazyParams = {...state.lazyParams};
        lazyParams.selectAll = payload.allSelected ? 'true' : 'false';
        this.datatableService.updateOnSelectDeselectAll(lazyParams).subscribe(response => {
          this.patchStateForSelectDeselectAll(sc, payload, state.data, state, response.count);
        });
      } else {
        this.patchStateForSelectDeselectAll(sc, payload, state.data, state);
      }
    } else {
      let selectionMap = [...state.selectionMap];
      if (!state.selectAll && !state.maxSelectCountError) {
        selectionMap = this.mergeSelectionMap(
          [...selectionMap],
          ...payload.selection.map(s => {
            return {id: s[id], sel: s._sncrChecked ? 'Y' : 'N'} as SelectionModel;
          })
        );
      }

      sc.patchState({
        // selectAll: selectCount === state.count,
        selection: payload.selection,
        selectionMap
      });
    }
  }

  @Action(CbChange)
  cbChange(sc: StateContext<DatatableModel>, {payload}: CbChange) {
    let maxSelectCountError;
    let row = payload.row;
    const state = sc.getState(),
      id = state.flowId;

    if (UtilsService.notNull(state.maxSelectCount) && state.maxSelectCount > 0) {
      maxSelectCountError = row._sncrChecked && state.selectCount >= state.maxSelectCount;
      if (maxSelectCountError) {
        row._sncrChecked = false;
      }
    }

    const selectionMap: SelectionModel[] = maxSelectCountError ? [...state.selectionMap] : this.mergeSelectionMap(
            [...state.selectionMap], {id: row[id], sel: row._sncrChecked ? 'Y' : 'N'}
        );
    const selectCount = state.selectCount + (maxSelectCountError ? 0 : row._sncrChecked ? 1 : -1);

    sc.patchState({
      selectionMap,
      selectCount,
      maxSelectCountError
    });
  }

  patchStateForSelectDeselectAll(sc: StateContext<DatatableModel>, payload: SelectionChangePayload, data: any, state: any,
                                 selectCount?: number) {
    sc.patchState({
      data,
      selectAll: payload.allSelected,
      selection: payload.allSelected ? state.data : [],
      selectionMap: [],
      selectCount: state.lazy ? selectCount || 0 : state.count,
      selectAllLoading: false
    });
  }

  protected mergeSelectionMap(current: any[], ...values): SelectionModel[] {
    values.forEach(value => {
      let i = current.findIndex(c => c.id === value.id);
      if (current[i]) {
        current[i] = value;
      } else {
        current.push(value);
      }
    });

    return [...current];
  }
}