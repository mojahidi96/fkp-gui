import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EsimShopListService} from './esimshop-list.service';


@Component({
  selector: 'esim-shop-list',
  templateUrl: 'esimshop-list.component.html',
  styleUrls: ['esimshop-list.component.scss']
})
export class EsimshopListComponent implements OnInit {

  @Output() selectedShop = new EventEmitter();

  data: any[];
  cols = [];
  selectedVfShop;
  shopList: any;
  loading = true;

  constructor (private shoplistService: EsimShopListService) {}

  ngOnInit(): void {
    this.cols = [
      {title: 'SHOP_SELECTION-CUSTOMER_NAME', field: 'customerName', show: true, sortable: true},
      {title: 'SHOP_SELECTION-SHOP_NAME', field: 'shopName', show: true, sortable: true},
      {title: 'SHOP_SELECTION-CONTRACT_NUMBER', field: 'contract', show: true, sortable: true}
    ];
    this.getShopList();
  }

  getShopList() {
    this.shoplistService.getShops().subscribe(response => {
      this.shopList = response;
      this.loading = false;
    })
  }

  onShopSelection(event: any) {
    this.selectedVfShop = event.data;
    this.selectedShop.emit(event);
  }
}