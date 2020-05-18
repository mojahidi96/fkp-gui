import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CONSTANTS} from '../../soc-management/constants';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';

@Component({
  selector: 'order-maintain-soc-review',
  templateUrl: 'order-review.component.html',
  styleUrls: ['order-review.component.scss']
})

export class OrderReviewComponent implements OnInit, OnChanges {

  @ViewChild('maintainSocReview') reviewTable: SncrDatatableComponent;

  @ViewChild('price', {static: true}) priceTemplate;
  @ViewChild('OTprice', {static: true}) OTpriceTemplate;

  @Input() reviewSubsWithSocs = [];
  @Input() totalMAmount: number;
  @Input() totalOTAmount: number;
  @Input() vatAmount: number;
  @Input() vatOTAmount: number;
  resultMessage= [];

  constants: CONSTANTS;
  reviewOrderCols: any[];

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reInitilize();
  }

  ngOnInit(): void {
    this.resultMessage = ['Keine geplante Änderungen gefunden', 'Eine geplante Änderungen gefunden', 'geplante Änderungen gefunden'];
    this.constants = new CONSTANTS();
    this.setreviewOrderCols();
    this.reInitilize();
  }

  reInitilize() {
    this.setreviewOrderCols();
    this.reviewSubsWithSocs = [...this.reviewSubsWithSocs];
    this.reviewTable.dt.reset();
    this.reviewTable.dt.sortField = 'ban';
    this.reviewTable.dt.sortOrder = 1;
    setTimeout(() => {
      this.reviewTable.dt.value.sort((a, b) => {
        if (a['ban'] === b['ban']) {
          return 0;
        } else if (a['ban'] > b['ban']) {
          return 1;
        } else {
          return -1;
        }
      });
    }, 50);
  }

  setreviewOrderCols() {
    this.reviewOrderCols = [
      {title: 'Kundennummer', field: 'ban', 'show': true, 'type': 'number'},
      {title: 'Teilnehmer', field: 'subscriber', 'show': true, 'type': 'text'},
      {title: 'Bisherige Tarifoption', field: 'oldTariff', 'show': true, 'type': 'text'},
      {title: 'Neue Tarifoption', field: 'newTariff', 'show': true, 'type': 'text'},
      {title: 'Einrichtungspreis', field: 'oneTimeCharge', 'show': this.totalOTAmount > 0,
        bodyTemplate: this.OTpriceTemplate, 'type': 'price'},
      {title: 'Basispreis (mtl.)', field: 'monthlyCharge', 'show': this.totalMAmount > 0,
        bodyTemplate: this.priceTemplate, 'type': 'price'},
      {title: 'Gültig ab', field: 'effectiveDate', 'show': true, 'type': 'text'}
    ];
  }

}
