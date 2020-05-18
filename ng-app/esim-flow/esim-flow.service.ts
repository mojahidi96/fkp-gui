import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class EsimFlowService {
   constructor(private http: HttpClient) {}

   getStatusList(statusConfig: any): Observable<any> {
     return this.http.get(`/buyflow/rest/esimfallout/statuslist?name=${statusConfig}&t=` + new Date().getTime());
   }

    clearSession(): Observable<any> {
        return this.http.get('/buyflow/rest/esimfallout/clearSession?t=' + new Date().getTime());
    }

   getCancelOptions(config): Observable<any> {
     return this.http.get(`/buyflow/rest/esimfallout/canceloptions?name=${config}&t=` + new Date().getTime());
   }

  persistSelections(lazyParams: {}): Promise<any> {
     return this.http.post('/buyflow/rest/flowselections/sec/preprocess?t='  + new Date().getTime(), lazyParams).toPromise();
   }

   submitFormData(data): Promise<any> {
     return this.http.post('/buyflow/rest/esimfallout/updateorders?t=' +  new Date().getTime(), data).toPromise();
   }
}
