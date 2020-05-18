import {NotificationHandlerFactory} from './notification-handler.factory';

import {NotificationHandlerService} from './notification-handler.service';

jest.mock('./notification-handler.service');

NotificationHandlerService['mockImplementation'](() => ({}));

test('Different instance on every call', () => {
  const instance1 = NotificationHandlerFactory()(),
    instance2 = NotificationHandlerFactory()();

  expect(instance1).toEqual(instance2); // Shallow comparison
  expect(instance1).not.toBe(instance2); // Reference comparison
});