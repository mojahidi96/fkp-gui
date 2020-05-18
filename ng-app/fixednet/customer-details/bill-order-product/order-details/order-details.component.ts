import {Component, OnChanges, SimpleChanges, Input, ViewChild} from '@angular/core';
import {OrderDetailsService} from './order-details.service';
import {CustomerDetail} from '../product-details/customer-detail';
import {OrderDetailsConfig} from './order-details-config';
import {NotificationHandlerService} from '../../../../sncr-components/sncr-notification/notification-handler.service';
import {OrderDetail} from './order-detail';
import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../sncr-components/sncr-commons/utils.service';


@Component({
  selector: 'order-details',
  templateUrl: 'order-details.component.html',
  styleUrls: ['order-details.component.scss'],
  providers: [OrderDetailsService]
})


export class OrderDetailsComponent implements OnChanges {

  @Input() order: any;
  @Input() shop: any;
  @Input() customer: any;
  @Input() notify: NotificationHandlerService;

  customerDetail: CustomerDetail;
  orderDetail: OrderDetail;
  config: any;
  isOrderDetailLoading = false;
  isPositionDetailLoading = false;
  address: any;
  orderRequest: any;
  orderDetails: any;
  orderPosDetails: any;
  positionId: string;
  customerMessage = '';

  @ViewChild('accordion', {static: true}) accordion: NgbAccordion;

  constructor(private orderDetailsService: OrderDetailsService) {
    this.config = OrderDetailsConfig;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.orderRequest = {};
    this.customerDetail = new CustomerDetail();
    if (changes['order'] && this.shop !== undefined) {
      this.customerDetail.shopId = this.shop.shopId ? this.shop.shopId : '';
    }
    if (changes['order']) {
      // parent_cust_no is null then it will be customer_no
      this.customerDetail.rootCustomerNo = this.customer.rootCustNo ? this.customer.rootCustNo : '';
      this.customerDetail.customerNo = this.customer.fnCustomerNumber ? this.customer.fnCustomerNumber : '';
      this.orderRequest.barCodeId = this.order.barCodeId ?
        this.order.barCodeId : '';
      this.orderRequest.orderStatus = this.order.orderStatus ?
        this.order.orderStatus : '';

      // reset the data
      this.orderDetails = {};
      this.orderPosDetails = {};
      // close the other panel that were open
      this.accordion.closeOtherPanels = true;
      // reset the positionId that was set
      this.positionId = '';
    }
  }


  panelChange(event: any) {
    let panelId = event.panelId;
    let url;
    if (event.nextState && panelId) {
      this.orderDetail = new OrderDetail();
      this.accordion.closeOtherPanels = false;
      this.orderDetail.barCodeId = this.orderRequest.barCodeId ? this.orderRequest.barCodeId : '';
      this.orderDetail.positionId = this.positionId;
      switch (panelId) {
        case 'panel-2':
          url = this.config.orderDetailsUrl;
          this.isOrderDetailLoading = true;
          this.setPanelData(panelId, url);
          break;

        case 'panel-3':
          url = this.config.orderPosDetailsUrl;
          this.isPositionDetailLoading = true;
          this.setPanelData(panelId, url);
          break;
      }
    }
  }

  setPanelData(panelId: string, url: string) {
    this.orderDetailsService.getFnData(this.orderDetail, url).then(data => {
      switch (panelId) {
        case 'panel-2':
          this.orderDetailsService.getCustomerMessage(this.orderDetail).subscribe((res: any) => {
            if (res && !UtilsService.deepCompare(res, '{}')) {
              this.customerMessage = res.customerMessage;
              this.orderDetails = {...data};
              this.isOrderDetailLoading = false;
              this.positionId = this.getPositionId();
            }
          });
          break;
        case 'panel-3':
          this.isPositionDetailLoading = false;
          this.orderPosDetails = {...data};
          break;
      }
    }, error => {
      this.isOrderDetailLoading = false;
      this.isPositionDetailLoading = false;
      this.notify.printErrorNotification(error);
    });
  }

  getPositionId(): string {
    if (this.orderDetails && JSON.stringify(this.orderDetails) !== '{}' && this.orderDetails.shortPositionList &&
      this.orderDetails.shortPositionList.length) {
      let positionObj = this.orderDetails.shortPositionList.find(position => position.serialNumber ?
        position.serialNumber === '001' : false);
      if (positionObj && positionObj.positionID) {
        return positionObj.positionID;
      }
      return '';
    }
  }
}
