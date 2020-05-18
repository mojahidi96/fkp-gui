import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class AvailableSocs {
  ban: string;
  orderType: string;
  categories: Category[];
  groups: Group[];
  tariffLength: number;
  bookedCategory: string;
  wifiUrl: string;
  durationOverride: boolean;
  serverTimeCrossed: boolean;
  removeError: number;
}

export class Category {
  name: string;
  description: string;
  socs: SocCategory[];
}

export class SocCategory {
  name: string;
}

export class Group {
  name: string;
  description: string;
  show: boolean;
  displayOrderBy: number;
  icon: string;
  families: SocFamily[];
}

export class Soc {
  adaptable: boolean;
  value: string;
  text: string;
  description: string;
  urlLink: string;
  pdfLink: string;
  tariffLength: number;
  charge: Charge;
  trigger: Soc;
  masterList: MasterSoc[];
  masterSocs: Soc[];
  length: number;
  infoDesc: string;
  familyName: string;
  categoryName: string;
  defaultSection: any;
  mandatory: boolean;
  canOnly: string;
  disabled: boolean;
  show: boolean;
  duration: number;
  wifi: boolean;
  excluded: number;
  subsidizedHWSoc: boolean;
  isMasterSelected: any;
  subsCount: number;
}

export class SocFamily {
  name: string;
  tariffLength: number;
  mandatory: boolean;
  isSelected: any;
  adaptable: boolean;
  show: boolean;
  previousShow: boolean;
  socs: Soc[];
}

export class Charge {
  type: string;
  amount: string;
  selected: string;
  date: NgbDateStruct;
}

export class MasterSoc {
  category: string;
  group: string;
  value: string;
}

export class SubscriberInfo {
  subscriberNo: string;
  ultraCard: number;
}

export class SubscriberSoc {
  subscriberNo: string;
  socs: AssociatedSoc [];
}

export class AssociatedSoc {
  soc: Soc;
  familyName: string;
}


