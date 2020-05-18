import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, OnInit, Inject } from '@angular/core';
import { Language, TranslationService } from 'angular-l10n';
import { OrderReviewService } from './order-review.service';
import { ClientOrderDetailsComponent } from '../../client-order-details/client-order-details.component';
import { forkJoin } from 'rxjs';
import { TimeoutService } from '../../app/timeout/timeout.service';
import { UtilsService } from '../../sncr-components/sncr-commons/utils.service';
import { Cart } from '../../shopping-cart/Cart';
import { SaveShoppingCartComponent } from '../../save-shopping-cart/save-shopping-cart.component';
import { OrderDetails } from '../../order-confirm/order-confirm';
import { CONSTANTS } from '../../soc-management/constants';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { NotificationHandlerService } from '../../sncr-components/sncr-notification/notification-handler.service';
import {OrderReviewConstants} from './order-review-constants';

@Component({
  selector: 'order-review',
  templateUrl: 'order-review.component.html',
  exportAs: 'orderReview',
  styleUrls: ['order-review.component.scss']
})
export class OrderReviewComponent implements OnChanges, OnInit {
  @Input() reloadSummary: any;
  @Input() isLoading: boolean;
  @Input() isShipmentChanged: boolean;
  @Input() selectedHandy: any;
  @Input() orderType: string;
  @Input() isPSCEnabled = false;
  @Input() prefilled = false;
  @Input() prefix = '';

  @Output() output = new EventEmitter();
  @Output() pscOutput = new EventEmitter();
  @Language() lang: string;

  submitOrderDetails: OrderDetails;
  cartProcessing: boolean;
  isReadOnlyUser = false;
  isReadOnlyVodafoneUser = false;
  cart = new Cart();
  createCartAccess = false;
  deleteCartAccess = false;
  editCartAccess = false;
  isVFUser = false;
  constants: CONSTANTS;
  defaultCartName = '';
  isCartSummaryLoaded = false;
  isInvalidCart = false;
  depDetailsResp: any;

  @ViewChild('clientOrderDetails', {static: true}) clientOrderDetails: ClientOrderDetailsComponent;
  @ViewChild('saveCart') saveShoppingCartComponent: SaveShoppingCartComponent;
  orderSummary: any;


  constructor(private orderReviewService: OrderReviewService,
    public timeOutService: TimeoutService, private timeoutService: TimeoutService,
    private translation: TranslationService, private shoppingCartService: ShoppingCartService,
    private router: Router,
    public orderReviewNotify: NotificationHandlerService,
    @Inject('NotificationHandlerFactory') private alertFactory) {

  }
  ngOnInit() {
    this.defaultCartName = 'OrderType.' + this.orderType;

    if (this.timeoutService.topBar) {
      this.isReadOnlyUser = this.timeoutService.topBar.isReadOnlyUser;
      this.isReadOnlyVodafoneUser = this.timeoutService.topBar.isReadOnlyVodafoneUser;
      this.cart = this.timeoutService.cart;
      this.clientOrderDetails.prefilledCart = this.timeOutService.cart;
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
      if (this.prefilled) {
        if (this.cart.errors && this.cart.errors.length > 0) {
          this.populateErrors();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadSummary'] || changes['isShipmentChanged']) {
      this.orderSummary = {};
      if (this.clientOrderDetails.saveForm) {
        this.clientOrderDetails.saveForm.reset();
      }
      this.populateOrderSummary();
      if (this.prefilled && (changes['reloadSummary'] && changes['reloadSummary'].firstChange === false  &&
        changes['reloadSummary'].previousValue !== undefined) || changes['isShipmentChanged']) {
        this.orderReviewNotify.clearNotification();
        this.isInvalidCart = false;
        this.cart.errors = [];
      }
    }
    if (changes['selectedHandy'] && UtilsService.notNull(changes['selectedHandy'].currentValue)) {
      this.orderSummary['displayDep'] = UtilsService.notNull(this.selectedHandy) ? this.selectedHandy.displayDep : false;
      this.orderSummary['depData'] = UtilsService.notNull(this.selectedHandy)
            && UtilsService.notNull(this.selectedHandy.depRelevance) ? this.depDetailsResp[this.selectedHandy.depRelevance] : null;
    }
  }

  populateOrderSummary() {
    let eligibleSummaryCalls = OrderReviewConstants.eligibleSummaryCalls(this.orderReviewService, this.orderType);
    forkJoin(...eligibleSummaryCalls)
      .subscribe(([tariffSummary, tariffSubsQuantity, depDetails, handySummary, socSummary, banSummary, subsSummary]) => {
        this.orderReviewService.getTotalSummary().subscribe(totalSummary => {
          this.depDetailsResp = depDetails;
          let handy = handySummary ? handySummary[0] : null;
          let depData = UtilsService.notNull(this.selectedHandy)
            && UtilsService.notNull(this.selectedHandy.depRelevance) ? this.depDetailsResp[this.selectedHandy.depRelevance] : null;
          this.orderSummary = {
            banSummary,
            tariffSummary,
            handySummary: handy,
            socSummary,
            totalSummary,
            depData,
            displayDep: UtilsService.notNull(this.selectedHandy) ? this.selectedHandy.displayDep : false,
            tariffSubsQuantity,
            subsSummary
          };
          if (this.prefilled && !UtilsService.isEmpty(this.cart) && !this.isCartSummaryLoaded) {
            this.isCartSummaryLoaded = true;
            this.pscOutput.emit(this.orderSummary);
          }
        });
      });
  }

  processOrder() {
    if (!this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid && !this.timeOutService.isReadOnlyUser) {
      if (this.prefilled) {
        this.shoppingCartService.isCartLocked(this.cart.shoppingCartId).subscribe((res) => {
          if (res.valid) {
            this.isLoading = true;
            this.output.emit();
          } else {
            let errors = res.errors;
            if (errors && errors.length) {
              this.orderReviewNotify.printErrorNotification(errors[0], { shoppingCartName: this.cart.shoppingCartName });
            }
          }
        });
      } else {
        this.isLoading = true;
        this.output.emit();
      }
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

  processSaveCart(cart) {
    this.isLoading = true;
    this.saveOrderCart(cart);
  }
  saveOrderCart(cart: Cart) {
    this.submitOrderDetails = new OrderDetails();
    this.submitOrderDetails.type = 'prolongationDTO';
    // this.submitOrderDetails.upload = this.subsFlow.model['uploadChanges'];
    this.submitOrderDetails.cart = cart;
    this.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    if (this.createCartAccess) {
      this.shoppingCartService.createCart(this.submitOrderDetails)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((data) => {
          this.updateOnCartSubmit(data);
        }, () => {
          // exception during save cart
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    } else if (this.editCartAccess) {
      this.shoppingCartService.updateCart(this.submitOrderDetails)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((data) => {
          this.updateOnCartSubmit(data);
        }, () => {
          // exception during save cart
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    }
  }
  updateOnCartSubmit(data) {
    this.isLoading = false;
    if (UtilsService.notNull(data) && data.valid) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      this.orderReviewNotify.printErrorNotification(data.errors.length ? data.errors[0] : this.constants.technicalErrorText);
    }
  }

  deleteResponse(event: any) {
    if (event && event.errors.length === 0) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      event.errors.forEach(error => this.orderReviewNotify.printErrorNotification(error));
    }
  }
  populateErrors() {
    this.orderReviewNotify.clearNotification();
    let errorList = '';
    this.cart.errors.forEach(err => {
      if (err === 'PSC_ALL_INVALID_SUBS') {
        this.isInvalidCart = true;
      }
      errorList = errorList + `<p>` + this.translation.translate(err) + `</p>`;
    });
    setTimeout(() => this.orderReviewNotify.printErrorNotification(errorList), 40);
  }
}
