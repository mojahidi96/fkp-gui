import {NotificationHandlerService} from '../sncr-notification/notification-handler.service';

export class DownloadParams {
  selections?= new Map();
  configId: string;
  savedFileName?: string;
  disable?: boolean;
  notificationHandler: NotificationHandlerService;
  url: string;
  reportKey?: string;
}