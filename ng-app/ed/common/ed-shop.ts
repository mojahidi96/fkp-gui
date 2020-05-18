export class EdShop {
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
  emailOrderApproval: boolean;
  fnCustomerPanel?: EdCustomerPanel;
  fnBillingAccPanel?: EdBillingAccPanel;
}
export class EdCustomer {
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

export class EdBillingAccPanel {
  autoAssign?: boolean;
  fnBillingAccounts?: Array<EdBillingAccount>;
  autoAssignReadonly?: boolean;
}

export class EdCustomerPanel {
  autoAssign?: boolean;
  fnCustomers?: Array<EdCustomer>;
}

export class EdBillingAccount {
  shopId: string;
  accountNo: string;
  accountName: string;
  accountAddress: string;
  _sncrChecked: boolean;
  customerNo: string;
}

export class EdProduct {
  shopId: string;
  productCommitmentNo: string;
  _sncrChecked: boolean;
  customerNo: string;
}
