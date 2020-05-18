import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class MockTranslationProvider {

  public getTranslation(language: string, args: any): Observable<any> {
    return of('');
  }

}
