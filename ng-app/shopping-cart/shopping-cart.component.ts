import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ShoppingCartService} from './shopping-cart.service';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {TranslationService} from 'angular-l10n';
import {Router} from '@angular/router';
import {TimeoutService} from '../app/timeout/timeout.service';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'shopping-cart',
  templateUrl: 'shopping-cart.component.html',
  styleUrls: ['shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit {
  isLoading = false;
  toggle = false;
  shoppingCartCols = [];
  shoppingCart = [];
  count = 0;
  shoppingCartId: string;
  shoppingCartName: string;
  deleteCartAccess = false;
  lockingPeriod: string;

  @ViewChild('dataTable') dataTableComponent: SncrDatatableComponent;
  @ViewChild('deleteIcon', {static: true}) deleteIcon;
  @ViewChild('createdDateFormat', {static: true}) createdDate;
  @ViewChild('cartNameTemplate', {static: true}) cartNameTemplate;
  @ViewChild('customerOrderNumber', {static: true}) customerOrderNumber;
  @ViewChild('clientOrderId', {static: true}) clientOrderId;
  @Output() deleteIconEvent = new EventEmitter();
  @ViewChild('content') content: TemplateRef<any>;

  constructor(public translation: TranslationService, private router: Router,
              private shoppingCartService: ShoppingCartService, private timeoutService: TimeoutService,
              public alertNotify: NotificationHandlerService) {
  }

  ngOnInit(): void {

    window.scrollTo(0, 0);

    this.shoppingCartService.getCartCount().then((response: number) => {
      this.count = response;
    });

    this.shoppingCartCols = [
      {
        title: this.translation.translate('SHOPPING_CART_NAME'),
        field: 'shoppingCartName',
        show: true,
        sortable: false,
        filter: false,
        bodyTemplate: this.cartNameTemplate
      },
      {
        title: this.translation.translate('SHOPPING_CART_ORDER_TYPE'),
        field: 'shoppingCartType', show: true, sortable: false, filter: false
      },
      {
        title: this.translation.translate('SHOPPING_CART_QUANTITY'),
        field: 'subscriberCount', show: true, sortable: false, filter: false
      },
      {
        title: this.translation.translate('SHOPPING_CART_MSISDN'),
        field: 'customerOrderNumber',
        show: true,
        sortable: false,
        filter: false,
        bodyTemplate: this.customerOrderNumber
      },
      {
        title: this.translation.translate('SHOPPING_CART_INTERNAL_ID'),
        field: 'clientOrderId',
        show: true,
        sortable: false,
        filter: false,
        bodyTemplate: this.clientOrderId
      },
      {
        title: this.translation.translate('SHOPPING_CART_DATE'), field: 'dateTimeStamp',
        show: true, bodyTemplate: this.createdDate, sortable: false, filter: false
      },
      {bodyTemplate: this.deleteIcon, show: true, sortable: false, filter: false}
    ];
  }

  navigateToOrderFlow(row) {
    this.isLoading = true;
    window.scrollTo(0, 0);
    this.shoppingCartService.getAccess(row.shoppingCartId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res) {
          if (res.valid) {
            this.timeoutService.cart = res;
            this.router.navigate([res.accessURI], {queryParams: {psc: 't'}});
          } else if (res.errors) {
            this.populateErrors(res.errors, row.shoppingCartName);
          }
        }
      }, () => {
        this.alertNotify.clearNotification();
        this.alertNotify.printErrorNotification('ERROR_TECHNICAL-ERR');
      });
  }

  toggleCart() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.getShoppingCartDetails();
    }
  }

  deleteResponse(event: any, row: any) {
    window.scrollTo(0, 0);
    if (event && event !== 'SHOPPING_CART_EXCEPTION') {
      this.populateErrors(event.errors, row.shoppingCartName);
      this.getShoppingCartDetails();
    } else {
      this.alertNotify.clearNotification();
      this.alertNotify.printErrorNotification('SHOPPING_CART_EXCEPTION');
    }
  }

  populateErrors(errors, cartName) {
    this.alertNotify.clearNotification();
    if (errors && errors.length) {
      errors.forEach(error => this.alertNotify.printErrorNotification(error, {shoppingCartName: cartName}));
    }
  }

  getShoppingCartDetails() {
    this.isLoading = true;
    let permissions = this.timeoutService.permissions;
    if (permissions && permissions.length && permissions.includes('prefilled.cart.delete')) {
      this.deleteCartAccess = true;
    }
    this.shoppingCartService.getShoppingCartDetails().then((response: any) => {
      this.shoppingCart = response.cart;
      this.lockingPeriod = response.lockingPeriod;
      this.isLoading = false;
      this.count = this.shoppingCart.length;
    });
  }

}
