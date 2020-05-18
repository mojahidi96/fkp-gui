import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class UploadChangesService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {

  }

  uploadChanges(obj: any, configId: string, url: string): Promise<any> {
    return this.http.post(url ? url : `/buyflow/rest/fileimport/excelchanges/${configId}?t=` + new Date().getTime(), obj)
      .toPromise();
  }

  getSelectCount(configId): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  persistUploadChanges(configId): Promise<any> {
    let lazyParams = {};
    lazyParams['configId'] = configId;
    return this.http.post(`/buyflow/rest/fileimport/persistexcelupload?t=${new Date().getTime()}`, lazyParams)
      .toPromise();
  }

  clearPreviousUpload(configId): Promise<any> {
    return this.http.delete(`/buyflow/rest/fileimport/clearupload/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  getUploadsCount(configId): Promise<any> {
    return this.http.get(`/buyflow/rest/fileimport/uploadcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  clearUploadContent(configId): Promise<any> {
    return this.http.delete(`/buyflow/rest/flowselections/clearUploadContent/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  persistFileUpload(url): Observable<any> {
    return this.http.get(`${url}?t=${new Date().getTime()}`, {headers: this.headers});
  }
}
