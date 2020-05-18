import {Component, OnInit, ViewChild, Input, AfterViewInit} from '@angular/core';
import {ProductLocationConfig} from './product-location-config';
import {ProductLocationService} from './product-location.service';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {OrderService} from '../order.service';
import {NgbTabset, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {OrderConfig} from '../order-config';
import {Filter} from '../../../sncr-components/sncr-datatable/filter/filter';
import {SncrDatatableComponent} from '../../../sncr-components/sncr-datatable/sncr-datatable.component';
import {FixedNetService} from '../../fixednet.service';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {CreateEditShop} from '../../common/create-edit-shop/create-edit-shop';

@Component({
  selector: 'product-location',
  templateUrl: 'product-location.component.html',
  styleUrls: ['product-location.component.scss']
})
export class ProductLocationComponent extends CreateEditShop implements OnInit {

  locationCols: Array<any>;
  installProductCols: Array<any>;
  addressesCols: Array<any>;
  productLocationConfig: any;
  addressForm: FormGroup;
  locations = [];
  installProducts: Array<any>;
  addresses: Array<any>;
  loading = false;
  availableProducts: Array<any>;

  @ViewChild('radio', {static: true}) radio;
  @ViewChild('product', {static: true}) product;
  @ViewChild('bandwidth', {static: true}) bandwidth;
  @ViewChild('radio1', {static: true}) radio1;
  @ViewChild('address', {static: true}) address;
  @ViewChild('productLocTable') productLocTable: SncrDatatableComponent;
  @ViewChild('t') toolTip: NgbTooltip;

  @Input()
  tab: NgbTabset;

  cartItems = 0;
  fnOrderRequest: any;
  cartItemsData: any;
  isAddressLoading = false;
  isAvlProductsLoading = false;
  isInstalledProductsLoading = false;
  addressErrorMessage: string;
  addressLoadTable = true;
  installServiceHeader = '';
  orgLocationsLength = 0;
  orderConfig: any;
  customerNo: string;
  items = [];

  constructor(private productLocationService: ProductLocationService, public notify: NotificationHandlerService,
              private formBuilder: FormBuilder, private orderService: OrderService,
              private fixedNetService: FixedNetService) {
    super(fixedNetService);
  }


  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.locations = [];
    this.orderConfig = OrderConfig;
    this.productLocationConfig = ProductLocationConfig;
    let locationUrl = this.productLocationConfig.locationUrl;

    this.locationCols = [
      {title: '', field: 'selected', show: false, bodyTemplate: this.radio1, filter: false, sortable: false},
      {title: 'PLZ', field: 'code', show: false, sortable: true},
      {title: 'Stadt', field: 'city', show: false, sortable: true},
      {title: 'Straße', field: 'street', show: false, sortable: true},
      {title: 'Nr.', field: 'houseNumber', show: false, sortable: true},
      {title: 'Adresse', field: 'address', bodyTemplate: this.address, show: true, sortable: true},
      {title: 'Name', field: 'cname', show: true, sortable: true},
      {title: 'Produkt', field: 'product', bodyTemplate: this.product, show: true, sortable: false, filter: false},
      {title: 'Bandbreite', field: 'bandwidth', bodyTemplate: this.bandwidth, show: true, sortable: false, filter: false}
    ];

    this.addressesCols = [
      {title: '', field: 'selected', show: true, bodyTemplate: this.radio, filter: false, sortable: false},
      {title: 'Postleitzahl', field: 'code', show: true, sortable: true},
      {title: 'Stadt', field: 'city', show: true, sortable: true},
      {title: 'Straße', field: 'street', show: true, sortable: true},
      {title: 'Hausnummer', field: 'houseNumber', show: true, sortable: true},
      {title: '', field: 'multiSelect', show: false, sortable: false}
    ];
    this.installProductCols = this.productLocationConfig.installProductCols;

    this.createForm();

    this.fnOrderRequest = {...this.orderService.getFnorderRequest()};

    if (this.fnOrderRequest && this.fnOrderRequest.customerNumber) {
      this.loading = true;
      this.customerNo = this.fnOrderRequest.customerNumber;
      let locationsCopy = [];
      const locationData = {...this.orderService.getFnOrderRequestLocationData()};
      if (!this.fnOrderRequest || ((!this.fnOrderRequest.items || this.fnOrderRequest.items.length === 0)
          && (JSON.stringify(locationData) === '{}' || !locationData
            || !locationData.locations || !locationData.locations.length))) {

        locationUrl = encodeURI(locationUrl + this.customerNo
          + '/locations');

        this.productLocationService.getData(locationUrl).then(data => {
            this.loading = false;
            locationsCopy = [...this.productLocationService.mapJson(data, this.fnOrderRequest)];
            if (locationsCopy && locationsCopy.length > 0) {
              locationsCopy = this.productLocationService.sortLocationOnCode([...locationsCopy]);
            }
            this.locations = [...locationsCopy];
            this.orgLocationsLength = this.locations.length;
          },
          error => {
            this.loading = false;
            this.notify.printErrorNotification(error);
          }
        );
      } else {
        if (locationData && locationData.locations && locationData.locations.length) {
          if (this.fnOrderRequest.items.length) {
            this.items = [...this.fnOrderRequest.items];
            this.setLocationsData(locationData);
            if (this.items) {
              this.cartItems = this.getTotalItems();
            }
          } else {
            this.setLocationsData(locationData);
          }
        }
      }
    }
  }


  onLocationSelect(event) {
    if (event.data) {
      this.isInstalledProductsLoading = true;
      let houseNumber = event.data.houseNumber;
      let street = event.data.street;
      let city = event.data.city;
      let code = event.data.code;
      let installProductUrl = this.productLocationConfig.productUrl;

      this.installServiceHeader = `@ ${houseNumber} ${street } ${city } ${code }`;

      installProductUrl = encodeURI(installProductUrl + this.customerNo
        + '/locations/' + houseNumber + '|' + street + '|' + city + '|' + code + '/installedproducts');

      this.isInstalledProductsLoading = true;
      this.productLocationService.getData(installProductUrl).then(data => {
          this.isInstalledProductsLoading = false;
          this.installProducts = [...data];
        },
        error => {
          this.isInstalledProductsLoading = false;
          this.notify.printErrorNotification(error);
        }
      );
    }
  }

  createForm() {
    this.addressForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5),
        CustomValidators.sanitization(this.patternMap)]],
      city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150),
        CustomValidators.sanitization(this.patternMap)]],
      street: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150),
        CustomValidators.sanitization(this.patternMap)]],
      houseNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10),
        CustomValidators.sanitization(this.patternMap)]],
    });
  }

  getSuggestedAddresses() {
    if (this.addressForm.valid) {
      let addressUrl = this.productLocationConfig.addressUrl;
      let addressData = this.addressForm.value;
      let code = addressData.code.trim();
      let city = addressData.city.trim();
      let street = addressData.street.trim();
      let houseNumber = addressData.houseNumber.trim();
      addressUrl = encodeURI(addressUrl + this.customerNo +
        '/addresses/' + (houseNumber || '') + '|' + (street || '') + '|' + (city || '') + '|' + (code || ''));

      if (code && code.length === 5 && city && street && houseNumber) {
        this.isAddressLoading = true;
        this.addressErrorMessage = '';
        this.productLocationService.getData(addressUrl).then(data => {
            this.isAddressLoading = false;
            // clear the error message that was set previously
            this.notify.clearNotification();
            let addresses = this.productLocationService.mapJson(data.locations, this.fnOrderRequest);
            if (data.count === 0) {
              this.addressLoadTable = false;
              this.addressErrorMessage = this.productLocationConfig.addressErrorMesages.NoSuggestedAddresses;
            } else if (data.count === 1) {
              this.addressLoadTable = false;
              this.pushAddressIntoLocation(addresses[0]);
            } else if (data.count > 1) {
              this.addressLoadTable = true;
              this.addressErrorMessage = this.productLocationConfig.addressErrorMesages.ChooseFromSuggestedAddresses;
              // ... but has too many addresses!...
              if (data.count > 10) {
                this.addressErrorMessage = this.productLocationConfig.addressErrorMesages.TooManySuggestedAddresses;
              }

              // if previously searched data is aleady there in locations
              // When we have added the addresses to the locations then the locations length wont be the same
              // only when the there difference in the length then only do looping
              if (this.orgLocationsLength !== this.locations.length) {
                this.locations.forEach((location) => {
                  addresses.forEach((address) => {
                    if (JSON.stringify(address.location) === JSON.stringify(location.location)) {
                      address.multiSelect = true;
                    }
                  });
                });
              }
            }
            this.addresses = addresses;
          },
          error => {
            this.isAddressLoading = false;
            this.addresses = [];
            this.notify.printErrorNotification(error);
          }
        );
      } else {
        this.notify.printErrorNotification('Please enter the valid data');
      }
    }
  }

  onAddressSelect(event) {
    if (event.data) {
      event.data.multiSelect = true;
      let addressCopySelected = {...(event.data)};
      if (this.locations && this.locations.length > 0) {
        this.pushAddressIntoLocation(addressCopySelected);
      } else {
        this.locations = [];
        this.locations.push(this.removeSelectedAttr(addressCopySelected));
      }
    }
  }

  pushAddressIntoLocation(addressCopySelected: any) {
    if (!this.locations.some(location => location.location.city === addressCopySelected.location.city &&
        location.location.houseNumber === addressCopySelected.location.houseNumber &&
        location.location.street === addressCopySelected.location.street &&
        location.location.postCode === addressCopySelected.location.postCode)) {
      let addressData = [];
      addressData.push(addressCopySelected);
      let locationsCopy = [...addressData, ...this.locations];
      locationsCopy = this.productLocationService.sortLocationOnCode([...locationsCopy]);
      this.locations = [...locationsCopy];
      setTimeout(() => this.productLocTable.resetAllFilters());
    }
  }


  fetchCatalog(location: any) {
    let productsUrl = this.productLocationConfig.availableProductsUrl;

    productsUrl = encodeURI(productsUrl +
      this.customerNo +
      '/locations/' + location.houseNumber + '|' + location.street + '|' + location.city + '|' + location.code + '/availableproducts');

    location['isAvlProductsLoading'] = true;
    location['isAvlProductsLoadedEmpty'] = false;
    this.productLocationService.getData(productsUrl).then(data => {
        location['isAvlProductsLoading'] = false;
        location.availableProducts = this.productLocationService.mapJsonAvailableProducts(data);
        if (location.availableProducts.length === 0) {
          location['isAvlProductsLoadedEmpty'] = true;
        }
      },
      error => {
        location['isAvlProductsLoading'] = false;
        location['isAvlProductsLoadedEmpty'] = false;
        this.notify.printErrorNotification(error);
      }
    );
  }

  addCartItems(data: any, toolTip: NgbTooltip) {
    if (data && data.bandwidthSelected && data.bandwidthSelected !== 'choose') {
      let existingCartItem;
      let cartItem = {...this.productLocationService.mapCartItem(data)};
      let detailCartItem = {...this.productLocationConfig.detailCartItem};
      if (this.items && this.items.length > 0) {
        existingCartItem = this.getExistingCartItem([...this.items], {...cartItem});
      }
      if (existingCartItem) {
        if (existingCartItem.detail.length > 0) {
          existingCartItem.productBundle = cartItem.productBundle;
        }
        existingCartItem.detail.push({...detailCartItem});
      } else {
        // since no cart item exist and this it has to be the first cart item
        cartItem.detail.push({...detailCartItem});
        // locations should have propery cartAdded as true
        cartItem.cartAdded = true;
        // locations also need to be update to have the data for
        // backward navigation
        data.cartAdded = true;
        this.items.push({...cartItem});
      }
      this.cartItems++;

      const isOpen = toolTip.isOpen();

      if (!isOpen) {
        toolTip.open();

        setTimeout(() => {
          toolTip.close();
        }, 2000);
      }
    }
  }

  removeSelectedAttr(data: any): any {
    for (let key in data) {
      if (data.hasOwnProperty(key) && (key === 'multiSelect' || key === '_$visited')) {
        delete data[key];
      }
    }
    return data;
  }

  getExistingCartItem(data: Array<any>, requestData: any): any {
    return data.find(cart => JSON.stringify(cart.location) === JSON.stringify(requestData.location) &&
      JSON.stringify(cart.productBundle) === JSON.stringify(requestData.productBundle));
  }

  next() {
    if (this.cartItems > 0) {
      let fnOrderRequestLocationData = {
        locations: [],
        cartItems: 0
      };
      fnOrderRequestLocationData.locations = [...this.locations];
      fnOrderRequestLocationData.cartItems = this.cartItems;
      this.fnOrderRequest.items = [...this.items];

      this.orderService.setFnOrderRequest(this.fnOrderRequest);
      this.orderService.setFnOrderRequestLocationData({...fnOrderRequestLocationData});
      this.orderService.disableTabsFrom(3);
      setTimeout(() => this.tab.select('tab3'));
    } else {
      this.notify.printErrorNotification('Bitte fügen Sie zuerst ein Produkt dem Warenkorb hinzu');
    }
  }

  resetBwSelected(rowData: any) {
    if (rowData) {
      // reset the data for BW
      rowData['bandwidthSelected'] = 'choose';
    }
  }

  getTotalItems() {
    return this.items.reduce((acc, item) => acc + item.detail.length, 0);
  }

  setLocationsData(locationData: any) {
    if (locationData.locations) {
      this.loading = false;
      this.locations = [...locationData.locations];
    }
  }
}
