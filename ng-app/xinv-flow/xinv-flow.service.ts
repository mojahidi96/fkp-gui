import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class XinvFlowService {
  constructor(private http: HttpClient) {}
}
