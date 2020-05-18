import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrderApprovalsService} from './order-approvals.service';
import {Location} from '@angular/common';
import {OrderConfig} from '../order-commons/order-config';

@Component({
  selector: 'order-approvals',
  templateUrl: 'order-approvals.component.html',
  styleUrls: ['order-approvals.component.scss', '../order-commons/order-common.component.scss']
})
export class OrderApprovalsComponent implements OnInit {

  columns = [];
  subscribers: any[];
  lazy: boolean;
  orderDetail: any;
  adminComments: any[];
  actoptions: any[];
  orderApprovals = [];
  states: any;
  isDisabled: boolean;
  configId = '5c60e182-4a75-511c-e053-1405100af36e';
  lazyLoadUrlOrderReview = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36e';

  constructor(private route: ActivatedRoute,
              private orderApprovalsService: OrderApprovalsService, private _location: Location) {

  }

  ngOnInit(): void {

    this.lazy = true;
    this.states = '0';
    this.actoptions = OrderConfig.approvalOptions;

    this.route.data.subscribe((data: { orderHeaeder: any[] }) => {
      this.orderDetail = data.orderHeaeder;
    });

    this.route.data.subscribe((data: { adminComments: any [] }) => {
      this.adminComments = data.adminComments;
    });

    this.columns = [];
  }


  saveApprover() {
    if (!this.isDisabledButton()) {
      let id;
      this.route.params.subscribe(params => {
        id = params['id'];
      });
      this.orderDetail.action = this.states;
      this.orderDetail.transactionId = id;
      this.orderDetail.customerNumber = this.orderDetail.ban;
      this.orderApprovals.push(this.orderDetail);
      let data = this.orderApprovals;
      console.log(data);
      this.orderApprovalsService.updateApprovalOrder(data).then(val => {
          alert('Successfully saved');
          this.reload();
        },
        error => {
          console.log('error', error);
        });
    }
  }

  reload() {
    this.states = '0';
    this._location.back();
  }

  isDisabledButton() {
    if (this.states === '0') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
    return this.isDisabled;
  }

  backbuttonClicked(e) {
    window.location.href = e;
  }

}
