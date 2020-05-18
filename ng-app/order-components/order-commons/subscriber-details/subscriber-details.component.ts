import {Component, Input, OnInit} from '@angular/core';
import {OrderConfig} from '../order-config';

@Component({
  selector: 'subscriber-details',
  templateUrl: 'subscriber-details.component.html'
})

export class SubscriberDetailsComponent implements OnInit {

  @Input() orderDetail;
  cols: any[];
  lazyLoadUrl: string;


  ngOnInit() {
    this.cols = OrderConfig.cols.prolongSubCols;

    this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.orderDetail.configId;
  }
}
