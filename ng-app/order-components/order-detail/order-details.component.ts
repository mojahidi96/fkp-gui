import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderConfig} from '../order-commons/order-config';
import {TimeoutService} from '../../app/timeout/timeout.service';
import {OrderDetailsService} from './order-details.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {Orderdetails} from './orderdetails';

@Component({
  selector: 'order-details',
  templateUrl: 'order-details.component.html',
  styleUrls: ['order-details.component.scss', '../order-commons/order-common.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  columns = [];

  orderSummary: any;
  @Output() output = new EventEmitter();
  orderDetail: any;
  adminComments: any[];
  orderConfig = new OrderConfig();
  lazyLoadUrl: string;
  sortField: string;
  header: string;
  adress: any;
  vvlType: boolean;
  ctType: boolean;
  actType: boolean;
  isApprovalPage: boolean;
  actoptions: any[];
  states: any = '0';
  selected = [];
  debitorStates = ['21', '22'];

  constructor(private router: Router, protected orderDetailsService: OrderDetailsService,
              private route: ActivatedRoute, public timeoutService: TimeoutService) {
  }

  ngOnInit(): void {

    this.actoptions = [
      {text: 'APPROVED_DROPDOWN-TEXT' , value: '5'},
      {text: 'DECLINED_DROPDOWN-TEXT', value: '9'},
      {text: 'PENDING_APPROVAL_DROPDOWN-TEXT', value: '8'}
    ];

    if (this.router.url.includes('approveorder')) {
      this.isApprovalPage = true;
    }

    this.route.data.subscribe((data: { orderHeaeder: any[] }) => {
      this.orderDetail = data.orderHeaeder;
      this.orderDetailsService.getAdressDetails().subscribe( value => {
        this.adress = value;
      });
    });
    this.orderDetail.techFund = this.debitorStates.includes(this.orderDetail.debitorState) || this.orderDetail.debitorType === 'T';
    if (this.orderDetail.techFund) {
      this.orderDetail.debitorType = 'T';
    }
    this.columns = OrderConfig.cols[this.orderDetail.columnListName];
    this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.orderDetail.configId;
    this.vvlType = this.orderDetail.orderType === OrderConfig.orderTypes.PROLONG_SUBSCRIBER;
    this.orderDetailsService.getTotalSummary().subscribe(totalSummary => {
      this.orderSummary = {
        tariffSummary: totalSummary.availableTariffs,
        handySummary: UtilsService.notNull(totalSummary.hardware) && UtilsService.notNull(totalSummary.hardware.articleNumber) ?
                        totalSummary.hardware : null,
        socSummary: totalSummary.socs,
        totalSummary: totalSummary,
        displayDep: UtilsService.notNull(totalSummary.hardware) && UtilsService.notNull(totalSummary.hardware.depCustomerId),
        depData: { depVendorName: UtilsService.notNull(totalSummary.hardware) ? totalSummary.hardware.depVenderName : '' }
      };
    });
    this.vvlType = this.orderDetail.orderType === OrderConfig.orderTypes.PROLONG_SUBSCRIBER;
    this.ctType = this.orderDetail.orderType === OrderConfig.orderTypes.MA_CHANGE_TARIFF;
    this.actType = this.orderDetail.orderType === OrderConfig.orderTypes.ACTIVATE_SUBSCRIBER;

  }

  backButton() {
    window.location.href = this.timeoutService.vfUser ? OrderConfig.backButtonUrls.ORDER_SEARCH : OrderConfig.backButtonUrls.ORDER_HISTORY;
  }

  backButtonApproval() {
    this.router.navigate([OrderConfig.backButtonUrls.ORDER_APPROVAL]);
  }

  isDisabledButton() {
    return this.states === '0' ;
  }

  saveApprover() {
    let data = new Orderdetails();
    data.transactionId =  this.orderDetail.transactionId;
    data.orderType =  this.orderDetail.orderType;
    data.orderNumber =  this.orderDetail.orderNumber;
    data.customerNumber =  this.orderDetail.ban;
    data.action =  this.states;
    this.selected.push(data);
    if (!this.isDisabledButton()) {
      this.orderDetailsService.updateApprovalOrder(this.selected).then(() => {
        this.router.navigate([OrderConfig.backButtonUrls.ORDER_APPROVAL]);
      }, error => {
        console.log('error', error);
      });
    }
  }

}

