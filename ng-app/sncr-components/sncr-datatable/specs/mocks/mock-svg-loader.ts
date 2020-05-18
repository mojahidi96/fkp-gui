import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class MockSvgLoader {

  getSvg(url: string): Observable<string> {
    return of('');
  }
}
