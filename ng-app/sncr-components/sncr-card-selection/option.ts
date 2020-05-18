import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TemplateRef} from '@angular/core';

export class Option {
  text: string;
  description?: string | TemplateRef<any>;
  value: any;
  defaultSection: any;
  length?: number;
  subsCountForLazy?: number;
  model?: any;
  cssClass?: string;
  charge?: OptionCharge;
  urlLink?: string;
  pdfLink?: string;
  alert: {
    message: string;
    type: string;
  };
  disabled = false;
  mandatory = false;
  masterSocs: any;
  masterList?: any;
  isMasterSelected: any;
  trigger: Option;
  originalSoc?: Option;
  canOnly: string;
  duration: number;
  isTrigger?: boolean;
  wifi: boolean;
  show: boolean;
  excluded: number;
  subsidizedHWSoc: boolean;
  infoDesc?: string;
  selected?: boolean;
  bookedSoc?: boolean;
  subsCount?: any;
}

export class OptionCharge {
  amount?: number;
  billingCycle: 'next' | 'today' | 'custom';
  billingCycles: any[];
  date: NgbDateStruct;
  selected: string;
  type: string;
}