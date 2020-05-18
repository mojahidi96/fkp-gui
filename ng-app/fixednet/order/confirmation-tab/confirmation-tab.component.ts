import {Component, OnInit} from '@angular/core';
import {OrderService} from '../order.service';
import {OrderConfig} from '../order-config';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'confirmation-tab',
  templateUrl: 'confirmation-tab.component.html'
})
export class ConfirmationTabComponent implements OnInit {

  data: any;
  orderConfig: any;
  private mainForms: FormGroup[][];
  orderResponse: any;

  constructor(private orderService: OrderService) {

  }

  ngOnInit(): void {
    this.orderService.disableTabsFrom(1);
    this.data = this.orderService.getOrderResponse();
    this.orderService.setFnOrderRequest(null);

    if (this.data) {
      this.orderService.resetData();
    }
  }
}