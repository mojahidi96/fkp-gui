import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class MockAppService {

  translationsLoading = new EventEmitter<boolean>();
}
