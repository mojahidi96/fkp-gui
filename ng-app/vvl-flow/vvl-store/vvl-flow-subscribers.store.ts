import {Action, State, StateContext, Store} from '@ngxs/store';
import {DatatableState} from '../../sncr-components/sncr-datatable/store/datatable.store';
import {ContinueFromSubscriberPanel,
  DownloadPdf,
  GetEligibleSubscribersForTariff,
  ProcessOrderSubmit,
  ResetRadio,
  SetDebitorDetails,
  SetSelectedTariff,
  SetShipmentDetails,
  ResetOrderSubmit} from './vvl-flow-subscribers.actions';
import {Injector} from '@angular/core';
import {SncrDatatableService} from '../../sncr-components/sncr-datatable/sncr-datatable.service';
import {VvlFlowSubscribersService} from './vvl-flow-subscribers.service';
import {OrderConfirmationService} from '../../order-confirm/order-confirmation.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {OrderType} from '../../order-confirm/order-confirm';
import {finalize} from 'rxjs/operators';
import {Overviewdetails} from '../../flow-sections/order-overview/overviewdetails';

export interface VvlFlowModel extends Overviewdetails {
  pleaseSelectTariff?: boolean;
  pleaseSelectSubscriber?: boolean;
  pleaseSelectArticle?: boolean;
  chooseNewAddress?: boolean;
}

@State<VvlFlowModel>({
  name: 'VvlFlowSubscribers',
  defaults: {
    configId: '6853c1d9-a9ae-425d-e053-1505100a82d5',
    multiSelection: true,
    lazy: true,
    isArticleNotRequired: 3,
    url: '/buyflow/rest/table/custom',
    vatPercentage: 19,
    selectedTariffGroup: 'none'
  }
})
export class VvlFlowSubscribersState extends DatatableState {


  constructor(private vvlFlowSubscribersService: VvlFlowSubscribersService,
              private orderConfirmationService: OrderConfirmationService,
              private statusNotify: NotificationHandlerService,
              protected injector: Injector, protected datatableService: SncrDatatableService, protected store: Store) {
    super(injector, datatableService, store);
  }


  @Action(ContinueFromSubscriberPanel)
  continueFromSubscriberPanel(sc: StateContext<VvlFlowModel>, {cardSelectionFlow}: ContinueFromSubscriberPanel) {
    let payload: any = {};
    const state = sc.getState();
    payload.url = state.url;
    payload.lazyParams = {...state.lazyParams};
    let lazyParams = {...state.lazyParams};
    lazyParams.selections = state.selectionMap ? [...state.selectionMap] : [];

    sc.patchState({
      processing: true
    });

    this.datatableService.persistSelections(lazyParams).subscribe(() => {
      state.selectionMap = [];
      this.datatableService.getSelectCount$(payload)
        .pipe(finalize(() => sc.patchState({processing: false})))
        .subscribe((response: any) => {
          let selectCount = response && response.count ? response.count : 0;
          if (selectCount) {
            cardSelectionFlow.alert.clearNotification();
            cardSelectionFlow.flow.model['selectCount'] = selectCount;
            cardSelectionFlow.flow.next(cardSelectionFlow.flow.model, true);
          } else {
            cardSelectionFlow.alert.printErrorNotification('SELECTION_TABLE-NONE_SELECTED_ERROR');
          }
        }, () => {
          cardSelectionFlow.alert.printErrorNotification('PROLONGATION-TECHNICAL_ERROR');

        });
    }, () => {
      cardSelectionFlow.alert.printErrorNotification('PROLONGATION-TECHNICAL_ERROR');
    });
  }

  @Action(ProcessOrderSubmit)
  processOrderSubmit(sc: StateContext<VvlFlowModel>) {
    // ToDo -- Process the order based on the cart created and get response(success/failure).. here response = orderSubmitted
    // Commenting this out until actual implementation is done
    // let orderRowMap = new Map<string, {}>();
    return sc.patchState({
      orderSubmitted: true,
      orderRows: []
    });
  }

  @Action(GetEligibleSubscribersForTariff)
  getEligibleSubscribersForTariff(sc: StateContext<VvlFlowModel>) {
    const state = sc.getState();
    this.vvlFlowSubscribersService.getEligibleSubscribers(state.selectedTariff).then(resp => {
      sc.patchState({eligibleSubscribersForTariff: resp});
    });
  }

  @Action(DownloadPdf)
  downloadPdf(sc: StateContext<VvlFlowModel>, {model}: DownloadPdf) {
    this.showInProgressMsg();
    this.orderConfirmationService.downloadPdf(model.orderNumber, OrderType[model.orderType]).subscribe(data => {
        window.location.href = '/buyflow/rest/orderflow/' + model.orderNumber
          + '/' + model.orderType + '/pdf?t=' + new Date().getTime();
      },
      error => this.retryMessage());
  }

  @Action(SetDebitorDetails)
  setDebitorDetails(sc: StateContext<VvlFlowModel>, {debitorDetails}: SetDebitorDetails) {
    return sc.patchState({debitorDetails});
  }

  @Action(SetShipmentDetails)
  setShipmentDetails(sc: StateContext<VvlFlowModel>, {shipmentDetails}: SetShipmentDetails) {
    return sc.patchState({shipmentDetails});
  }


  showInProgressMsg() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification('DOWNLOAD_IN-PROGRESS');
  }

  retryMessage() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification('ORDER_IN-PROGRESS');
  }

  @Action(SetSelectedTariff)
  setSelectedTariff(sc: StateContext<VvlFlowModel>, {selectedTariff}: SetSelectedTariff) {
    return sc.patchState({selectedTariff});
  }

  @Action(ResetRadio)
  resetRadio(sc: StateContext<VvlFlowModel>) {
    sc.patchState({isArticleNotRequired: 3});
  }

  /**
   * 
   * @param sc Reset order submit to false
   */
  @Action(ResetOrderSubmit)
  ResetOrderSubmit(sc: StateContext<VvlFlowModel>) {
    return sc.patchState({
      orderSubmitted: false,
      orderRows: []
    });
  }
}
