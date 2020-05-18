import {Component, Input, OnInit, AfterViewInit, AfterViewChecked, SimpleChanges, OnChanges, ViewChild} from '@angular/core';
import {FnShop} from '../../common/fn-shop';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {CustomerSelctionService} from './customer-selection.service';
import {CustomerDetailsService} from '../customer-details.service';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'customer-selection',
  templateUrl: 'customer-selection.component.html',
  styleUrls: ['customer-selection.component.scss']
})

export class CustomerSelectionComponent implements OnInit, OnChanges {
  cols: Array<any> = [];
  rowData: FnShop;
  customers: Array<any> = [];
  shopId = '';
  loading = false;

  @ViewChild('radio') radio;
  @Input() shop: any;
  @Input() customerSelection: any;
  @Input() notify: NotificationHandlerService;

  customerSelected: any = null;

  constructor(private customerSelctionService: CustomerSelctionService,
              private customerDetailsService: CustomerDetailsService) {
  }


  ngOnInit(): void {
    this.cols = [
      {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'Kundenname', field: 'customerName', show: true, sortable: true},
      {title: 'Übergeordnete Kundennummer', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'Name', field: 'rootCustomerName', show: true, sortable: true}
    ];
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.customers = [];
    if (changes['shop'] && !UtilsService.isEmpty(this.shop)) {
      this.shopId = this.shop.shopId;
      this.getCustomersOnLandingPage(this.shopId);
    } else {
      this.getCustomersOnLandingPage('');
    }
  }

  manageNextSection() {
    if (this.rowData) {
      this.notify.clearNotification();
      this.customerSelection.model.selected = {...this.rowData};
      this.customerSelection.next(this.customerSelection.model);
    }
  }

  onRowSelect() {
    if (this.customerSelected) {
      this.customerSelection.model.selected = this.customerSelected;
      this.rowData = this.customerSelected;
      let customerNo = this.customerSelected.fnCustomerNumber ? this.customerSelected.fnCustomerNumber
        : this.customerSelected.fnRootCustomerNumber;
      let rootCustomerNo = this.customerSelected.fnRootCustomerNumber ? this.customerSelected.fnRootCustomerNumber : '';
      this.customerDetailsService.setCustomerDetails({customerNo: customerNo, rootCustomerNo: rootCustomerNo});
    }
  }

  getCustomersOnLandingPage(shopId: string) {
    this.loading = true;
    this.customerSelctionService.getCustomersOnLandingPage(shopId).then(data => {
      this.loading = false;
      this.customers = [...data];
    }, error => {
      this.loading = false;
      this.notify.printErrorNotification(error);
    });
  }

  isDisabled(): boolean {
    if (this.customerSelected) {
      return false;
    }
    return true;
  }
}
