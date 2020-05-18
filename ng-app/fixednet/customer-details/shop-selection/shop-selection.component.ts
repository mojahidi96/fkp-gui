import {Component, Input, OnInit} from '@angular/core';
import {FnShop} from '../../common/fn-shop';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {CustomerDetailsService} from '../customer-details.service';
import {Language} from 'angular-l10n';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'shop-selection',
  templateUrl: 'shop-selection.component.html',
  styleUrls: ['shop-selection.component.scss']
})

export class ShopSelectionComponent implements OnInit {

  cols: Array<any> = [];
  rowData: FnShop;
  shopSelected: any = null;
  buttonDisable = true;

  @Input() shops: Array<FnShop>;
  @Input() shopSelection: any;
  @Input() loading: any;
  @Input() notify: NotificationHandlerService;

  @Language() lang: string;

  constructor(private notificationHandlerService: NotificationHandlerService,
              private customerDetailsService: CustomerDetailsService) {
  }


  ngOnInit(): void {
    this.cols = [
      {title: 'Name des Kunden', field: 'rootCustomerName', show: true, sortable: true},
      {title: 'Name des Shops', field: 'shopName', show: true, sortable: true},
      {title: 'Top-Level Kunde', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'Anzahl Kundennummer', field: 'customerCount', type: 'number', show: true, sortable: true}
    ];
  }

  manageNextSection() {
    if (this.rowData) {
      this.notificationHandlerService.clearNotification();
      this.shopSelection.model.selected = {...this.rowData};
      this.shopSelection.next(this.shopSelection.model);
      this.customerDetailsService.setCustomerDetails({shopId: this.rowData.shopId});
    }
  }

  onRowSelect() {
    if (this.shopSelected && UtilsService.notNull(this.shopSelected.customerCount) && this.shopSelected.customerCount > 0) {
      this.rowData = this.shopSelected;
      this.buttonDisable = false;
    } else {
      this.buttonDisable = true;
    }
  }
}