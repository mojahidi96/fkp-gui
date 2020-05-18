import {Address} from '../address-selection/create-edit-address/address';

export class DebitorAddress extends Address {
  debitorNumber: string;
  debitorType?: string;
  debitorId?: string;
  techFundStatus?: any;
  selectionOption?: DEBITOR_SELECTION_OPTION;
}

export enum DEBITOR_SELECTION_OPTION {
   NEW = 'NEW',
   EXIST = 'EXISTING',
   STANDARD = 'STANDARD'
}