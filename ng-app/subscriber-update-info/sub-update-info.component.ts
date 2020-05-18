import {Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {CONSTANTS} from '../soc-management/constants';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {SubUpdateInfoService} from './sub-update-info.service';
import {OrderConfirmDetails, OrderDetails, OrderType} from '../order-confirm/order-confirm';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {ClientOrderDetailsComponent} from '../client-order-details/client-order-details.component';
import {BanSubConfig} from '../ban-sub-common/ban-sub.config';
import {Language, TranslationService} from 'angular-l10n';
import {TimeoutService} from '../app/timeout/timeout.service';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {SncrFlowComponent} from '../sncr-components/sncr-flow/sncr-flow.component';
import {Subscription} from 'rxjs';
import {Cart} from '../shopping-cart/Cart';
import {SaveShoppingCartComponent} from '../save-shopping-cart/save-shopping-cart.component';

@Component({
  selector: 'sub-update-info',
  templateUrl: 'sub-update-info.component.html',
  styleUrls: ['sub-update-info.component.scss'],
})
export class SubUpdateInfoComponent implements OnInit, OnDestroy {

  @ViewChild('subsFlow', {static: true}) subsFlow: SncrFlowSectionComponent;
  @ViewChild('subManagementFlow') subManagementFlow: SncrFlowSectionComponent;
  @ViewChild('reviewSubFlow') reviewSubFlow: SncrFlowSectionComponent;
  @ViewChild('clientOrderDetails') clientOrderDetails: ClientOrderDetailsComponent;
  @ViewChild('flow') flow: SncrFlowComponent;
  @ViewChild('saveCart') saveShoppingCartComponent: SaveShoppingCartComponent;

  @Language() lang: string;

  columns: any[];
  subscribers: any[];
  constants: CONSTANTS;
  toggle: boolean;
  orderProcessing: boolean;
  cartProcessing: boolean;
  orderDetails = new OrderConfirmDetails;
  submitOrderDetails: OrderDetails;
  private orderReviewNotify: NotificationHandlerService;
  submitErrorNotify: NotificationHandlerService;
  private orderReviewCartNotify: NotificationHandlerService;
  countries = [];
  pattern: any;
  flowType = '';
  private isReadOnlyUser = false;
  private isReadOnlyVodafoneUser = false;
  selectionConfigId = '5c60e182-4a75-511c-e053-1405100af36c';
  reviewConfigId = '5c60e182-4a75-511c-e053-1405100af36d';
  manageConfigId = '5c60e182-4a75-511c-e053-1405100af36b';
  uploadReviewConfigId = '6fa053d8-63d8-58fe-e053-1405100a920b';
  createCartAccess = false;
  deleteCartAccess = false;
  editCartAccess = false;
  isVFUser = false;
  cartLoading = false;
  prefilled: boolean;
  isUploadPSC = false;
  private subscriptions$: Subscription[] = [];
  cart = new Cart();
  eventType = '';

  @ViewChild('contentDeleteShoppingCart') contentDeleteShoppingCart: TemplateRef<any>;

  constructor(private route: ActivatedRoute, private router: Router, private subUpdateInfoService: SubUpdateInfoService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private shoppingCartService: ShoppingCartService,
              public translation: TranslationService, private timeoutService: TimeoutService) {
  }

  ngOnInit(): void {
    this.orderProcessing = false;
    this.constants = new CONSTANTS;
    this.orderReviewNotify = this.notificationHandlerFactory();
    this.submitErrorNotify = this.notificationHandlerFactory();
    this.orderReviewCartNotify = this.notificationHandlerFactory();
    this.flowType = BanSubConfig.FL_TYPE_SUB;

    if (this.timeoutService.topBar) {
      this.isReadOnlyUser = this.timeoutService.topBar.isReadOnlyUser;
      this.isReadOnlyVodafoneUser = this.timeoutService.topBar.isReadOnlyVodafoneUser;
      this.cart = this.timeoutService.cart;
      this.isVFUser = this.timeoutService.topBar.vfUser;

      this.timeoutService.cart = new Cart();
      let permissions = this.timeoutService.permissions;
      if (permissions.length > 0) {
        if (permissions.includes('prefilled.cart.create') && !this.cart.shoppingCartName) {
          this.createCartAccess = true;
        }
        if (permissions.includes('prefilled.cart.edit') && this.cart.shoppingCartName) {
          this.editCartAccess = true;
        }
        if (permissions.includes('prefilled.cart.delete') && this.cart.shoppingCartName) {
          this.deleteCartAccess = true;
        }
      }
    }

    this.subscriptions$.push(
      this.route.data.subscribe((data: { isEnterpriseUser: any, columns: any[], countries: any[], pattern: any }) => {
        this.columns = data.columns;
        if (data.countries && JSON.stringify(data.countries) !== '{}') {
          this.countries = Object.keys(data.countries).map(key => {
            let obj = {};
            obj['text'] = data.countries[key];
            obj['value'] = data.countries[key];
            return obj;
          });
        }
        this.pattern = data.pattern ? data.pattern : null;
      })
    );
    this.subscriptions$.push(
      this.route.queryParams.subscribe(params => {
        const psc = params['psc'];
        if (psc) {
          this.prefilled = true;
          this.cartLoading = true;
          let selectSubsCount = 0;
          let manageSubsCount = 0;
          this.isUploadPSC = this.cart.configId === this.uploadReviewConfigId;
          this.subUpdateInfoService.getSelectCount(this.selectionConfigId).then((selectSubs: any) => {
            selectSubsCount = selectSubs && selectSubs.count ? selectSubs.count : 0;

            let midPanelConfig = this.cart.configId === this.uploadReviewConfigId ? this.uploadReviewConfigId : this.reviewConfigId;
            this.subUpdateInfoService.getSelectCount(midPanelConfig).then((manageSubs: any) => {
              manageSubsCount = manageSubs && manageSubs.count ? manageSubs.count : 0;

              const flows = [
                {
                  section: this.subsFlow, model: {
                  selectCount: selectSubsCount,
                  uploadChanges: this.isUploadPSC,
                  uploadCount: this.isUploadPSC ? manageSubsCount : 0,
                  singleEdit: selectSubsCount === 1, hasChanged: false,
                  selected: []
                }
                },
                {
                  section: this.subManagementFlow,
                  prefilled: this.prefilled, model: {
                  selectCount: manageSubsCount, hasChanged: false,
                  singleEdit: selectSubsCount === 1, lazy: true
                }
                },
                {section: this.reviewSubFlow, model: {}}
              ];
              if (this.cart.errors && this.cart.errors.length > 0 && this.cart.valid) {
                this.fillInErrors();
              }
              this.flow.prefill(flows);
              this.cartLoading = false;

            });
          });
        } else {
          this.prefilled = false;
          this.subsFlow.model = {
            selected: [],
            columns: []
          };
        }
      })
    );
  }

  fillInErrors() {
    this.orderReviewNotify.clearNotification();
    let errorList = '';
    this.cart.errors.forEach(err => {
      errorList = errorList + `<p>` + this.translation.translate(err) + `</p>`;
    });
    setTimeout(() => this.orderReviewCartNotify.printErrorNotification(errorList), 40);
  }

  clearNotifier(event) {
    if (event) {
      this.orderReviewCartNotify.clearNotification();
    }
  }

  getSubsSummary(subscribers) {
    return subscribers.length;
  }

  toogleButton() {
    this.toggle = !this.toggle;
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  processOrderSubmit() {
    if (this.prefilled) {
      this.shoppingCartService.isCartLocked(this.cart.shoppingCartId).subscribe((res) => {
        if (res.valid) {
          this.submitOrder();
        } else {
          this.orderProcessing = false;
          let errors = res.errors;
          if (errors && errors.length) {
            this.orderReviewNotify.printErrorNotification(errors[0], {shoppingCartName: this.cart.shoppingCartName});
          }
        }
      });
    } else {
      this.submitOrder();
    }
  }

  persistBulkEditData(editedData: any[]): Promise<any> {
    return this.subUpdateInfoService.persistEditedData(editedData, this.manageConfigId, true);
  }

  processUpdateSubsOrder() {
    if (!this.isReadOnlyVodafoneUser && !this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid) {
      if (!this.isReadOnlyUser) {
        this.orderProcessing = true;
        if (this.subsFlow.model['bulkEdit'] || this.subsFlow.model['singleEdit']) {
          // in case of bulk edit persist the bulk edited data then process order
          this.persistBulkEditData(this.subManagementFlow.model['editedData']).then(res => this.processOrderSubmit());
        } else {
          this.processOrderSubmit();
        }
      } else {
        this.submitErrorNotify.printErrorNotification(this.translation.translate('REVIEW-READ_ONLY_ERROR_MESSAGE'));
        this.orderProcessing = false;
      }
    } else {
      this.orderProcessing = false;
    }
  }

  saveCartDetails() {
    if (!this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid) {
      if (this.editCartAccess || this.createCartAccess) {
        // open the modal
        this.saveShoppingCartComponent.openModal();
      } else {
        this.orderReviewNotify.printErrorNotification(this.translation.translate('REVIEW-NO_PERMISSION_TO_SAVE_CART'));
      }
    }
  }


  manageSubProcessing(event: any) {
    // processing on manage subscriber so make flow component disabled
    this.orderProcessing = event;
  }

  getSubsUpdateProperties() {
    let mapList = new Map;
    mapList.set('add.label.pre', 'Sie buchen diese Tarifoption für ');
    mapList.set('add.label.post', ' Teilnehmer.');
    mapList.set('remove.label.pre', 'Sie kündigen diese Tarifoption für ');
    mapList.set('remove.label.post', ' Teilnehmer.');
    mapList.set('subscriber.section.label', 'SELECTION-SELECTION_MESSAGE');
    mapList.set('subscriber.next.button', this.translation.translate('SELECTION-CONTINUE_TO_NEXT'));
    mapList.set('subscriber.bulkEdit.button', 'Einheitlich verwalten');
    mapList.set('subscriber.uploadSelections.button', 'Auswahl hochladen');
    mapList.set('subscriber.uploadChanges.button', this.translation.translate('SELECTION-UPLOAD_BUTTON'));
    mapList.set('subscriber.selections.configId', '5c60e182-4a75-511c-e053-1405100af36c');
    mapList.set('subscriber.uploadReview.configId', '6fa053d8-63d8-58fe-e053-1405100a920b');
    mapList.set('selections.download.button', this.translation.translate('SELECTION-DOWNLOAD_BUTTON'));

    return mapList;
  }

  deleteResponse(event: any) {
    if (event && event.errors.length === 0) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      event.errors.forEach(error => this.orderReviewNotify.printErrorNotification(error));
    }
  }

  saveOrderCart(cart: Cart) {
    this.submitOrderDetails = new OrderDetails();
    this.submitOrderDetails.type = 'subUpdateInfoDTO';
    this.submitOrderDetails.upload = this.subsFlow.model['uploadChanges'];
    this.submitOrderDetails.cart = cart;
    this.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    if (this.createCartAccess) {
      this.shoppingCartService.createCart(this.submitOrderDetails)
        .subscribe((data) => {
          this.updateOnCartSubmit(data);
          this.cartProcessing = false;
        }, () => {
          // exception during save cart
          this.cartProcessing = false;
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    } else if (this.editCartAccess) {
      this.shoppingCartService.updateCart(this.submitOrderDetails)
        .subscribe((data) => {
          this.updateOnCartSubmit(data);
          this.cartProcessing = false;
        }, () => {
          // exception during save cart
          this.cartProcessing = false;
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    }
  }


  updateOnCartSubmit(data) {
    this.cartProcessing = false;
    if (UtilsService.notNull(data) && data.valid) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      this.orderReviewNotify.printErrorNotification(data.errors.length ? data.errors[0] : this.constants.technicalErrorText);
    }
}

  submitOrder() {
    this.submitOrderDetails = new OrderDetails();
    this.submitOrderDetails.type = 'subUpdateInfoDTO';
    this.submitOrderDetails.upload = this.subsFlow.model['uploadChanges'];
    this.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    this.subUpdateInfoService.processUpdateSubsOrder(this.submitOrderDetails)
      .then((data) => {
        this.orderProcessing = false;
        if (UtilsService.notNull(data)) {
          this.orderDetails.mutlipleOrders = [];
          Object.keys(data).forEach(key => {
            let t: any = {};
            t.orderNumber = key;
            t.orderType = OrderType[data[key]];
            this.orderDetails.mutlipleOrders.push(t);
          });

        } else {
          this.submitErrorNotify.printErrorNotification(this.constants.technicalErrorText);
        }
      })
      .catch((ex) => {
        console.error('exception in order', ex);
        this.orderProcessing = false;
        this.submitErrorNotify.printErrorNotification(this.constants.technicalErrorText);
      });
  }


  processSaveCart(cart: Cart) {
    this.cartProcessing = true;
    if (this.subsFlow.model['bulkEdit'] || this.subsFlow.model['singleEdit']) {
      // in case of bulk/single edit persist the bulk edited data then save cart
      this.persistBulkEditData(this.subManagementFlow.model['editedData']).then(() => this.saveOrderCart(cart));
    } else {
      this.saveOrderCart(cart);
    }
  }
}
