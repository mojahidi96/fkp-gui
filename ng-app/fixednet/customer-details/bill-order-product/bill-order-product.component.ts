import {Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild} from '@angular/core';
import {FnBillingAccount} from '../../common/fn-billing-account';
import {FnProduct} from '../../common/fn-product';
import {BillOrderProdTabsConfig} from './bill-order-prod-tabs-config';
import {BillOrdProdService} from './bill-order-product.service';
import {Router} from '@angular/router';
import {CustomerDetailsService} from '../customer-details.service';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FnOrderDetails} from '../../common/fn-order-details';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';

@Component({
  selector: 'bill-order-prod',
  templateUrl: 'bill-order-product.component.html',
  styleUrls: ['bill-order-product.component.scss']
})


export class BillOrderProductComponent implements OnChanges, OnInit {


  static readonly ORDER = 'order';
  static readonly PRODUCT = 'product';
  fnBillingAccount: FnBillingAccount;
  fnProduct: FnProduct;
  tabs: Array<any>;
  loading = false;
  activeTab: string;
  fnOrderDetails: FnOrderDetails;
  rowData: any;
  disabled = true;

  @Input() shop: any;
  @Input() customer: any;
  @Input() billOrdProd: any;
  @Input() notify: NotificationHandlerService;

  @ViewChild('tab', { static: true}) tab: NgbTabset;
  @ViewChild('address', { static: true}) address;

  selected: any = null;


  constructor(private billOrdProdService: BillOrdProdService, private customerDetailsService: CustomerDetailsService,
              private router: Router) {
    this.tabs = BillOrderProdTabsConfig;
  }

  ngOnInit(): void {
    this.tabs[0].columns[1].bodyTemplate = this.address;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.activeTab = this.customerDetailsService.getActiveTab();

    if (changes['customer']) {
      if (this.customer && this.customer.fnCustomerNumber) {
        this.fnBillingAccount = new FnBillingAccount();
        this.fnProduct = new FnProduct();
        this.fnOrderDetails = new FnOrderDetails();

        this.fnBillingAccount.customerNo = this.customer.fnCustomerNumber;
        this.fnProduct.customerNo = this.customer.fnCustomerNumber;
        this.fnOrderDetails.customerNo = this.customer.fnCustomerNumber;
        this.triggerTabChange(true);
      } else {
        this.triggerTabChange(false);
      }
    }
  }

  successOnTabOpen(tab: any, data: any, isStoredData: boolean) {
    this.loading = false;
    tab.rows = data;
    if (isStoredData) {
      this.rowData = [...data].find(indData => indData.selected);
    }
  }

  errorOnTabOpen(tab: any, error: any) {
    this.loading = false;
    tab.rows = [];
    this.notify.printErrorNotification(error);
  }

  tabChange(event: any, htmlRender: boolean, reload: boolean): void {
    let tabOpen = this.getTabOpened(event.nextId);
    let storedRows;
    switch (event.nextId) {
      case '1':
        storedRows = tabOpen.storedRows;
        if (storedRows && storedRows.length > 0 && !reload) {
          this.successOnTabOpen(tabOpen, storedRows, true);
        } else {
          this.loading = true;
          this.callTabActive(htmlRender);
          this.billOrdProdService.getFnData(this.fnOrderDetails, tabOpen.getUrl).then(data => {
              this.successOnTabOpen(tabOpen, data, false);
            },
            error => {
              this.errorOnTabOpen(tabOpen, error);
            });
        }
        break;

      case  '2':
        storedRows = tabOpen.storedRows;
        if (storedRows && storedRows.length > 0 && !reload) {
          this.successOnTabOpen(tabOpen, storedRows, true);
        } else {
          this.loading = true;
          this.callTabActive(htmlRender);
          this.billOrdProdService.getFnData(this.fnProduct, tabOpen.getUrl).then(data => {
              this.successOnTabOpen(tabOpen, data, false);
            },
            error => {
              this.errorOnTabOpen(tabOpen, error);
            });
        }
        break;
    }
  }

  callTabActive(htmlRender: boolean) {
    if (htmlRender) {
      this.setTabActive(this.activeTab);
    }
  }


  setFnOrderDetails(data: Array < any >): Array < any > {
    let newdata: Array < any > = [];
    Object.assign(newdata, data);
    return;
  }

  getTabOpened(eventId: string): any {
    return this.tabs.find(tab => tab.id === eventId);
  }

  setTabActive(id: string): void {
    this.tab.activeId = id;
  }

  triggerTabChange(reload: boolean): void {
    let event = {
      'nextId': ''
    };
    event.nextId = this.activeTab;
    if (reload) {
      // reset the data if reload
      this.tabs.forEach(tab => {
        tab.storedRows = [];
        tab.disabled = true;
      });
    }
    this.tabChange(event, true, reload);
  }


  handleOnRowSelectData(rows: Array <any>, id: string) {
    rows.forEach(row => row.selected = false);
    this.selected.selected = true;
    let tab = this.getTabOpened(id);
    tab.disabled = false;
    tab.storedRows = rows;
    this.rowData = this.selected;
  }


  onSelect(rows: Array <any>, id: string) {
    switch (id) {
      case '1':
        this.handleOnRowSelectData(rows, id);
        break;

      case '2':
        this.handleOnRowSelectData(rows, id);
        break;
    }
  }

  manageNextSection(id: string) {
    if (id === '1') {
      this.billOrdProd.model.selected = {...this.rowData};
      this.billOrdProd.model.type = BillOrderProductComponent.ORDER;
      this.billOrdProd.next(this.billOrdProd.model);
    } else if (id === '2') {
      this.billOrdProd.model.selected = {...this.rowData};
      this.billOrdProd.model.type = BillOrderProductComponent.PRODUCT;
      this.billOrdProd.next(this.billOrdProd.model);
    }
  }
}
