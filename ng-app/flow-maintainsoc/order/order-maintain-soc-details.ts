import {Cart} from '../../shopping-cart/Cart';

export class OrderMaintainSocDetails {

  subscirber: string;
  effectiveDate: string;
  price: number;
  nextSoc: string;
  nextSocName: string;
  actvMode: string;
  soc: string;
  oldSocName: string;
  estimatedDateMessage: string;
  socAndSocFamilySelection: ShopSocAndSocFamilySelection;
  socAndSocFamilySelectionForRemoved: ShopSocAndSocFamilySelection;
}

export class ShopSocAndSocFamilySelection {

  id: string;
  defaultSocId: string;
  description: string;
  displayOrder: string;
  familyId: string;
  familyName: string;
  familyType: string;
  isAdaptable: string;
  isDisplayable: string;
  overridePrice: string;
  productType: string;
  shopId: string;
  skeletonContractNo: string;
  socDuration: string;
  socFamilyId: string;
  socId: string;
  socName: string;
  stdPrice: string;
  subscriberNo: string;

}

export class ReviewMaintainSoc {
  ban: string;
  subscriber: string;
  oldTariff: string;
  familyName: string;
  newTariff: string;
  quantity: number;
  effectiveDate: string;
  oneTimeCharge: string;
  monthlyCharge: string;
  activationType: string;
  doNotShow: boolean;
  selectedMasterDetails: any;
}

export class MaintainSoc {
  type: string;
  voId: string;
  clientOrderId: string;
  customerNumber: string;
  custIntNote: string;
  orderType: string;
  socs: OrderSoc[];
  subscribers: string[];
  cart?: Cart;
}

export class OrderSoc {
  socId: string;
  socName: string;
  quantity: number;
  action: string;
  familyName: string;
  duration: number;
  charge: OrderCharge;
  trigger: OrderSoc;
  masterSoc: string;
}

export class OrderCharge {
  type: string;
  amount: string;
  activationType: string;
  activationDate: string;
}