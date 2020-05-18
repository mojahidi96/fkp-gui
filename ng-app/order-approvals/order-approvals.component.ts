/**
 * Created by bhav0001 on 06-Jul-17.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {OrderApprovalsService} from './order-approvals.service';
import {FixedNetService} from '../fixednet/fixednet.service';
import {FnOrderDetails} from '../fixednet/common/fn-order-details';
import {FnUserDetails} from '../fixednet/common/fn-user-details';
import {OrderApproverConfig} from './order-approvals.config';
import {Column} from '../sncr-components/sncr-datatable/column';

@Component({
  selector: 'order-approvals',
  templateUrl: 'order-approvals.component.html',
  styleUrls: ['order-approvals.component.scss']
})

export class OrderApprovalsComponent implements OnInit {

  selected = [];
  SelectionTitle = 'Eintrag ausgewählt';
  header = 'Auswählen';
  loading = true;
  orderListCols: Array<Column> = [];
  orderData: Array<any> = [];
  @ViewChild('locationDetails', {static: true}) locationDetails;
  @ViewChild('productDetails', {static: true}) productDetails;
  @ViewChild('orderNo', {static: true}) orderNo;

  actoptions: any[];
  states: any = '0';
  showDropdown = false;
  fnUser: FnUserDetails = new FnUserDetails();
  flowType: any;
  selectMessage: string;
  nonLegacyFlows = ['Vertragsverlängerung', 'Neukarte'];

  constructor(private router: Router,
              private approvalService: OrderApprovalsService,
              private fixednetService: FixedNetService) {
  }

  ngOnInit(): void {

    const fixednetCols = [
      {title: 'Bestellnummer', field: 'orderNumber', show: true, sortable: true},
      {title: 'Auftragstyp', field: 'orderType', show: true, sortable: true},
      {title: 'Kundennummer', field: 'customerNumber', show: true, sortable: true},
      {title: 'Bestelldatum', field: 'orderDate', show: true, sortable: true, type: 'date'},
      {title: 'Standort', field: 'location', bodyTemplate: this.locationDetails, show: true, sortable: true},
      {title: 'Produkt', field: 'product', bodyTemplate: this.productDetails, show: true, sortable: true}
    ];

    const mobileCols = [
      {title: 'Bestellnummer', field: 'orderNumber', bodyTemplate: this.orderNo, show: true, sortable: true},
      {title: 'Auftragstyp', field: 'orderType', show: true, sortable: true},
      {title: 'Kundennummer', field: 'customerNumber', show: true, sortable: true},
      {title: 'Bestelldatum', field: 'orderDate', show: true, sortable: true, type: 'date'}
    ];


    this.flowType = window.location.hash.includes('fixednet') ? OrderApproverConfig.fixednet : OrderApproverConfig.mobile;
    this.fnUser = this.fixednetService.getFnUser();
    this.actoptions = this.flowType.actOptions;
    if (this.flowType.type === 'mobile') {
      this.orderListCols = mobileCols;
    } else {
      this.orderListCols = fixednetCols;
    }


    // setting the body templates to the columns
    this.orderListCols[0].bodyTemplate = this.orderNo;
    if (this.flowType.type === 'fixednet') {
      this.orderListCols[4].bodyTemplate = this.locationDetails;
      this.orderListCols[5].bodyTemplate = this.productDetails;
    }

    this.approvalService.getapprovalslist(this.flowType.type).then(data => {
      this.loading = false;
      this.orderData = data.map((element) => {
        if (element && this.flowType.type === 'fixednet') {
          element.location = element.locationDetails1 + ' ' + element.locationDetails2;
          element.product = element.productDetails1 + ' ' + element.productDetails2;
        }
        return element;
      });
    }, error => {
      console.log('error', error);
    });
  }

  onSelection(selectedEvent) {
    selectedEvent.length === 1 ? this.selectMessage = 'Bestellung ' : this.selectMessage = 'Bestellungen ';
    this.states = selectedEvent.length === 0 ? '0' : this.states;
    this.showDropdown = selectedEvent.length > 0;
    console.log(this.selected);
  }

  saveApprover() {
    if (!this.isDisabledButton()) {
      this.selected.forEach(val => val.action = this.states);
      this.approvalService.updateApprovalOrder(this.selected).subscribe(() => {
        this.reload();
      }, error => {
        console.log('error', error);
      });
    }
  }

  reload() {
    this.loading = true;
    this.states = '0';
    this.showDropdown = false;
    this.selected = [];
    this.approvalService.getapprovalslist(this.flowType.type).then(data => {
      this.loading = false;
      this.orderData = data;
    }, error => {
      console.log('error', error);
    });
  }

  showOrderDetails(order) {
    let data = new FnOrderDetails();
    data.isApproverFlow = true;
    data.orderNumber = order.orderNumber;
    data.transactionId = order.transactionId;
    this.fixednetService.setFnOrder(data);
    if (this.flowType.type === 'fixednet') {
      this.router.navigate([this.flowType.orderDetailPageUrl]);
    } else if (this.nonLegacyFlows.indexOf(order.orderType) > -1) {
      window.location.href = this.flowType.orderApprovalPageUrl + order.transactionId;
    } else {
      window.location.href = this.flowType.orderDetailPageUrl + order.transactionId;
    }
  }

  backButtonClicked() {
    if (this.flowType.type === 'fixednet') {
      this.router.navigate([this.flowType.landingPageUrl]);
    } else {
      window.location.href = this.flowType.landingPageUrl;
    }
  }

  isDisabledButton() {
    return this.states === '0' || this.selected.length === 0 || (this.fnUser && this.fnUser.isReadOnlyUser);
  }

}
