import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FooterService {

  constructor(private http: HttpClient) {
  }

  getFooter(): Promise<any> {
    return this.http.get('/portal/rest/components/footers?t=' + new Date().getTime())
      .toPromise();
  }
}
