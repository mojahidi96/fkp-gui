export interface StatusRequest {
  request?: any;
}


export class OrderStatusChange {
  static readonly type = '[StatusChange] statusChange';

  constructor(public statusRequest: StatusRequest) {

  }
}

export class DownloadHistory {
  static readonly type = '[DownloadHistory] downloadHistory';
  constructor() {

  }
}

export class DownloadUOF {
  static readonly type = '[DownloadUOF] downloadUOF';
  constructor() {

  }
}


