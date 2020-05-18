import {Component, AfterViewInit, ViewChild, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {FnShop} from '../../common/fn-shop';
import {CustomerSelectionService} from './customer-selection.service';
import {OrderService} from '../order.service';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {OrderConfig} from '../order-config';
import {TranslationService} from 'angular-l10n';

@Component({
  selector: 'customer-selection',
  templateUrl: 'customer-selection.component.html',
  styleUrls: ['customer-selection.component.scss'],
  providers: [CustomerSelectionService]
})
export class CustomerSelectionComponent implements OnInit {

  selected = [];
  customerCols: Array<any> = [];
  customers: Array<FnShop> = [];
  loading = false;
  selection: any = null;
  private mainForms: FormGroup[][];

  orderConfig: any;
  selectedCustomerNumber: string;
  fnOrderRequest: any;

  @Input() tab: NgbTabset;
  orderResponse: any;

  constructor(private router: Router, private orderService: OrderService, public notify: NotificationHandlerService,
              private customerSelectionService: CustomerSelectionService, private cdr: ChangeDetectorRef,
              public translation: TranslationService) {
  }

  ngOnInit(): void {

    this.customerCols = [
      {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'Kundenname', field: 'customerName', show: true, sortable: true},
      {title: 'Übergeordnete Kundennummer', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'Name', field: 'rootCustomerName', show: true, sortable: true},
    ];

    this.fnOrderRequest = this.orderService.getFnorderRequest();
    this.customers = this.orderService.getCustomers();
    this.orderConfig = OrderConfig;


    if (this.customers && this.customers.length > 0) {
      this.selection = this.customers.find(customer => customer.selected);
    } else {
      this.loading = true;
      this.customerSelectionService.getCustomersOnLandingPage().then(data => {
          this.loading = false;
          this.customers = data;
        },
        error => {
          this.loading = false;
          this.setErrorMessage(error);
        }
      );
    }
  }

  next() {
    if (this.selection) {
      // reset the data that was previously set
      this.orderService.resetData();
      this.customers.forEach(customer => customer.selected = false);
      // only one selection at any given point
      this.selection.selected = true;

      this.orderConfig.fnOrderRequest.customerNumber = this.selection.fnCustomerNumber ? this.selection.fnCustomerNumber :
        this.selection.fnRootCustomerNumber;
      this.orderConfig.fnOrderRequest.customerName = this.selection.customerName;
      this.orderService.setFnOrderRequest(this.orderConfig.fnOrderRequest);
      this.orderService.setCustomers(this.customers);
      this.orderService.disableTabsFrom(2);
      setTimeout(() => this.tab.select('tab2'));
    } else {
      this.setErrorMessage(this.translation.translate('ORDER-NO_CUSTOMER_SELECTED'));
    }
  }

  setErrorMessage(message: string) {
    this.notify.printErrorNotification(message);
  }
}