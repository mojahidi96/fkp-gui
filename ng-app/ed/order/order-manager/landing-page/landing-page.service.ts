import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export class SavedFilterOptions {
  reportName: string;
  searchOptions: string | any[];
  columnFilterOptions: string | any[];
  columnSortOptions: any;
}

@Injectable()
export class LandingPageService {
  private orderManagerSessionData = {filters: [], advancedSearchfilters: [], cols: [], selectOrderCount: 0, orderIdSet: new Set<string>(),
    statusCountMap: new Map<string, number>(), orderStatusList: []};
  private options: any;

  constructor(private http: HttpClient) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.options = {headers: headers};
  }

  // http API call to get the default set of orders in error
  getOrdersInError(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/ed/rest/orderhistory/searchOrders?t=' + new Date().getTime(), this.getRequestOptions());
  }

  // http API call to get the field options
  getFieldOptions(): Observable<any> {
    return this.http.get<any>(`/ed/rest/om/getfieldoptions?t=${new Date().getTime()}`, this.getRequestOptions());
  }

  // http API call to get the shop List
  getShopList(): Observable<any> {
    return this.http.get('/ed/rest/edshop/edshopnames' + '?t=' + new Date().getTime(), this.options);
  }

  // http API call to get the order statuses
  getOrderStatusList(): Observable<any> {
    return this.http.get<any>(`/ed/rest/om/getstatuslist?t=${new Date().getTime()}`, this.getRequestOptions());
  }

  // http API call to get the all order statuses on selecting all
  getAllOrderStatusList(): Observable<any> {
    return this.http.get<any>(`/ed/rest/om/getcartorderstatuslist?t=${new Date().getTime()}`, this.getRequestOptions());
  }

  persistSelections(lazyParams: {}): Observable<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams, this.getRequestOptions());
  }


  getSelectCount(configId): Observable<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`);
  }

  updateOrders(request: {}): Observable<any> {
    return this.http.post(`/ed/rest/om/sec/updateorders?t=${new Date().getTime()}`, request, this.getRequestOptions());
  }

  getRequestOptions() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache,no-store, must-revalidate',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return {headers};
  }

  checkUserRole(role: string): Observable<any> {
    return this.http.get('/ed/rest/om/userrole/' + role + '?t=' + new Date().getTime());
  }

  updateSessionAdvancedSearchFilters(advancedSearchfilters) {
    this.orderManagerSessionData.advancedSearchfilters = advancedSearchfilters;
  }

  updateSessionFilters(filters) {
    this.orderManagerSessionData.filters = filters;
  }

  updateSessionColumns(cols) {
    this.orderManagerSessionData.cols = cols;
  }

  updateCartStatusDetails(selectOrderCount, orderIdSet, statusCountMap, orderStatusList) {
    this.orderManagerSessionData.selectOrderCount = selectOrderCount;
    this.orderManagerSessionData.orderIdSet = orderIdSet;
    this.orderManagerSessionData.statusCountMap = statusCountMap;
    this.orderManagerSessionData.orderStatusList = orderStatusList;
  }

  getSessionData() {
    return this.orderManagerSessionData;
  }

  clearSessionData() {
    this.orderManagerSessionData = {filters: [], advancedSearchfilters: [], cols: [], selectOrderCount: 0, orderIdSet: new Set<string>(),
      statusCountMap: new Map<string, number>(), orderStatusList: []};
  }

  clearCartStatusDetails() {
    this.orderManagerSessionData.selectOrderCount = 0;
    this.orderManagerSessionData.orderIdSet = new Set<string>();
    this.orderManagerSessionData.statusCountMap = new Map<string, number>();
    this.orderManagerSessionData.orderStatusList = [];
  }

  getSavedFilters(): Promise<any> {
    return this.http.get('/ed/rest/filter/data?t=' + (new Date()).getTime()).toPromise();
  }

  saveFilter(savedFilterOptions: SavedFilterOptions): Promise<any> {
    return this.http.post( '/ed/rest/filter/save?t=' + (new Date()).getTime(), savedFilterOptions,
    this.options)
    .toPromise();
  }

  deleteFilter(savedFilterOptions: SavedFilterOptions): Promise<any> {
    return this.http.post( '/ed/rest/filter/delete?t=' + (new Date()).getTime(), savedFilterOptions,
    this.options)
    .toPromise();
  }


}