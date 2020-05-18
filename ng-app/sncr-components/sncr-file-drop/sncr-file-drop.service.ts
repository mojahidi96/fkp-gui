import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SncrFileDropService {
  constructor(private http: HttpClient) {  }

  uploadSubscriber(obj: any, url?: string): Promise<any> {
    return this.http.post(url + `?t=` + new Date().getTime(), obj)
      .toPromise();
  }
}