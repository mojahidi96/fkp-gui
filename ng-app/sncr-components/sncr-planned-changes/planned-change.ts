import {OptionCharge} from '../sncr-card-selection/option';
import {EventEmitter} from '@angular/core';

export class PlannedChange {
  groupName: string;
  socs: SocChange[];
}

export class SocChange {
  name: string;
  value: string;
  quantity: number;
  isAddition: boolean;
  price?: number;
  frequency?: string;
  mandatory?: boolean;
  showPrice?: boolean;
  charge?: OptionCharge;
  isExist?: boolean;
  wifi?: boolean;
}

export interface PlannedChangesService {
  plannedChangesEvent: EventEmitter<PlannedChange[]>;
  socRemoveEvent: EventEmitter<string>;
  manualPositionRefreshEvent: EventEmitter<any>;

  plannedChangeEmit(plannedChange: PlannedChange);

  clear();

  getPlannedChanges();
}