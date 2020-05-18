import {NotificationHandlerService} from './notification-handler.service';

export const NotificationHandlerFactory = () => {
  return () => new NotificationHandlerService();
};