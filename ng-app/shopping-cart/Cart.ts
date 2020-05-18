export class Cart {
  shoppingCartId: string;
  shoppingCartName: string;
  dateTimeStamp?: string;
  customerOrderNumber?: string;
  clientOrderId?: string;
  voNumber?: string;
  valid: boolean;
  locked?: boolean;
  errors?: any[];
  shoppingCartType: string;
  configId: string;
}