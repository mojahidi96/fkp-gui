export class FnOrderDetails {
  barCodeId: string;
  postalCode: string;
  city: string;
  productBundleType: string;
  street: string;
  salesPacketName: string;
  mainAccessNumber: string;
  orderStatus: string;
  customerNo: string;
  contactName: string;
  email: string;
  fax: string;
  houseNumber: string;
  mobile: string;
  name: string;
  nodeId: string;
  phone: string;
  transactionId: string;
  orderNumber: string;
  orderType: string;
  isApproverFlow: boolean;
  cartDetails: CartOrderDetail;
}

export class CartOrderDetail {
  location: {
    houseNumber: string;
    street: string;
    city: string;
    postCode: string;
  };
  orderNumber: string;
  customerNumber: string;
  product: {
    productDescription: string;
    productName: string;
    salesProdBandWidth: string;
  };
}