import {DatatableModel, DatatableState} from '../../../../sncr-components/sncr-datatable/store/datatable.store';
import {Action, State, StateContext, Store} from '@ngxs/store';
import {OrderStatusChange} from './landing-page-orders.actions';
import {LandingPageService} from '../landing-page.service';
import {SncrDatatableService} from '../../../../sncr-components/sncr-datatable/sncr-datatable.service';
import {Injector} from '@angular/core';
import {UtilsService} from '../../../../sncr-components/sncr-commons/utils.service';

export interface OrderManagerModel extends DatatableModel {
  processing?: boolean;
  statusChangeSuccess?: boolean;
  noOrderSelected?: boolean;
  error?: boolean;
  eligibilityFailed?: boolean;
  orderLocked?: boolean;
}

@State<OrderManagerModel>({
  name: 'OMFlow',
  defaults: {
    configId: '6f7ab7b1-13a8-72af-e053-1405100af944',
    multiSelection: true,
    lazy: true,
    url: '/buyflow/rest/table/custom'
  }
})
export class OrderManagerState extends DatatableState {
  constructor(private landingPageService: LandingPageService,
              protected injector: Injector, protected datatableService: SncrDatatableService, protected store: Store) {
    super(injector, datatableService, store);
  }

  @Action(OrderStatusChange)
  OrderStatusChange(sc: StateContext<OrderManagerModel>, {statusRequest}: OrderStatusChange) {
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
              if (res && res.success) {
                this.patchStateForStatusChange(sc, state, true, false, false);
              } else if (res && res.eligibilityFailed) {
                this.patchStateForStatusChange(sc, state, null, true, false);
              } else if (res && res.orderLocked) {
                this.patchStateForStatusChange(sc, state, null, false, true);
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

  patchStateForStatusChange(sc: StateContext<OrderManagerModel>, state: any, success: boolean, eligibilityFailed: boolean
    , orderLocked: boolean) {
    sc.patchState({
      processing: false,
      statusChangeSuccess: UtilsService.notNull(success) && success,
      eligibilityFailed: !UtilsService.notNull(success) && eligibilityFailed,
      orderLocked: !UtilsService.notNull(success) && orderLocked,
      error: UtilsService.notNull(success) && !success,
      noOrderSelected: !UtilsService.notNull(success) && state.selectCount === 0
    });
  }
}