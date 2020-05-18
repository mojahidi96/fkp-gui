import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KIASDetails} from './kias-details';

@Injectable()
export class BulkEditContentService {

  constructor(private http: HttpClient) {

  }

  saveKIASStatusDetails(kiasDetails: KIASDetails): Observable<any> {
    return this.http.post(`/portal/rest/bulkProlong/sec/save?t=${new Date().getTime()}`, kiasDetails);
  }
}