import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {ShopListService} from './shop-list.service';
import {EdShop} from '../../common/ed-shop';
import {EDService} from '../../ed.service';

@Component({
  selector: 'shop-list-app',
  templateUrl: 'shop-list.component.html',
  styleUrls: ['shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  shopListCols: Array<any> = [];
  loading = true;
  shopListData: Array<any> = [];
  edShop: EdShop;

  constructor(private router: Router, private shopListService: ShopListService,
              public notify: NotificationHandlerService, private edService: EDService) {
  }

  ngOnInit(): void {
    this.shopListCols = [
      {title: 'ED-SHOP_LIST_COL1', field: 'rootCustomerName', show: true, sortable: true},
      {title: 'ED-SHOP_LIST_COL2', field: 'shopName', show: true, sortable: true},
      {title: 'ED-SHOP_LIST_COL3', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'ED-SHOP_LIST_COL4', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'ED-SHOP_LIST_COL5', field: 'customerCount', type: 'number', show: true, sortable: true}
    ];
    this.getShopList();
  }

  getShopList() {
    this.shopListService.getShopList().subscribe(data => {
        this.loading = false;
        this.shopListData = data;
      },
      error => {
        this.notify.printErrorNotification(error);
      }
    );
  }

  rowClick(event: any) {
    this.edShop = new EdShop;
    if (event.data !== null && event.data !== undefined) {
      this.edShop = {...this.edShop, ...event.data};
      this.router.navigate(['/ed/editshop/edit'], {state : {Shop : this.edShop}});
    }
  }

}