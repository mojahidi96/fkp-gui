import {DatatableModel, DatatableState, SelectionModel} from '../../../../../sncr-components/sncr-datatable/store/datatable.store';
import {Action, State, StateContext, Store} from '@ngxs/store';
import {
  DownloadHistory,
  DownloadUOF,
  OrderStatusChange
} from './landing-page-orders.actions';
import {LandingPageService} from '../landing-page.service';
import {SncrDatatableService} from '../../../../../sncr-components/sncr-datatable/sncr-datatable.service';
import {Injector} from '@angular/core';
import {UtilsService} from '../../../../../sncr-components/sncr-commons/utils.service';
import {SelectionChange} from '../../../../../sncr-components/sncr-datatable/store/datatable.actions';
export interface EdOrderManagerModel extends DatatableModel {
  processing?: boolean;
  noOrderSelected?: boolean;
  error?: boolean;
  eligibilityFailed?: boolean;
  orderLocked?: boolean;
  messageKey?: string;
  updateOrder?: boolean;
  allOrderStatusList?: any;
  isSelectAll?: boolean;
}

@State<EdOrderManagerModel>({
  name: 'OMFlow',
  defaults: {
    configId: '79ff53c1-7d62-1cdc-e053-1505100ac187',
    multiSelection: true,
    lazy: true,
    url: '/buyflow/rest/table/custom'
  }
})
export class EdOrderManagerState extends DatatableState {
  constructor(private landingPageService: LandingPageService,
              protected injector: Injector, protected datatableService: SncrDatatableService, protected store: Store) {
    super(injector, datatableService, store);
  }

  @Action(OrderStatusChange)
  OrderStatusChange(sc: StateContext<EdOrderManagerModel>, {statusRequest}: OrderStatusChange) {
    const state = sc.getState();
    let lazyParams = {...state.lazyParams};
    lazyParams.selections = state.selectionMap ? [...state.selectionMap] : [];

    sc.patchState({
      processing: true
    });

    this.landingPageService.persistSelections(lazyParams).subscribe(() => {
      state.selectionMap = [];
      this.landingPageService.getSelectCount(state.configId).subscribe((response) => {
        state.selectCount = response && response.count ? response.count : 0;
        if (state.selectCount) {
          this.landingPageService.updateOrders(statusRequest.request).subscribe((res) => {
              if (res && res.updateOrder) {
                this.patchStateForStatusChange(sc, state, true, false, false, res.messageKey);
              } else if (res && res.eligibilityFailed) {
                this.patchStateForStatusChange(sc, state, null, true, false, res.messageKey);
              } else if (res && res.orderLocked) {
                this.patchStateForStatusChange(sc, state, null, false, true, res.messageKey);
              } else {
                this.patchStateForStatusChange(sc, state, false, false, false, res.messageKey);
              }
            },
            () => {
              this.patchStateForStatusChange(sc, state, false, false, false);
            }
          );
        } else {
          this.patchStateForStatusChange(sc, state, null, false, false);
        }
      }, () => {
        this.patchStateForStatusChange(sc, state, false, false, false);
      });
    }, () => {
      this.patchStateForStatusChange(sc, state, false, false, false);
    });
  }

  patchStateForStatusChange(sc: StateContext<EdOrderManagerModel>, state: any, success: boolean, eligibilityFailed: boolean
    , orderLocked: boolean, messageKey?: string) {
    sc.patchState({
      processing: false,
      eligibilityFailed: !UtilsService.notNull(success) && eligibilityFailed,
      orderLocked: !UtilsService.notNull(success) && orderLocked,
      error: UtilsService.notNull(success) && !success,
      noOrderSelected: !UtilsService.notNull(success) && state.selectCount === 0,
      updateOrder: UtilsService.notNull(success) && success,
      messageKey: messageKey
    });
  }

  @Action(DownloadHistory)
  DownloadHistory(sc: StateContext<EdOrderManagerModel>) {
    this.downloadAction(sc, 'history');
  }

  @Action(DownloadUOF)
  DownloadUOF(sc: StateContext<EdOrderManagerModel>) {
    this.downloadAction(sc, 'uof');
  }

  downloadSelections(keyUrl) {
    window.location.href = `/ed/rest/exportedfile/download/${keyUrl}?t=${new Date().getTime()}`;
  }

  private downloadAction(sc: StateContext<EdOrderManagerModel>, key: string) {
    const state = sc.getState();
    let lazyParams = {...state.lazyParams};
    lazyParams.selections = state.selectionMap ? [...state.selectionMap] : [];
    sc.patchState({processing: true});

    this.landingPageService.persistSelections(lazyParams).subscribe(() => {
      this.landingPageService.getSelectCount(state.configId).subscribe((response) => {
        state.selectCount = response && response.count ? response.count : 0;
        if (state.selectCount) {
          this.downloadSelections(key);
          sc.patchState({processing: false});
        } else {
          sc.patchState({
            processing: false,
            noOrderSelected: state.selectCount === 0
          });
        }
      });
    });
  }

  @Action(SelectionChange)
  selectionChange(sc: StateContext<EdOrderManagerModel>, {payload}: SelectionChange) {
    sc.patchState({
      processing: true,
      isSelectAll: false
    });
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
          this.landingPageService.getAllOrderStatusList().subscribe(allOrderStatusList => {
            sc.patchState({
              allOrderStatusList: allOrderStatusList,
              isSelectAll: true,
              processing: false
            });
            this.patchStateForSelectDeselectAll(sc, payload, state.data, state, response.count);
          });
        });
      } else {
        this.patchStateForSelectDeselectAll(sc, payload, state.data, state);
        sc.patchState({
          allOrderStatusList: [],
          isSelectAll: false,
          processing: false
        });
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
        selectionMap,
        processing: false,
        allOrderStatusList: [],
        isSelectAll: false
      });
    }
  }
}