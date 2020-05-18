import {Component, Input, OnInit} from '@angular/core';
import {OrderConfig} from './order-config';
import {OrderDetailsService} from '../order-detail/order-details.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'order-common',
  templateUrl: 'order-common.component.html',
  styleUrls: ['order-common.component.scss']
})
export class OrderCommonComponent implements OnInit {
  @Input() orderDetail: any;
  @Input() adminComments: any[];
  @Input() adress: any[];
  transId: any;
  toggle: boolean;
  adComToggle: boolean;
  hideCustOrderInfo: boolean;
  vvlType: boolean;
  ctType: boolean;
  actType: boolean;
  dataLoading = true;
  isDebitorExists = true;

  constructor(private orderDetailsService: OrderDetailsService) {
  }

  ngOnInit(): void {
    this.hideCustOrderInfo = this.orderDetail.orderType === OrderConfig.orderTypes.MA_CHANGE_BILLING_PARAM;
    this.vvlType = this.orderDetail.orderType === OrderConfig.orderTypes.PROLONG_SUBSCRIBER;
    this.ctType = this.orderDetail.orderType === OrderConfig.orderTypes.MA_CHANGE_TARIFF;
    this.actType = this.orderDetail.orderType === OrderConfig.orderTypes.ACTIVATE_SUBSCRIBER;
    this.transId = this.orderDetail.transactionId;
    this.isDebitorExists = (this.actType && (this.orderDetail.debitorState !== '2' || this.orderDetail.hasOwnProperty('debitorNumber')))
        || this.vvlType || this.ctType;
  }


  hideShippingDetails() {
    this.toggle = !this.toggle;
  }

  displayAdminComments() {
    this.adComToggle = !this.adComToggle;
    this.orderDetailsService.getAdminAndSubComments(this.transId).pipe(finalize(() => this.dataLoading = false))
      .subscribe((val) => this.adminComments = val);
  }
}
