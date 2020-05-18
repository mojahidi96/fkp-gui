/**
 * Created by bhav0001 on 11-Jul-17.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {OrderHistoryService} from './order-history.service';
import {FixedNetService} from '../fixednet.service';
import {FnOrderDetails} from '../common/fn-order-details';
import {FnUserDetails} from '../common/fn-user-details';

@Component({
  selector: 'order-history',
  templateUrl: 'order-history.component.html',
  styleUrls: ['order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit {

  selected = [];
  loading = false;
  orderListCols: Array<any> = [];
  orders: Array<any> = [];
  @ViewChild('orderNo', {static: true}) orderNo;
  @ViewChild('rowSeleted') rowSeleted;
  isSelected = false;
  fnUser: FnUserDetails;

  constructor(private router: Router, private historyService: OrderHistoryService, private fixednetService: FixedNetService) {
  }

  ngOnInit(): void {
    this.orderListCols = [
      {title: 'Bestellnummer', field: 'orderNumber', show: true, sortable: true, bodyTemplate: this.orderNo},
      {title: 'Auftragstyp', field: 'type', show: true, sortable: true},
      {title: 'Bestellstatus', field: 'status', show: true, sortable: true},
      {title: 'Kundennummer', field: 'nodeId', show: true, sortable: true},
      {title: 'Bestelldatum', field: 'date', sortable: true, show: true, type: 'date'},
      {title: 'Antragsteller', field: 'submitter', show: true, sortable: true}
    ];

    this.loading = true;

    this.historyService.searchOrders().then(data => {
        this.loading = false;
        this.orders = [...data];
      },
      error => {
        console.log('error', error);
      });

    // user details to display title as search or history based on vodafone/customer user
    this.fnUser = this.fixednetService.getFnUser();
  }

  showorderdetails(order: any) {
    let data = new FnOrderDetails;
    data.isApproverFlow = false;
    if (order) {
      data.orderNumber = order.orderNumber;
      data.transactionId = order.transactionId;
    }
    this.fixednetService.setFnOrder(data);
    this.router.navigate(['/fixednet/orderhistorysearch/orderdetails']);
  }

  backbuttonClicked() {
    this.router.navigate(['/fixednet/home']);
  }

}
