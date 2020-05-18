import {Injectable} from '@angular/core';
import {SavedReportOptions} from './model/savedreportoptions';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DataReportService {

  private urlPrefix = '/buyflow/rest/fkpdatareport/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getReport(): Promise<any> {
    return Promise.all([this.getData()]);
  }

  banCount(shopId: any, contractNo: any) {
    return this.http.get('/rest/shopsubset/associatedbancountforshop/' + shopId + '/' + contractNo + '?t=' + (new Date()).getTime(),
      {headers: this.headers})
      .toPromise();
  }

  setSelectedShopToSession(shopDto) {
    return this.http.post('/buyflow/rest/fkpdatareport/filteroptions/setshopid?t=' + (new Date()).getTime(), shopDto,
      {headers: this.headers})
      .toPromise();
  }

  private getCols(type: string): Promise<any> {
    return this.http.post(this.getColsUrl(type) + '?t=' + (new Date()).getTime(),
      {headers: this.headers})
      .toPromise();
  }

  private getData(): Promise<any> {
    return this.http.post('/buyflow/rest/fkpdatareport/filteroptions/data?t=' + (new Date()).getTime(),
      {headers: this.headers})
      .toPromise();
  }

  persistSavedReport(savedReportOptions: SavedReportOptions): Promise<any> {
    return this.http.post(this.getFilterOptionsUrl() + '/save?t=' + (new Date()).getTime(), savedReportOptions,
      {headers: this.headers})
      .toPromise();
  }

  deleteSavedSearch(savedReportOptions: SavedReportOptions): Promise<any> {
    return this.http.post(this.getFilterOptionsUrl() + '/delete?t=' + (new Date()).getTime(), savedReportOptions,
      {headers: this.headers})
      .toPromise();
  }

  private getColsUrl(type: string): string {
    return `${this.urlPrefix}${type}/dynamiccolumns`;
  }

  private getDataUrl(type: string): string {
    return `${this.urlPrefix}${type}/data`;
  }

  private getFilterOptionsUrl(): string {
    return `${this.urlPrefix}filteroptions`;
  }
}