import {TemplateRef} from '@angular/core';
import {Cart} from '../shopping-cart/Cart';

export enum OrderType {
  MA_CHANGE_BILLING_PARAM = 0,
  MA_MAINTAIN_SOC = 1,
  MA_CHANGE_SUB_NAME_ADD = 2,
  MA_SUBSCRIBER_PW = 3,
  MA_CHANGE_BAN_NAME_ADD = 4,
  MA_BANK_INFO = 5,
  PROLONG_SUBSCRIBER = 6,
  MA_CHANGE_TARIFF = 7,
  ACTIVATE_SUBSCRIBER = 8
}

export class OrderConfirmDetails {
  orderType: any;
  orderNumber: number;
  count: number;
  thankNote = 'Vielen Dank für Ihre Bestellung.';
  orderNote = 'Ihre Bestellnummer lautet';
  description: any;
  mutlipleOrders: any[];
  multipleOrdersTemplate?: TemplateRef<any>;
  hidePrintIcon? = false;
}

export class OrderDetails {
  type: string;
  ban: string;
  shipping: string;
  customerNumber: string;
  internalNumber: string;
  voId: string;
  custIntNote: string;
  clientOrderId: string;
  orderType: string;
  orderNumber: string;
  upload?: boolean;
  cart?: Cart;
}