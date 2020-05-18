import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {PlannedChange} from '../../sncr-components/sncr-planned-changes/planned-change';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';

export interface CardSelectionFlow {
  flow?: SncrFlowSectionComponent;
  selectedMap?: Map<string, string>;
  selectedSocs?: PlannedChange[];
  alert?: NotificationHandlerService;
  orderNumber?: string;
  orderType?: string;
}

export class ContinueFromSubscriberPanel {
  static readonly type = '[VvlFlowSubscribers] ContinueFromSubscriberPanel';

  constructor(public cardSelectionFlow: CardSelectionFlow) {

  }
}

export class ProcessOrderSubmit {
  static readonly type = '[VvlFlowSubscribers] ProcessOrderSubmit';

  constructor() {

  }
}

export class GetEligibleSubscribersForTariff {

  static readonly type = '[VvlFlowSubscribers] GetEligibleSubscribersForTariff';

  constructor() {

  }
}

export class DownloadPdf {

  static readonly type = '[VvlFlowSubscribers] DownloadPdf';

  constructor(public model: CardSelectionFlow) {

  }
}

export class SetDebitorDetails {

  static readonly type = '[VvlFlowSubscribers] SetDebitorDetails';

  constructor(public debitorDetails: any) {

  }
}

export class SetShipmentDetails {

  static readonly type = '[VvlFlowSubscribers] SetShipmentDetails';

  constructor(public shipmentDetails: any) {

  }
}


export class SetSelectedTariff {

  static readonly type = '[VvlFlowSubscribers] SetSelectedTariff';

  constructor(public selectedTariff: any) {

  }
}

export class ResetRadio {
  static readonly type = '[VvlFlowSubscribers] ResetRadio';

  constructor() {
  }
}

export class ResetOrderSubmit {
  static readonly type = '[VvlFlowSubscribers] ResetOrderSubmit';

  constructor() {
  }
}
