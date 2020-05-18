import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngxs/store';
import {Subscription} from 'rxjs';
import {Language} from 'angular-l10n';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {OrderConfirmDetails, OrderDetails, OrderType} from '../order-confirm/order-confirm';
import {Column} from '../sncr-components/sncr-datatable/column';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {OrderReviewComponent} from '../flow-sections/order-review/order-review.component';
import {SubscriberType} from '../subscribers-selection/subscriber-selection';
import {TimeoutService} from '../app/timeout/timeout.service';
import {OrderReviewService} from '../flow-sections/order-review/order-review.service';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {PrefilledShoppingCart} from '../flow-sections/sncr-prefilled-shopping-cart/prefilled-shopping-cart';
import {SncrDatatableService} from '../sncr-components/sncr-datatable/sncr-datatable.service';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {OrderConfirmationService} from '../order-confirm/order-confirmation.service';
import {FileExportService} from '../sncr-components/sncr-commons/file-export.service';

@Component({
  selector: 'ct-flow',
  templateUrl: 'ct-flow.component.html',
  styleUrls: ['ct-flow.component.scss']
})
export class CtFlowComponent extends PrefilledShoppingCart implements OnInit, OnDestroy {
  @Language() lang: string;

  @ViewChild('subscriberTable') subsDatatable: SncrDatatableComponent;
   // Templates
  @ViewChild('orderNumberPDF', {static: true}) orderNumberPDF;
  @ViewChild('multipleOrderDetails') multipleOrderDetails;
  @ViewChild('orderreview') orderreview: OrderReviewComponent;

  orderDetails: OrderConfirmDetails;
  private submitOrderDetails: OrderDetails;
  orderSubmitted: boolean;
  orderCols: Column[];
  orderRows = [];
  subscriptions$: Subscription[] = [];
  processing = false;
  orderProcessing = false;
  isArticleNotRequired: boolean;
  isTariffChanged = false;
  count: number;
  eligibleSubsHardware: any;
  isLoading = false;
  countries = [];
  pattern: any;
  showExtendedAvailability = false;
  reloadSubs = false;
  prefix = 'CT-';
  subsFlowSortField = '1';
  columns = [];
  eventType = '';
  disableMessage = false;
  lazyLoadUrl = '/buyflow/rest/table/custom/8ba93c9a-c14e-702c-e053-1f07100ab39a';
  uploadUrl = '/buyflow/rest/fileimport/excelchanges/997cdc1e-570d-0ff9-e053-1e07100afd26';

  constructor(private store: Store,
              protected route: ActivatedRoute,
                public subsAlert: NotificationHandlerService,
                @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
                protected timeoutService: TimeoutService,
                protected orderService: OrderReviewService,
                protected shoppingCartService: ShoppingCartService,
                protected datatableService: SncrDatatableService,
                private orderReviewService: OrderReviewService,
                private orderConfirmationService: OrderConfirmationService,
                private fileExportService: FileExportService,
                private router: Router) {
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
    this.route.data.subscribe((data: { columns: SubscriberType[], lazyCount: any[] }) => {
      this.columns = data.columns;
    });

    window.scrollTo(0, 0);
    this.orderCols = [
      {title: 'ORDER_CONFIRMATION-CUSTOMER_NUMBER', field: 'ban', filter: false, show: true},
      {title: 'ORDER_CONFIRMATION-NO_OF_PARTICIPANTS', field: 'affectedSubscriberCount', filter: false, show: true},
      {title: 'ORDER_CONFIRMATION-ORDER_NUMBER', field: 'orderNumber', show: true, filter: false, bodyTemplate: this.orderNumberPDF}
    ];
  }

  private submitOrder() {
    this.submitOrderDetails = new OrderDetails();
    this.orderDetails = new OrderConfirmDetails;
    this.orderreview.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    this.isLoading = true;
    this.orderProcessing = true;
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
        this.orderProcessing = false;
      });
  }

  nextSectionAfterSubscriber() {
    this.disableMessage = true;
    this.processing = true;
    this.tariffFlow.reload = false;
    let lazyParams: any = this.subsDatatable.lazyParams;
    lazyParams['selectAll'] = this.subsDatatable.dt.allSelected;
    lazyParams['selections'] = [];
    this.subsDatatable.selectedMap.forEach( item => {
      lazyParams.selections.push(item);
    });
    this.datatableService.persistSelections(lazyParams).subscribe((res: any) => {
      this.datatableService.getSelectCount$({url: '/buyflow/rest/table/custom', lazyParams: lazyParams})
        .subscribe((response: any) => {
          let selectCount = response && response.count ? response.count : 0;
          if (selectCount) {
            this.subsAlert.clearNotification();
            this.subsFlow.model['selectCount'] = selectCount;
            this.subsFlow.next(this.subsFlow.model, true);
          } else {
            this.subsAlert.printErrorNotification('CT-SELECTION_TABLE-NONE_SELECTED_ERROR');
          }
          this.processing = false;
        }, () => {
          this.processing = false;
          this.subsAlert.printErrorNotification('CT-PROLONGATION-TECHNICAL_ERROR');
        });
    }, () => {
      this.processing = false;
      this.subsAlert.printErrorNotification('CT-PROLONGATION-TECHNICAL_ERROR');
    });
  }

  nextSection(event, flow) {
    this.tariffFlow['tariffModel'] = event;
    this.isTariffChanged = !this.isTariffChanged;
    flow.next(flow.model, true);
  }

  processOrderSubmit() {
    window.scrollTo(0, 0);
    this.isLoading = true;
    this.submitOrder();
  }

  exportcsv(): void {
    console.log(this.tariffFlow['tariffModel'].selectedTariff.inEligibleSubs);
    let filedata = [];
    this.tariffFlow['tariffModel'].selectedTariff.inEligibleSubs.forEach( item => {
      filedata.push({Rufnummer: item});
    });
    this.fileExportService.exportAsExcelFile(filedata, 'Teilnehmerdaten_' + this.tariffFlow['tariffModel'].selectedTariff.tariffOption);
  }

  downloadPdf(orderNumber, orderType) {
    this.showInProgressMsg();
    this.orderConfirmationService.downloadPdf(orderNumber, OrderType[orderType]).subscribe(data => {
        window.location.href = '/buyflow/rest/orderflow/' + orderNumber
          + '/' + orderType + '/pdf?t=' + new Date().getTime();
      },
      error => this.retryMessage());
  }
  reloadSubsTable(uploadResp: any): void {
    this.disableMessage = false;
    if (!UtilsService.isEmpty(uploadResp) && !UtilsService.isEmpty(uploadResp.eligibleSubs)) {
      this.subsDatatable.initNotLoaded = true;
      this.subsDatatable.selectedMap.forEach(entry => {
        uploadResp.eligibleSubs.forEach(data => {
          if (data === entry.id) {
            this.subsDatatable.selectedMap.delete(entry.id);
          }
        })
      });
      this.subsDatatable.resetAllFilters();
    }
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
}
