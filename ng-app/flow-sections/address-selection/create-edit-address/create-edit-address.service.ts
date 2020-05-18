import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CreateEditAddressService {

  private headers: any;

  constructor(private http: HttpClient) {
    this.headers = {'Content-Type': 'application/json'}; // ... Set content type to JSON
  }

  isDebitorNumberValid(debitorNumber: string, url: string ): Observable<any> {
    return this.http.get(url + `${debitorNumber}/exist?t=${new Date().getTime()}`);
  }
}
