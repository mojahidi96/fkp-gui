import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SncrPlannedChangesService} from '../../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AvailableTariffs} from './tariff';

@Injectable()
export class TariffSelectionService extends SncrPlannedChangesService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    super();
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getAvailableTariffs(tariffListForEnterPrise: boolean, preQuerySelectionType?: string): Observable<any> {
    let requestUrl = tariffListForEnterPrise ? 'ep_available' : 'available';
    return this.http.post(`/buyflow/rest/tariffs/${requestUrl}?t=${new Date().getTime()}`, preQuerySelectionType, {headers: this.headers});
  }

  getEligibleSubscribers(selectedTariffId: string): Observable<AvailableTariffs> {
    return this.http.get<AvailableTariffs>(`/buyflow/rest/tariffs/${selectedTariffId}/eligible?t=${new Date().getTime()}`);
  }

  persistTariff(tariffId: string, effectiveDateType: string): Observable<any> {
    return this.http.post(`/buyflow/rest/tariffs/${tariffId}/${effectiveDateType}/sec/save?t=` + new Date().getTime(),
      {tariffId: tariffId});
  }

  getTariffDetails(tariffId: string): Observable<any> {
    return this.http.get<any>(`/buyflow/rest/tariffs/${tariffId}/details?t=${new Date().getTime()}`);
  }

  getTariffPreQueryEligibility(): Observable<any> {
    return this.http.get<any>(`/buyflow/rest/tariffs/tariffPreQueryEligibility?t=${new Date().getTime()}`);
  }

}
