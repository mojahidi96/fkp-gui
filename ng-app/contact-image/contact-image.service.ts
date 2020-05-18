import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ContactImageService {

  constructor(private http: HttpClient) {

  }

  updateContactOption(contact): Promise<any> {
    return this.http.post('/buyflow/rest/contact/contactDetails?t=' + new Date().getTime(),
      contact, {headers: {'Content-Type': 'application/json'}})
      .toPromise();
  }
}