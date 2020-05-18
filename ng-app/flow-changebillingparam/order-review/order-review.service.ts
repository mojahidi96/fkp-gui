import {Injectable} from '@angular/core';
import {CONSTANTS} from '../constants';
import {SubscriberReqType, SubsDetails} from './processSubscribers';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class OrderReviewService {

  constants = new CONSTANTS;
  subscribers = [];
  itemizedSubs = [];
  itemized: string;
  targetNumber: string;
  subscriberActionList: Array<SubsDetails>;
  orderProcessReq: SubscriberReqType;

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.constants = new CONSTANTS;
    this.subscriberActionList = [];
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getCountForExtendedCallDetail(): Observable<any> {
    return this.http.get('/buyflow/rest/flowselections/changebillparam/calldetailcount/extended?t=' + new Date().getTime(),
      {headers: this.headers});
  }
}