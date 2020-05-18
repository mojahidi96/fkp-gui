import {BanSubConfig} from '../../../ban-sub-common/ban-sub.config';

export class Address {
  name1?: string;
  name2?: string;
  name3?: string;
  name4?: string;
  streetName?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string = BanSubConfig.defaultCountry;
  countryCode?: string = BanSubConfig.countryOptions[0].value;
  debitorType?: any;
  street1?: string;
  street2?: string;
  street3?: string;
  street4?: string;
  poBox?: string;
  state?: string;
  streetType?: string;
  addressType?: string;
  billingAddress = false;
  shippingAddress = false;
}