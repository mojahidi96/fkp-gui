import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { Language, TranslationService } from 'angular-l10n';
import { NotificationHandlerService } from '../sncr-components/sncr-notification/notification-handler.service';
import { OrderConfirmDetails, OrderDetails, OrderType } from '../order-confirm/order-confirm';
import { Column } from '../sncr-components/sncr-datatable/column';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OrderReviewComponent } from '../flow-sections/order-review/order-review.component';
import { SubscriberType } from '../subscribers-selection/subscriber-selection';
import { TimeoutService } from '../app/timeout/timeout.service';
import { OrderReviewService } from '../flow-sections/order-review/order-review.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { PrefilledShoppingCart } from '../flow-sections/sncr-prefilled-shopping-cart/prefilled-shopping-cart';
import { SncrDatatableService } from '../sncr-components/sncr-datatable/sncr-datatable.service';
import { SncrDatatableComponent } from '../sncr-components/sncr-datatable/sncr-datatable.component';
import { UtilsService } from '../sncr-components/sncr-commons/utils.service';
import { CustomValidators } from '../sncr-components/sncr-controls/custom-validators';
import { CONSTANTS } from '../soc-management/constants';
import { BanSubConfig } from '../ban-sub-common/ban-sub.config';
import { DownloadParams } from '../sncr-components/sncr-download-selections/downloadParams';
import { MSISDNResolverService } from '../ban-sub-common/msisdn-resolver-service';
import { OrderConfirmationService } from '../order-confirm/order-confirmation.service';
import { UploadChangesService } from './../upload-changes/upload-changes.service';


@Component({
  selector: 'activation-flow',
  templateUrl: 'activation-flow.component.html',
  styleUrls: ['activation-flow.component.scss']
})
export class ActivationFlowComponent extends PrefilledShoppingCart implements OnInit, OnDestroy {
  @Language() lang: string;

  @ViewChild('subscriberTable') subsDatatable: SncrDatatableComponent;
  // Templates
  @ViewChild('orderNumberPDF', { static: true }) orderNumberPDF;
  @ViewChild('multipleOrderDetails') multipleOrderDetails;
  @ViewChild('orderreview') orderreview: OrderReviewComponent;
  @ViewChild('subsWithBan', { static: true }) subsWithBan;
  @ViewChild('methodShortDesc', {static: true}) methodShortDesc;

  subsFlowSortField = '60';
  orderDetails: OrderConfirmDetails;
  private submitOrderDetails: OrderDetails;
  orderSubmitted: boolean;
  orderCols: Column[];
  orderRows = [];
  subscriptions$: Subscription[] = [];
  processing = false;

  hideHandyStepper = false;
  isTariffChanged = false;
  isSocChanged = false;
  isSammelDChanged = false;

  debitorSetting: any;
  debitorAddress: any;
  count: number;
  eligibleSubsHardware: any;
  isLoading = false;
  countries = [];
  subsCountries = [];
  pattern: any;
  showExtendedAvailability = false;
  reloadSubs = false;

  columns = [];
  msisdn = [];
  lazyLoadUrl: string;
  orderType = 'ACTIVATE_SUBSCRIBER';
  selectedBan: any;
  subsCount: string;
  showValidation = false;
  isArticleChanged = false;
  isShipmentChanged = false;
  selectedSim = 'NEW_SIM';

  flowType = '';
  subSelectionCol = [];
  simTypes = [];
  sublazyLoadUrl = '';
  selectionConfigId = '98cc3fa1-0a5d-628e-e053-1e07100ac6ec';
  subsManageChanges: any;
  private orderReviewNotify: NotificationHandlerService;
  submitErrorNotify: NotificationHandlerService;
  private orderReviewCartNotify: NotificationHandlerService;
  orderProcessing: boolean;
  constants: CONSTANTS;
  tariffFlowNextButtonLabel: any = 'HARDWARE_SELECTION-NEXT_BUTTON';

  disableMessage = false;
  uploadUrl = '/buyflow/rest/fileimport/excelchanges/98cc3fa1-0a5d-628e-e053-1e07100ac6ec';
  downloadParams = new DownloadParams();
  invalidSubsParams = new DownloadParams();
  hideSubsTable = false;
  uploadRes: any;
  showSubsSuccess = false;
  successMsg = '';
  isWifiSocSelected = false;
  subscriberList = [];

  constructor(private store: Store,
    protected route: ActivatedRoute,
    public subsAlert: NotificationHandlerService,
    @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
    protected timeoutService: TimeoutService,
    protected orderService: OrderReviewService,
    protected shoppingCartService: ShoppingCartService,
    protected datatableService: SncrDatatableService,
    private orderReviewService: OrderReviewService,
    public translation: TranslationService,
    private router: Router,
    private orderConfirmationService: OrderConfirmationService,
    private uploadChangesService: UploadChangesService,
    private msisdnResolverService: MSISDNResolverService,
    public notifyUploadSubsError: NotificationHandlerService,
    ) {
    super(route, timeoutService, orderService, shoppingCartService);

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.subscriptions$.push(this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (this.reloadSubs && e instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    }));
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.orderProcessing = false;
    this.constants = new CONSTANTS;
    this.orderReviewNotify = this.notificationHandlerFactory();
    this.submitErrorNotify = this.notificationHandlerFactory();
    this.orderReviewCartNotify = this.notificationHandlerFactory();
    this.flowType = BanSubConfig.FL_TYPE_ACT_SUB;

    this.datatableService.getColumns$('/buyflow/rest/table/custom', { configId: this.selectionConfigId }).subscribe(cols => {
      this.subSelectionCol = cols;
      if (this.subSelectionCol.find(c => c['field'] === '28')) {
        this.subSelectionCol.find(c => c['field'] === '28').showInfoIcon = true;
        this.subSelectionCol.find(c => c['field'] === '28').infoMsg = 'SELECTION-TOOLTIP-INTERNAL_CODE';
      }
      if (this.subSelectionCol.find(c => c['field'] === '99')) {
        this.subSelectionCol.find(c => c['field'] === '99').assignAll = true;
      }
      this.setDownloadParams();
      this.setInvalidRowsParams();
    });

    this.sublazyLoadUrl = '/buyflow/rest/table/custom/' + this.selectionConfigId;

    this.route.data.subscribe((data: {
      simtypes: any[], countries: any[], columns: SubscriberType[],
      lazyCount: any[], configId: string, pattern: any
    }) => {
      this.columns = data.columns;
      this.simTypes = data.simtypes;
      this.columns[0].width = '200px';
      this.columns[0].bodyTemplate = this.subsWithBan;
      this.columns[21].bodyTemplate = this.methodShortDesc;
      if (data.countries && JSON.stringify(data.countries) !== '{}') {
        this.countries = Object.keys(data.countries).map(key => {
          let obj = {};
          obj['text'] = data.countries[key];
          obj['value'] = key.split('-')[1];
          return obj;
        });
        this.subsCountries = Object.keys(data.countries).map(key => {
          let obj = {};
          obj['text'] = data.countries[key];
          obj['value'] = data.countries[key];
          return obj;
        });
      }

      this.pattern = data.pattern ? data.pattern : null;
      this.lazyLoadUrl = '/buyflow/rest/table/custom/' + data.configId;
    });

    window.scrollTo(0, 0);
    this.orderCols = [
      { title: 'ORDER_CONFIRMATION-CUSTOMER_NUMBER', field: 'ban', filter: false, show: true },
      { title: 'ORDER_CONFIRMATION-NO_OF_PARTICIPANTS', field: 'affectedSubscriberCount', filter: false, show: true },
      { title: 'ORDER_CONFIRMATION-ORDER_NUMBER', field: 'orderNumber', show: true, filter: false, bodyTemplate: this.orderNumberPDF }
    ];
  }

  private submitOrder() {
    this.submitOrderDetails = new OrderDetails();
    this.orderDetails = new OrderConfirmDetails;
    this.orderreview.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    this.isLoading = true;
    this.orderReviewService.getOrdersDetails(this.submitOrderDetails)
      .subscribe((data) => {
        if (UtilsService.notNull(data)) {
          this.orderSubmitted = true;
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
        this.orderDetails.mutlipleOrders = []; // just make this property true
        this.orderDetails.multipleOrdersTemplate = this.multipleOrderDetails;
        this.orderDetails.description = 'CONFIRM-DESCRIPTION';
      });
  }

  showDebitorInfo(): boolean {
    return this.debitorSetting && this.debitorSetting.hideDebitorDetails ? this.debitorSetting.hideDebitorDetails !== 'Y' : true;
  }

  nextSectionAfterBan() {
    this.tariffFlow['reload'] = false;
    this.msisdn = [];
    this.processing = true;
    let lazyParams: any = this.subsDatatable.lazyParams;
    let selections = this.subsDatatable.selectedMap.size ? Array.from(this.subsDatatable.selectedMap.values()) : [];
    selections.forEach(m => {
      if (m['sel'] === 'Y') {
        m['subsCount'] = this.subsCount;
      } else {
        delete m['subsCount'];
      }
    });
    lazyParams['selections'] = selections;

    this.subsAlert.clearNotification();
    if (!UtilsService.notNull(this.subsCount)) {
      this.processing = false;
      this.subsAlert.printErrorNotification('SELECTION-NO_BAN_SELECTED');
    } else if (CustomValidators.validateActivationSubs(this.subsCount)) {
      this.processing = false;
      this.subsAlert.printErrorNotification('SELECTION-SUB_SELECTION_ERROR');
    } else {
      this.datatableService.persistSelections(lazyParams).subscribe((res: any) => {
        if (this.subsCount) {
          this.processing = false;
          this.subsAlert.clearNotification();
          this.subsFlow.model['selectCount'] = Number.parseInt(this.subsCount);
          this.subsFlow.model['singleEdit'] = this.subsCount === '1';
          this.subsFlow.next(this.subsFlow.model, true);
        }
      });

      this.msisdnResolverService.getMsisdnForShop(this.selectedBan[1]).then(res => {
        res.forEach(data => {
          let obj = {};
          obj['text'] = data.msisdn;
          obj['value'] = data.msisdn;
          this.msisdn.push(obj);
        });
      });
    }
  }

  nextSectionAfterSoc(selectedSocs) {
    this.subsManageChanges = !this.subsManageChanges;
    this.subManagementFlow.model = {};
    this.socFlow.model['selectedSocs'] = selectedSocs;
    this.subscriberList = [];
    this.socFlow.model['reloadSummary'] = !this.socFlow.model['reloadSummary'];
    this.socFlow.next(this.socFlow.model);
    this.selectedSim = 'NEW_SIM';
    // Disable ultracard fields if wifi soc is selected by user
    this.isWifiSocSelected = selectedSocs.some(socList => socList.socs.some(soc => soc.wifi));
    BanSubConfig.wifiDisableCols.forEach(wifi => {
      this.subSelectionCol.find(colIdx => colIdx['field'] === wifi).colDisabled = this.isWifiSocSelected;
    });
  }

  nextSection(event, flow) {
    if (UtilsService.notNull(event.selectedTariffGroup)) {
      this.isTariffChanged = !this.isTariffChanged;
      this.tariffFlow['tariffModel'] = event;
      this.isArticleChanged = !this.isArticleChanged;
    }
    if (UtilsService.notNull(event.addressType)) {
      if (event.addressType === 'DEBITOR') {
        this.debitorFlow.model.debitorNum = event.selectedAddress.debitorNumber;
        this.debitorAddress = event.selectedAddress;
      } else if (event.addressType === 'SHIPMENT') {
        this.isShipmentChanged = !this.isShipmentChanged;
        this.shippingFlow.model.selectedAddress = event.selectedShipAddress;
        this.shippingFlow['selectedShipmentAddress'] = event.selectedShipAddress;
        if (this.debitorAddress.debitorType === 'S') {
          this.isSammelDChanged = !this.isSammelDChanged;
        }
      }
    }
    flow.next(flow.model, true);
  }
  nextSectionAfterSubsPanel(event) {
    this.subManagementFlow.model['messages'] = this.subsPanelPostView(event);
    this.subManagementFlow.next(this.subManagementFlow.model, true);
  }

  clearNotifier(event) {
    if (event) {
      this.orderReviewCartNotify.clearNotification();
    }
  }

  private subsPanelPostView(data) {
    const list = [];
    const addrEditCount = data.filter( sub => sub['isAddEdited'] === 'Y');
    if (addrEditCount.length > 1) {
      const params = {
        editedCount: addrEditCount.length,
        subsCount : this.subsCount
      };
      list.push(this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_EDIT_COUNT', params));
    } else if (addrEditCount.length === 1) {
      list.push(this.translation.translate('MANAGE_DETAILS-ONE_SUB_CHANGED'));
    } else {
      list.push(this.translation.translate('ACTIVATION_DETAILS-NO-SUBS-CHANGED'));
    }

    if (this.selectedSim === 'NEW_SIM') {
      const msgs = this.calculateSubsEnties(data);
      msgs[0].forEach( (value: number, key: string) => {
        const params = { subsCount : value, type: this.simTypes.find(s => s[key])[key] };
        list.push( this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_NEWSIM_MC_COUNT', params));
      });
      msgs[1].forEach( (value: boolean, key: string) => {
        const params = { subsCount : value, type: this.simTypes.find(s => s[key])[key] };
        list.push( this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_NEWSIM_UC_COUNT', params));
      });
    } else {
      let mainCardsCount = 0;
      let ultraCardCount = 0;
      data.forEach( d => {
        if (d['7'] && d['7'] !== '') {
          mainCardsCount++;
        }
        if (d['29'] && d['29'] !== '') {
          ultraCardCount++;
        }
        if (d['30'] && d['30'] !== '') {
          ultraCardCount++;
        }
      });
      if (mainCardsCount > 0) {
        const params = { count : mainCardsCount};
        list.push( this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_EXSIM_MC_COUNT', params) );
      }
      if (ultraCardCount > 0) {
        const params = { count : ultraCardCount};
        list.push( this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_EXSIM_UC_COUNT', params) );
      }
    }
    const msisdnCount = data.filter( d => d['99'] && d['99'] !== '').length;
    if (msisdnCount > 0) {
      const params = { count : msisdnCount};
      list.push( this.translation.translate('ACTIVATION_DETAILS-SUBS_TABLE_MSISDN_COUNT', params) );
    }
    return list;
  }

  private calculateSubsEnties(data: any[]) {
    let reviewMsgs = [];
    let mainSim = new Map<string, number>();
    let ultraSim = new Map<string, number>();
    data.forEach(d => {
      // Maincard SimType Calculation
      if (mainSim.has(d['8'])) {
        mainSim.set(d['8'], mainSim.get(d['8']) + 1);
      } else {
        mainSim.set(d['8'], 1);
      }
      // UldtraCard 1 calculation
      if (d['32'] && ultraSim.has(d['32'])) {
        ultraSim.set(d['32'], ultraSim.get(d['32']) + 1);
      } else if (d['32']) {
        ultraSim.set(d['32'], 1);
      }

      // UldtraCard 2 calculation
      if (d['34'] && ultraSim.has(d['34'])) {
        ultraSim.set(d['34'], ultraSim.get(d['34']) + 1);
      } else if (d['34']) {
        ultraSim.set(d['34'], 1);
      }
    });
    reviewMsgs.push(mainSim);
    reviewMsgs.push(ultraSim);
    return reviewMsgs;
  }

  processOrderSubmit() {
    window.scrollTo(0, 0);
    this.isLoading = true;
    this.submitOrder();
  }

  downloadPdf(orderNumber: string, orderType: string) {
    this.showInProgressMsg();
    this.orderConfirmationService.downloadPdf(orderNumber, OrderType[orderType]).subscribe(data => {
      window.location.href = '/buyflow/rest/orderflow/' + orderNumber
        + '/' + orderType + '/pdf?t=' + new Date().getTime();
    },
      error => this.retryMessage());
  }
  showInProgressMsg() {
    this.subsAlert.clearNotification();
    this.subsAlert.printWarningNotification('DOWNLOAD_IN-PROGRESS');
  }
  retryMessage() {
    this.subsAlert.clearNotification();
    this.subsAlert.printWarningNotification('ORDER_IN-PROGRESS');
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }

  onBanSelection(event) {
    this.subsAlert.clearNotification();
    this.selectedBan = event;
    this.subsCount = '1';
    this.subsFlow.model['selectCount'] = Number.parseInt(this.subsCount);
    this.subsFlow.model['ban'] = this.selectedBan[1];
    this.subsFlow.model['banName'] = this.selectedBan[26];
  }

  showSubsCount(row: any): boolean {
    return UtilsService.notNull(row)
      && (!UtilsService.notNull(row['_sncrChecked']) || row['_sncrChecked'].toString().toLowerCase() === 'false');
  }

  nextSectionAfterHardware(event) {
    this.isArticleChanged = !this.isArticleChanged;
    if (event.eligibleSubsHardware !== 0) {
      this.hardwareFlow.next(this.hardwareFlow.model, true);
      this.eligibleSubsHardware = event.eligibleSubsHardware;
    }
    if (this.subSelectionCol.find(c => c['field'] === '61')) {
      this.subSelectionCol.find(c => c['field'] === '61').colDisabled =
        (event.selectedArticle !== null) ? !(event.selectedArticle.displayDep) : true;
    }
  }

  selectedTariffGroup(event) {
    this.hideHandyStepper = event.includes('ACT_SIM_ONLY');
    this.tariffFlowNextButtonLabel = this.hideHandyStepper ?
      'HARDWARE_SELECTION-NEXT_BUTTON' : 'TARIFF_SELECTION-NEXT_BUTTON';
  }

  setSelectedSIM(event) {
    this.selectedSim = event;
    this.subManagementFlow.model['selectedSim'] = this.selectedSim;
    if (this.selectedSim === 'NEW_SIM') {
      this.debitorFlow.disabled = true;
      this.shippingFlow.disabled = true;
    } else {
      this.debitorFlow.disabled = false;
      this.shippingFlow.disabled = false;
    }
  }

  setDownloadParams() {
    this.downloadParams.configId = this.selectionConfigId;
    this.downloadParams.notificationHandler = this.subsAlert;
    this.downloadParams.url = '/buyflow/rest/exportfile/excel';
  }
  setInvalidRowsParams() {
    this.invalidSubsParams.configId = this.selectionConfigId;
    this.invalidSubsParams.notificationHandler = this.subsAlert;
    this.invalidSubsParams.url = '/buyflow/rest/exportfile/getinavalidrows';
  }

  reloadSubMgtTable(event: any): void {
    this.hideSubsTable = event;
    this.uploadRes = event;
    this.setResponseRecords(event);
  }

  hideAddressPanel(): boolean {
    if (UtilsService.notNull(this.hardwareFlow)
      && !this.hardwareFlow.disabled
      && UtilsService.notNull(this.hardwareFlow.model)
      && UtilsService.notNull(this.hardwareFlow.model.isArticleNotRequired)) {
      return this.hardwareFlow.model.isArticleNotRequired !== 0 && this.selectedSim !== 'NEW_SIM';
    }
    return this.selectedSim !== 'NEW_SIM';
  }

  onSubUploadNext() {
    this.uploadChangesService.persistUploadChanges(this.selectionConfigId)
      .then( (response: boolean) => {
          this.subManagementFlow.next(this.subManagementFlow.model);
      });
  }

  setResponseRecords(res: any) {
    this.notifyUploadSubsError.clearNotification();
    this.showSubsSuccess = false;
    let invalidRecords = {invalidRecords: this.uploadRes.invalidRecords};
    if (this.uploadRes.invalidRecords === 1) {
        this.setInvalidRows(res, invalidRecords, 'UPLOAD_CHANGES-INVALID_RECORD');
    } else if (this.uploadRes.invalidRecords > 1) {
        this.setInvalidRows(res, invalidRecords, 'UPLOAD_CHANGES-INVALID_RECORDS');
    }
    if (this.uploadRes.validRecords) {
      this.successMsg = !this.uploadRes.invalidRecords ? 'UPLOAD_CHANGES-VALID_RECORDS' : 'UPLOAD_CHANGES-PARTIAL_VALID_RECORDS';
      this.showSubsSuccess = true;
    }
  }

  setInvalidRows(res: any, invalidRecords: any, message: string) {
    if (res.invalidRows && Array.isArray(res.invalidRows)) {
      this.notifyUploadSubsError.printErrorNotification(`${message}`, {
        ...invalidRecords,
        invalidRows: res.invalidRows
      });
    } else {
      this.notifyUploadSubsError.printErrorNotification(`${message}`, invalidRecords);
    }
  }

  pscLocalProperties(): void {
    if (UtilsService.notNull(this.allSummary)) {
      if (UtilsService.notNull(this.allSummary.banSummary) && this.allSummary.banSummary.length) {
        this.subsFlow.model['ban'] = this.allSummary.banSummary[0].ban;
        this.subsFlow.model['banName'] = this.allSummary.banSummary[0].banName;
        delete this.subsFlow.model.selected;

        this.selectedBan = {
          '1': this.subsFlow.model['ban'],
          '26': this.subsFlow.model['banName']
        };
        this.subsCount = this.allSummary.banSummary[0].subscriberCount;
        this.subsFlow.model['singleEdit'] = this.subsCount === '1';
      }
      this.tariffFlow.model['selectedPreQuery'] = this.allSummary?.banSummary[0].tariffType;
      this.selectedTariffGroup(this.tariffFlow.model['selectedPreQuery']);
      this.subscriberList = this.allSummary.subsSummary;
      this.selectedSim = this.allSummary?.banSummary[0].subsSimType;
      this.subManagementFlow.model['selectedSim'] = this.selectedSim;
      if (!UtilsService.isEmpty(this.allSummary.subsSummary)) {
        this.subManagementFlow.model['messages'] = this.subsPanelPostView(this.allSummary.subsSummary);
      }

      if (this.tariffFlow.model['selectedPreQuery'] !== 'ACT_SIM_ONLY'
        && UtilsService.isEmpty(this.allSummary.handySummary)) {
        this.isArticleNotRequired = true;
        this.orderService.getSubsidySummary().subscribe(subsidySummary => {
          let subsidyId = this.getSubsidyId(subsidySummary.subsidyType);
          this.orderService.getSubsidyEligibilityCount(subsidyId).subscribe(subsidyEligibility => {
            this.eligibleSubsHardware = subsidyEligibility.subsidySubsCount;
            let hardwareModel = {
              isArticleNotRequired: subsidyId,
              eligibleSubsHardware: subsidyEligibility.subsidySubsCount,
              tariffSubsCount: subsidyEligibility.tariffSubsCount,
              selectedArticle: [],
              selectedHardware: []
            };
            this.hardwareFlow.model = hardwareModel;
          });
        });
      }
    }
  }
}
