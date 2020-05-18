/**
 * Created by bhav0001 on 14-Jul-17.
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FixedNetService} from '../../fixednet.service';
import {OrderDetailsService} from './order-details.service';
import {FnOrderDetails} from '../../common/fn-order-details';
import {OrderApprovalsService} from '../../../order-approvals/order-approvals.service';
import {Field, Panel} from '../../order/dynamic-panels/panel';
import {OrderService} from '../../order/order.service';
import {FnUserDetails} from '../fn-user-details';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';


@Component({
  selector: 'order-details',
  templateUrl: 'order-details.component.html',
  styleUrls: ['order-details.component.scss', '../../order-history/order-history.component.scss']
})

export class OrderDetailsComponent implements OnInit {

  loading = false;
  order: FnOrderDetails;
  orderDetails: any = {};
  actoptions: any[];
  location: any = {};
  states: any;
  noContactDetails: boolean;
  showApproverTab: boolean;
  panels: Panel[];
  fnUser: FnUserDetails = new FnUserDetails();
  customerMessage = '';

  constructor(private router: Router, private fixednetService: FixedNetService, private deatilService: OrderDetailsService,
              private approvalService: OrderApprovalsService, private orderService: OrderService) {
    this.order = new FnOrderDetails();
    this.location = {};
    this.showApproverTab = false;
  }

  ngOnInit(): void {
    this.order = this.fixednetService.getFnOrder();
    this.fnUser = this.fixednetService.getFnUser();
    this.showApproverTab = this.order.isApproverFlow;
    this.customerMessage = '';

    this.actoptions = [
      {text: 'Genehmigt', value: '5'},
      {text: 'Abgelehnt', value: '9'},
      {text: 'Genehmigung ausstehend', value: '8'}
    ];
    this.states = '0';

    this.loading = true;
    this.getOrderDetails();
    this.getCustomerMessage();
  }

  saveApprover() {
    if (this.states !== '0') {
      let dataArray: Array<any> = [];
      let data: any = {};
      data.action = this.states;
      // data.orderType = this.orderDetails.orderType;
      data.orderNumber = this.orderDetails.cartDetails.orderNumber;
      data.transactionId = this.orderDetails.transactionId;
      data.ban = this.orderDetails.cartDetails.customerNumber;
      dataArray.push(data);

      this.approvalService.updateApprovalOrder(dataArray).subscribe(val => {
          this.router.navigate(['/fixednet/orderapprovals']);
        },
        error => {
          console.log('error', error);
        });
    }
  }

  getOrderDetails() {
    Promise
      .all([
        this.deatilService.getPanels(this.order.transactionId),
        this.deatilService.getOrderDetail(this.order.transactionId)
      ])
      .then(([panels, data]) => {
          this.loading = false;
          this.orderDetails = data;
          this.location = data.cartDetails.location;
          this.noContactDetails = (this.orderDetails.email === '' && this.orderDetails.fax === '' && this.orderDetails.houseNumber === ''
            && this.orderDetails.mobile === '' && this.orderDetails.name === '' && this.orderDetails.phone === '');

          this.panels = this.orderService.parsePanels(panels);
          this.panels.forEach(panel => {
            panel.contents.forEach(row => {
              row.forEach(field => {
                if (field.type === 'table') {
                  const radio = Object.keys(field.rows[0]).find(k => {
                    return field.rows[0][k].type === 'radio';
                  });
                  const selectedRow = data.cartDetails.details.panelFields
                    .find(f => f.fieldId === field.rows[0][radio].fieldId);
                  const fields = field.rows.find(r => r[radio].values[0].value === selectedRow.fieldValue);

                  Object.keys(fields).forEach(key => {
                    let f = fields[key];
                    const splitId = f.fieldId.split('-');
                    if (splitId.length) {
                      f.fieldId = splitId[splitId.length - 1];
                    }
                    this.setDefaultValues(data, f);
                  });
                } else {
                  this.setDefaultValues(data, field);
                }
              });
            });
          });
        },
        error => {
          console.log('error', error);
        });
  }

  reload() {
    this.loading = true;
    this.states = '0';
    this.getOrderDetails();
    this.showApproverTab = false;
  }

  backbuttonClicked() {
    if (this.order.isApproverFlow) {
      this.router.navigate(['/fixednet/orderapprovals']);
    } else {
      this.router.navigate(['/fixednet/orderhistorysearch']);
    }

  }

  private setDefaultValues(data, field: Field) {
    const defaultValue = data.cartDetails.details.panelFields
      .find(f => f.fieldId === field.fieldId);
    if (defaultValue) {
      field.defaultValue = defaultValue.fieldValue === 'false' ? false : defaultValue.fieldValue;
    }
  }


  getCustomerMessage() {
    let requestObj: any = {};
    if (this.order) {
      requestObj.barCodeId = this.order.orderNumber;
    }
    this.deatilService.getCustomerMessage(requestObj)
      .subscribe(res => {
        if (res && Object.keys(res).length) {
          this.customerMessage = res['customerMessage'];
        }
      });
  }
}