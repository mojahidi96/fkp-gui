import {Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild} from '@angular/core';
import {CustomerDetailsService} from '../../customer-details.service';
import {ProductDetailsService} from './product-details.service';
import {NotificationHandlerService} from '../../../../sncr-components/sncr-notification/notification-handler.service';
import {CustomerDetail} from './customer-detail';
import {ProductDetailsConfig} from './product-details.config';
import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'prod-details',
  templateUrl: 'product-details.component.html',
  styleUrls: ['product-details.component.scss'],
  providers: [ProductDetailsService]
})


export class ProductDetailsComponent implements OnChanges {

  customerDetail: CustomerDetail;
  isProductsLoading = false;
  productDetails: any;
  address: any;
  productAddress: any;
  config: any;
  serviceData = [];
  accesses = [];
  accessCols = [];
  accessSelected = [];
  voice: any;
  internet: any;
  hardwares = [];
  hardwareCols = [];
  officeNetSeats = [];
  officeNetCurrentPage = 0;
  officeNetCollectionSize = 0;
  officeNetSeat: any;

  @Input() product: any;
  @Input() shop: any;
  @Input() customer: any;
  @Input() notify: NotificationHandlerService;
  @ViewChild('accordion') accordion: NgbAccordion;
  private serviceSelected = 'choose';

  constructor(private customerDetailsService: CustomerDetailsService,
              private productDetailsService: ProductDetailsService) {
    this.config = ProductDetailsConfig;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.customerDetail = new CustomerDetail();
    if (changes['product'] && (this.shop !== undefined)) {
      this.customerDetail.shopId = this.shop.shopId ? this.shop.shopId : '';
    }
    if (changes['product']) {
      this.customerDetail.rootCustomerNo = this.customer.rootCustNo ? this.customer.rootCustNo : '';
      this.customerDetail.customerNo = this.customer.fnCustomerNumber ? this.customer.fnCustomerNumber : '';
      this.customerDetail.productId = this.product.productId ?
        this.product.productId : '';
      // reset the product details
      this.productDetails = {};
      this.accordion.closeOtherPanels = true;
    }
  }


  mapServicesData() {
    let typeMap = this.config.typeMap;
    let serviceData = [];
    Object.keys(this.productDetails.resultSet).forEach((service) => {
      if (typeMap[service]) {
        let serviceEle = {'key': '', 'value': ''};
        serviceEle.key = service;
        serviceEle.value = typeMap[service];
        serviceData.push(serviceEle);
      }
    });
    this.serviceData = serviceData;
  }

  updateValueSelected(value: any) {
    let service1 = this.serviceData.find(service => service.value === value);
    this.updateServices(service1.key);
  }


  updateServices(service: string) {
    switch (service) {
      case 'accesses':
        this.accessCols = this.config.accessCols;
        this.accesses = this.productDetails.resultSet[service];
        this.accesses = this.accesses.map((access) => {
          if (access.name) {
            access.rootName = `${access.name.organizationName} ${access.name.suffix}`;
          }
          return access;
        });
        break;

      case 'voice':
        this.voice = this.productDetails.resultSet[service];

        break;


      case 'internet':
        this.internet = this.productDetails.resultSet[service];

        break;


      case 'safetyPackages':

        break;

      case 'extraNumbers':

        break;

      case 'directoryEntries':

        break;

      case 'hardwareSet':

        this.hardwareCols = this.config.hardwareCols;
        this.hardwares = this.productDetails.resultSet[service];

        this.hardwares = this.hardwares.map((hardware) => {
          if (hardware.hardwareMailingAddress) {
            hardware.address = `${hardware.salutationDescription} ${hardware.forname} ${hardware.name} 
                                ${hardware.hardwareMailingAddress.street}
                                ${hardware.hardwareMailingAddress.streetNumber} ${hardware.hardwareMailingAddress.streetNumberSuffix}
                                ${hardware.hardwareMailingAddress.country} ${hardware.hardwareMailingAddress.postalCode}
                                ${hardware.hardwareMailingAddress.city}`;
          }
          return hardware;
        });
        break;

      case 'officeNetSeats':

        this.officeNetSeats = this.productDetails.resultSet[service];
        if (this.officeNetSeats && this.officeNetSeats.length > 0) {
          this.officeNetCollectionSize = this.officeNetSeats.length;
          this.officeNetCurrentPage = 1;
          this.officeNetSeat = this.officeNetSeats[this.officeNetCurrentPage - 1];
        }
        break;
    }
  }

  updateOfficeNetSeatObject(pageNumber) {
    if (this.officeNetSeats.length > 0) {
      this.officeNetSeat = this.officeNetSeats[pageNumber - 1];
    }
  }

  panelChange(event: any) {
    let panelId = event.panelId;
    let url;
    if (event.nextState && panelId === 'panel-2'
      && (!this.productDetails || JSON.stringify(this.productDetails) === JSON.stringify({}))) {
      this.accordion.closeOtherPanels = false;
      url = this.config.productDetailUrl;
      this.setPanelData(panelId, url);
    }
  }


  setPanelData(panelId: string, url: string) {
    this.isProductsLoading = true;
    this.productDetailsService.getFnData(this.customerDetail, url).then(data => {
      this.isProductsLoading = false;
      this.productDetails = {...data};
      this.productAddress = this.productDetails.resultSet.address;
      this.mapServicesData();
    }, error => {
      this.isProductsLoading = false;
      this.notify.printErrorNotification(error);
    });
  }
}
