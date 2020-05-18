import {FnBillingAccount} from './fn-billing-account';

export class FnShop {
  shopName: string;
  fnRootCustomerNumber: string;
  fnCustomerNumber: string;
  customerName: string;
  shopId: string;
  rootCustomerName: string;
  _sncrChecked: boolean;
  status: string;
  lastRefresh: string;
  orderApproval: boolean;
  fullRefresh: boolean;
  billExists: boolean;
  selected: boolean;
  tfa: boolean;
  fnCustomerPanel?: FnCustomerPanel;
  fnBillingAccPanel?: FnBillingAccPanel;
}

export class FnCustomer {
  shopName: string;
  fnRootCustomerNumber: string;
  fnCustomerNumber: string;
  customerName: string;
  shopId: string;
  rootCustomerName: string;
  _sncrChecked: boolean;
  lastRefresh: string;
  orderApproval: boolean;
  fullRefresh: boolean;
  billExists: boolean;
  selected: boolean;
}


export class FnBillingAccPanel {
  autoAssign?: boolean;
  fnBillingAccounts?: Array<FnBillingAccount>;
  autoAssignReadonly?: boolean;
}

export class FnCustomerPanel {
  autoAssign?: boolean;
  fnCustomers?: Array<FnCustomer>;
}