import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {LoadColumns, LoadData, SelectionChange} from '../sncr-components/sncr-datatable/store/datatable.actions';
import {Observable, Subscription} from 'rxjs';
import {VvlFlowModel, VvlFlowSubscribersState} from './vvl-store/vvl-flow-subscribers.store';
import {Language, TranslationService} from 'angular-l10n';
import {
  ContinueFromSubscriberPanel,
  DownloadPdf,
  ProcessOrderSubmit, ResetOrderSubmit
} from './vvl-store/vvl-flow-subscribers.actions';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {OrderConfirmDetails, OrderDetails} from '../order-confirm/order-confirm';
import {Column} from '../sncr-components/sncr-datatable/column';
import {VvlFlowSubscribersService} from './vvl-store/vvl-flow-subscribers.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TimeoutService} from '../app/timeout/timeout.service';
import {OrderReviewService} from '../flow-sections/order-review/order-review.service';
import {OrderReviewComponent} from '../flow-sections/order-review/order-review.component';
import {PrefilledShoppingCart} from '../flow-sections/sncr-prefilled-shopping-cart/prefilled-shopping-cart';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {FileExportService} from '../sncr-components/sncr-commons/file-export.service';
import {SncrDatatableOpComponent} from '../sncr-components/sncr-datatable/sncr-datatable-op.component';

@Component({
  selector: 'vvl-flow',
  templateUrl: 'vvl-flow.component.html',
  styleUrls: ['vvl-flow.component.scss']
})
export class VvlFlowComponent extends PrefilledShoppingCart implements OnInit, OnDestroy {
  @Language() lang: string;
  // NGXS states
  @Select(VvlFlowSubscribersState) datatableState$: Observable<VvlFlowModel>;

  // Templates
  @ViewChild('socs', {static: true}) gridSocs;
  @ViewChild('prolongEligible', {static: true}) prolongEligible;
  @ViewChild('orderNumberPDF', {static: true}) orderNumberPDF;
  @ViewChild('multipleOrderDetails') multipleOrderDetails;
  @ViewChild('orderreview') orderreview: OrderReviewComponent;
  @ViewChild('subscriberTable') subscriberTable: SncrDatatableOpComponent;

  subsFlowSortField = '60';
  orderDetails: OrderConfirmDetails;
  private submitOrderDetails: OrderDetails;
  orderSubmitted: boolean;
  orderCols: Column[];
  orderRows = [];
  subscriptions$: Subscription[] = [];
  processing = false;
  isArticleNotRequired: boolean;
  isArticleChanged = false;
  isSocChanged = false;
  isShipmentChanged = false;
  count: number;
  eligibleSubsHardware: any;
  isLoading = false;
  countries = [];
  pattern: any;
  showExtendedAvailability = false;
  isSammelDChanged = false;
  reloadSubs = false;
  debitorSetting: any;
  showValidation = false;
  orderType = 'PROLONG_SUBSCRIBER';
  disableMessage = false;
  portalEsimEnabled = 'false';

  uploadUrl = '/buyflow/rest/fileimport/excelchanges/997cdc1e-570d-0ff9-e053-1e07100afd26';

  constructor(private store: Store,
              protected route: ActivatedRoute,
              private vvlFlowSubscribersService: VvlFlowSubscribersService,
              public subsAlert: NotificationHandlerService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              protected timeoutService: TimeoutService,
              protected orderService: OrderReviewService,
              protected shoppingCartService: ShoppingCartService,
              private fileExportService: FileExportService,
              private translation: TranslationService,
              private router: Router) {
    super(route, timeoutService, orderService, shoppingCartService);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.subscriptions$.push(this.router.events.subscribe((e: any) => {
      if (this.reloadSubs && e instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    }));
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isArticleNotRequired = true;
    this.reloadSubs = false;
    window.scrollTo(0, 0);
    this.route.data.subscribe((data: { countries: any[], pattern: any}) => {
      if (data.countries && JSON.stringify(data.countries) !== '{}') {
        this.countries = Object.keys(data.countries).map(key => {
          let obj = {};
          obj['text'] = data.countries[key];
          obj['value'] = key.split('-')[1];
          return obj;
        });
      }
      this.pattern = data.pattern ? data.pattern : null;
    });
    this.subsAlert = this.notificationHandlerFactory();
    this.orderCols = [
      {title: 'ORDER_CONFIRMATION-CUSTOMER_NUMBER', field: 'ban', filter: false, show: true},
      {title: 'ORDER_CONFIRMATION-NO_OF_PARTICIPANTS', field: 'affectedSubscriberCount', filter: false, show: true},
      {title: 'ORDER_CONFIRMATION-ORDER_NUMBER', field: 'orderNumber', show: true, filter: false, bodyTemplate: this.orderNumberPDF}
    ];
    this.subscriptions$.push(
      this.datatableState$.subscribe(value => {
          this.submitOrder(value);
      }));
    this.store.dispatch(new LoadColumns({lazy: true}));
    this.store.dispatch(new ResetOrderSubmit());
    this.portalEsimEnabled = this.translation.translate('PORTAL_ESIM_ENABLED');
  }

  private submitOrder(value: VvlFlowModel) {
    if (this.subsFlow && value.selectionMap) {
      this.subsFlowModel.selectionMap = value.selectionMap.filter( item => {
        return item.sel === 'Y';
      });
      this.subsFlowModel.selectCount = value.selectCount ? value.selectCount : this.subsFlowModel.selectCount;
      this.subsFlow['model'] = this.subsFlowModel;
    }

    this.count = 0;
    this.processing = value.processing || value.selectAllLoading;
    if (value.cols) {
      if (value.cols.some(c => c.field === '40' && !c.bodyTemplate)) {
        value.cols.find(c => c.field === '40')['bodyTemplate'] = this.gridSocs;
      }
      if (value.cols.some(c => c.field === '57' && !c.bodyTemplate)) {
        value.cols.find(c => c.field === '57')['bodyTemplate'] = this.prolongEligible;
      }
    }
    if (value.data) {
      this.showExtendedAvailability = value.data.some(d => d.color === 'partialEligible');
    } else {
      this.showExtendedAvailability = false;
    }
    let isOrderSubmitted = value.orderSubmitted;
    if (!UtilsService.notNull(this.orderreview)) {
      this.orderSubmitted = false;
      this.isLoading = false;
      delete this.orderDetails;
      delete this.submitOrderDetails;
      delete this.orderRows;
    }
    if (isOrderSubmitted && UtilsService.notNull(this.orderreview) && !this.reloadSubs) {
      this.reloadSubs = true;
      this.submitOrderDetails = new OrderDetails();
      this.submitOrderDetails.type = 'prolongationDTO';
      this.orderDetails = new OrderConfirmDetails;
      this.orderreview.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
      this.isLoading = true;
      this.vvlFlowSubscribersService.getOrdersDetails(this.submitOrderDetails)
        .subscribe((data) => {
          if (UtilsService.notNull(data)) {
            this.orderRows = [];
            this.orderDetails.count = Object.keys(data).length;
            Object.keys(data).forEach(key => {
              this.orderRows.push({
                'orderNumber': key,
                'affectedSubscriberCount': data[key]['subsCount'],
                'ban': data[key]['ban'],
                'orderType': data[key]['orderType']
              });
            });
          } else {
            /*this.submitErrorNotify.printErrorNotification(this.constants.technicalErrorText);*/
          }
          this.orderSubmitted = value.orderSubmitted;
          this.orderDetails.mutlipleOrders = []; // just make this property true
          this.orderDetails.multipleOrdersTemplate = this.multipleOrderDetails;
          this.orderDetails.description = 'CONFIRM-DESCRIPTION';
        });
    }
  }

  onLazyLoad(event) {
    this.store.dispatch(new LoadData(event));
  }

  onSelectionChange(event) {
    this.store.dispatch(new SelectionChange(event));
  }

  /** Start store navigation events **/
  
  nextSectionAfterSubscriber() {
    this.tariffFlow['reload'] = false;
    this.disableMessage = true;
    this.store.dispatch(new ContinueFromSubscriberPanel({
      flow: this.subsFlow,
      alert: this.subsAlert
    }));
  }

  nextSectionAfterHardware(event) {
    this.isArticleChanged = !this.isArticleChanged;
    this.isArticleNotRequired = event.isArticleNotRequired !== 0;
    if ((event.isArticleNotRequired !== 3 && event.eligibleSubsCountFormHardware !== 0)) {
      this.hardwareFlow.next(this.hardwareFlow.model, true);
      this.eligibleSubsHardware = event.eligibleSubsHardware;
    }
  }

  nextSection(event, flow) {
    if (UtilsService.notNull(event.selectedTariffGroup)) {
      this.tariffFlow['tariffModel'] = event;
      this.hardwareFlow.reload = false;
    }
    if (UtilsService.notNull(event.addressType)) {
      if (event.addressType === 'DEBITOR') {
        this.debitorFlow.model.debitorNum = event.selectedAddress.debitorNumber || '';
        this.debitorAddress = event.selectedAddress;    
      } else if (event.addressType === 'SHIPMENT') {
        this.isShipmentChanged = !this.isShipmentChanged;
        this.shippingFlow.model.debitorNum = event.selectedShipAddress.debitorNumber || '';
        this.shippingFlow['selectedShipmentAddress'] = event.selectedShipAddress;
        if (this.debitorAddress.debitorType === 'S') {
          this.isSammelDChanged = !this.isSammelDChanged;
        }
      }
    }
    flow.next(flow.model, true);
  }

  nextSectionAfterSoc(selectedSocs) {
    if (!this.isArticleNotRequired) {
      this.debitorFlow.reload = false;
    }
    delete this.selectedShipmentAction;
    this.socFlow.model['selectedSocs'] = selectedSocs;
    this.isSocChanged = !this.isSocChanged;
    this.socFlow.next(this.socFlow.model, true);
  }

  processOrderSubmit() {
    window.scrollTo(0, 0);
    this.isLoading = true;
    this.store.dispatch(new ProcessOrderSubmit());
  }

  showDebitorInfo(): boolean {
    if (this.debitorAddress && this.debitorAddress.debitorType === 'S') {
      return true;
    }
    if (UtilsService.notNull(this.debitorSetting)) {
      return this.debitorSetting && this.debitorSetting.hideDebitorDetails ? this.debitorSetting.hideDebitorDetails !== 'Y' : true;
    } else {
      return this.debitorAddress && this.debitorAddress.hideDebitorDetails
        ? this.debitorAddress.hideDebitorDetails !== 'Y' : true;
    }
  }

  /** End store navigation events **/


  getSocs(socs: string) {
    if (UtilsService.notNull(socs) && !UtilsService.isEmpty(socs)) {
      return socs.split(';');
    } else {
      return [];
    }
  }

  downloadPdf(orderNumber: string, orderType: string) {
    this.store.dispatch(new DownloadPdf({
      orderNumber,
      orderType
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

  onColumnChange(event) {
    this.store.dispatch(new LoadColumns({columns: event}));
  }

  reloadSubsTable(uploadResp: any): void {
    this.disableMessage = false;
    if (!UtilsService.isEmpty(uploadResp) && !UtilsService.isEmpty(uploadResp.eligibleSubs)) {
      this.subscriberTable.state.selectionMap = this.subscriberTable.state.selectionMap.filter(
        selected => !uploadResp.eligibleSubs.find(data => data === selected.id
      ));
      this.subscriberTable.resetAllFilters();
    }
  }

  exportcsv(): void {
    let filedata = [];
    this.tariffFlow['tariffModel'].selectedTariff.inEligibleSubs.forEach( item => {
      filedata.push({Rufnummer: item});
    });
    this.fileExportService.exportAsExcelFile(filedata, 'Teilnehmerdaten_' + this.tariffFlow['tariffModel'].selectedTariff.tariffOption,
      'Teilnehmerdaten');
  }
}
