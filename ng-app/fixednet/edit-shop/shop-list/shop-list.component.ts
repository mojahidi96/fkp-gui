import {OnInit, Component} from '@angular/core';
import {ShopListService} from './shop-list.service';
import {Router} from '@angular/router';
import {FnShop} from '../../common/fn-shop';
import {FixedNetService} from '../../fixednet.service';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';


@Component({
  selector: 'shop-list-app',
  templateUrl: 'shop-list.component.html',
  styleUrls: ['shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  selected = [];
  shopListCols: Array<any> = [];
  shopListData: Array<any> = [];
  fnShop: FnShop;
  loading = false;

  constructor(private router: Router, private shopListService: ShopListService,
              private fixedNetService: FixedNetService, public notify: NotificationHandlerService) {
  }

  ngOnInit(): void {
    this.shopListCols = [
      {title: 'Name des Kunden', field: 'rootCustomerName', show: true, sortable: true},
      {title: 'Name des Shops', field: 'shopName', show: true, sortable: true},
      {title: 'Top-Level Kunde', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'Anzahl Kundennummer', field: 'customerCount', type: 'number', show: true, sortable: true}
    ];

    this.loading = true;

    this.shopListService.getShopList().then(data => {
        this.loading = false;
        this.shopListData = data;
      },
      error => {
        this.notify.printErrorNotification(error);
      }
    );
  }


  rowClick(event: any) {
    this.fnShop = new FnShop;
    if (event.data !== null && event.data !== undefined) {
      this.fnShop.customerName = event.data.customerName;
      this.fnShop.fnCustomerNumber = event.data.fnCustomerNumber;
      this.fnShop.fnRootCustomerNumber = event.data.fnRootCustomerNumber;
      this.fnShop.shopName = event.data.shopName;
      this.fnShop.rootCustomerName = event.data.rootCustomerName;
      this.fnShop.shopId = event.data.shopId;
      this.fixedNetService.setFnShop(this.fnShop);
      this.router.navigate(['/fixednet/editshop/edit']);
    }
  }
}