import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {DataReportShopService} from './data-report-shop.service';
import {Language, TranslationService} from 'angular-l10n';

@Component({
  selector: 'data-report-shop',
  templateUrl: 'data-report-shop.component.html',
  styleUrls: ['data-report-shop.component.scss']
})
export class DataReportShopComponent implements OnInit {

  @ViewChild('dataTable') dataTableComponent: SncrDatatableComponent;
  @ViewChild('shopList', {static: true}) shopList;
  @Output() selectedShop = new EventEmitter();

  @Language() lang: string;

  data: any[];
  loading = true;

  cols = [];

  constructor(private shopservice: DataReportShopService) {

  }

  ngOnInit(): void {
    this.cols = [
      {title: 'Rahmenvertrag', field: 'contract', show: true, sortable: true},
      {title: 'Shop', field: 'shopName', bodyTemplate: this.shopList, show: true, sortable: true}
    ];
    this.shopservice.getUserShopsList().then(data => {
      this.data = data;
      this.loading = false;
    });
  }

  navigateToDataReport(event: any) {
    this.selectedShop.emit(event);
  }
}
