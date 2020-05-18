import {Injectable} from '@angular/core';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ProductLocationService {

  constructor(private http: HttpClient) {

  }

  getData(url: string): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(url + '?t=' + new Date().getTime(), {headers})
      .toPromise()
      .catch(this.handleError);
  }


  mapJson(data: Array<any>, order: any): Array<any> {
    return data.map((element) => {
      if (element.address) {
        element.code = element.address.postCode.code ? element.address.postCode.code : '';
        element.city = element.address.city ? element.address.city : '';
        element.street = element.address.street ? element.address.street : '';
        element.houseNumber = element.address.houseNumber ? element.address.houseNumber : '';
        element.cname = UtilsService.notNull(element.cname) ? element.cname : order.customerName;
        element.address1 = `${element.street} ${element.houseNumber}`;
        element.address2 = `${element.code} ${element.city}`;
        element.address = `${element.address1} ${element.address2}`;

        element.location = {};
        element['location']['city'] = element.city;
        element['location']['cName'] = UtilsService.notNull(element.cname) ? element.cname : order.customerName;
        element['location']['houseNumber'] = element.houseNumber;
        element['location']['street'] = element.street;
        element['location']['postCode'] = element.code;
      }
      element.availableProducts = [];
      element.productNameSelected = 'choose';
      element.bandwidthSelected = '';
      element.cartAdded = false;
      return element;
    });
  }

  mapJsonAvailableProducts(data: Array<any>): Array<any> {
    return data.map((element) => {
      if (element && element.product) {
        element.productName = element.product.productName;
        element.productType = element.product.productType;
        element.salesProductId = element.product.salesProductId;
        element.productType = element.product.productType;
      }
      return element;
    });
  }


  mapCartItem(data: any): any {
    let cartItemCopy = {
      cartAdded: false,
      productBundle: {
        productType: '',
        productName: '',
        productBandwidth: '',
        salesProductId: '',
        salesProdBandWidth: '',
        salesProdBandWidthId: ''
      },
      location: {
        city: '',
        cName: '',
        houseNumber: '',
        street: '',
        postCode: ''
      },
      detail: []
    };

    cartItemCopy.productBundle.productName = data.productNameSelected ? data.productNameSelected : '';
    let product = this.getProduct(data.availableProducts, cartItemCopy.productBundle.productName);
    if (product && JSON.stringify(product) !== '{}') {
      cartItemCopy.productBundle.productType = product.productType ? product.productType : '';
      cartItemCopy.productBundle.salesProductId = product.salesProductId ? product.salesProductId : '';
    }
    cartItemCopy.productBundle.salesProdBandWidth = data.bandwidthSelected ?
      data.bandwidthSelected : '';
    cartItemCopy.productBundle.salesProdBandWidthId = this.getSalesProdBwId(data.availableProducts,
      cartItemCopy.productBundle.productName,
      cartItemCopy.productBundle.salesProdBandWidth);

    cartItemCopy.location.city = data.city ? data.city : '';
    cartItemCopy.location.cName = data.cname ? data.cname : '';
    cartItemCopy.location.houseNumber = data.houseNumber ? data.houseNumber : '';
    cartItemCopy.location.street = data.street ? data.street : '';
    cartItemCopy.location.postCode = data.code ? data.code : '';

    return cartItemCopy;
  }

  getProduct(data: Array<any>, value: string): any {
    return this.findByProductName(data, value).product;
  }


  getSalesProdBwId(data: Array<any>, value: string, bwSelected: string): string {
    let bandwidths = this.findByProductName(data, value).bandwidths;
    if ((Object.keys(bandwidths)).length > 0) {
      return Object.keys(bandwidths).find(bandwidth => bandwidths[bandwidth] === bwSelected);
    }
  }

  sortLocationOnCode(data: Array<any>): Array<any> {
    return data.sort((a, b) => {
      let a1 = a.code instanceof String ? Number.parseInt(a.code) : a.code;
      let b1 = b.code instanceof String ? Number.parseInt(b.code) : b.code;
      return a1 - b1;
    });

  }

  private findByProductName(data: Array<any>, value: string) {
    return data.find((element) => {
      if (element.productName && value) {
        return element.productName.toString().trim().toLowerCase() === value.trim().toLowerCase();
      }
    });
  }

  private handleError(error: any) {
    let errMsg: string;
    if (error.status === 500) {
      errMsg = 'Die eingegebenen Daten können aktuell nicht überprüft werden; bitte versuchen Sie es später noch einmal.';
    } else {
      errMsg = 'Failed to process';
    }
    return Promise.reject(errMsg);
  }
}
