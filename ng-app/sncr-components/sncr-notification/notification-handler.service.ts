import {Notification} from './notification';
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NotificationHandlerService {

  notifications$ = new EventEmitter<Notification>();

  printBasicNotification(message: string, parameter?: {}) {
    this.emitNotification('basic', message, parameter);
  }

  printSuccessNotification(message: string, parameter?: {}) {
    this.emitNotification('success', message, parameter);
  }

  printWarningNotification(message: string, parameter?: {}) {
    this.emitNotification('warning', message, parameter);
  }

  printErrorNotification(error: any, parameter?: {}) {
    if (typeof error === 'string') {
      this.emitNotification('error', error, parameter);
    } else {
      this.emitNotification('error', '' , parameter, error);
    }
  }

  clearNotification() {
    this.emitNotification();
  }

  private emitNotification(type?: string, message?: any, parameter?: any, errors?: any[]) {
    this.notifications$.emit({type, message, parameter, errors});
  }
}