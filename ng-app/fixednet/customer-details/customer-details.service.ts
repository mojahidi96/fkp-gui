import {Injectable} from '@angular/core';
import {FixedNetService} from '../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class CustomerDetailsService {

  activeTab: string;
  customerDetails = {
    'shopId': '',
    'customerNo': '',
    'rootCustomerNo': '',
    prodOrdDetails: {'productId': ''}
  };

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {
  }


  getActiveTab(): string {
    return this.activeTab;
  }


  setActiveTab(activeTab: string) {
    this.activeTab = activeTab;
  }


  getShopList(): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/portal/rest/shop/fn/shoplist' + '?t=' + new Date().getTime(), {headers: headers})
      .toPromise()
      .catch(this.fixedNetService.handleError);
  }

  getCustomerDetails(): any {
    return this.customerDetails;
  }

  getUserDetails(): Observable<any> {
    return this.http.get('/portal/rest/components/fixednet/menus?t=' + new Date().getTime());
  }


  setCustomerDetails(data: any) {
    if (data.shopId) {
      this.customerDetails.shopId = data.shopId;
    }
    if (data.rootCustomerNo) {
      this.customerDetails.rootCustomerNo = data.rootCustomerNo;
    }
    if (data.customerNo) {
      this.customerDetails.customerNo = data.customerNo;
    }
    if (data.prodOrdDetails && data.prodOrdDetails.productId) {
      this.customerDetails.prodOrdDetails.productId = data.prodOrdDetails.productId;
    }
  }
}