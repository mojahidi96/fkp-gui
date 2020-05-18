import {NotificationHandlerService} from './notification-handler.service';
import {Notification} from './notification';
import {Subscription} from 'rxjs';

let service: NotificationHandlerService;
let subscriptions: Subscription[] = [];

const notificationMock = {type: 'success', message: 'msg', parameter: {p1: '1', p2: '2'}};

beforeAll(() => service = new NotificationHandlerService());

afterAll(() => subscriptions.forEach(s => s.unsubscribe()));

test('Emit success message', done => {
  subscriptions.push(
    service.notifications$.subscribe((notification: Notification) => {
      expect(notification).toEqual(notificationMock);
      done();
    })
  );

  service.printSuccessNotification('msg', notificationMock.parameter);
});

test('Emit warning message', done => {
  subscriptions.push(
    service.notifications$.subscribe((notification: Notification) => {
      expect(notification).toEqual({...notificationMock, type: 'warning'});
      done();
    })
  );

  service.printWarningNotification('msg', notificationMock.parameter);
});

test('Emit error message', done => {
  subscriptions.push(
    service.notifications$.subscribe((notification: Notification) => {
      expect(notification).toEqual({...notificationMock, type: 'error'});
      done();
    })
  );

  service.printErrorNotification('msg', notificationMock.parameter);
});

test('Emit clear message', done => {
  subscriptions.push(
    service.notifications$.subscribe((notification: Notification) => {
      expect(notification).toEqual({type: undefined, message: undefined, parameter: undefined});
      done();
    })
  );

  service.clearNotification();
});