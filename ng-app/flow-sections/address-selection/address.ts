import {EventEmitter, TemplateRef} from '@angular/core';

export enum SelectionType {
  existing,
  new,
  banLegal
}

export abstract class Address {
  addressId: string;
  name1: string;
  name2: string;
  name3: string;
  name4: string;
  country: string;
  countryCode: string;
  city: string;
  houseNumber: string;
  state: string;
  postalCode: string;
  streetName: string;
  fullName: string;
  fullAddress: string;
  selectionType?: SelectionType = SelectionType.existing;
  poBox: string;
  streetType: string;

  public generateFullName(item): string {

    return ((item.street1) ? item.street1 : '') +
      ((item.street2) ? ' ' + item.street2 : '') +
      ((item.street3) ? ' ' + item.street3 : '') +
      ((item.street4) ? ' ' + item.street4 : '');
  }

  public generateFullAddress(item): string {

    let address = '';
    address += ((!item.poBox) ? '' : item.poBox + ', ');
    address += ((!item.streetName) ? '' : item.streetName + ' ');
    address += ((!item.houseNumber) ? '' : item.houseNumber + ', ');
    address += ((!item.streetType) ? '' : item.streetType + ', ');
    address += ((!item.postalCode) ? '' : item.postalCode + ', ');
    address += ((!item.city) ? '' : item.city + ', ');
    address += ((!item.state) ? '' : item.state + ', ');
    address += ((!item.country) ? '' : item.country);
    return address;
  }

  public getFullAddressPart1(item): string {
    let address = '';
    address += ((!item.poBox) ? '' : item.poBox + ', ');
    address += ((!item.streetName) ? '' : item.streetName + ' ');
    address += ((!item.houseNumber) ? '' : item.houseNumber + ', ');
    address += ((!item.streetType) ? '' : item.streetType + ', ');
    return address;
  }

  public getFullAddressPart2(item): string {
    let address = '';
    address += ((!item.postalCode) ? '' : item.postalCode + ', ');
    address += ((!item.city) ? '' : item.city + ', ');
    address += ((!item.state) ? '' : item.state + ', ');
    address += ((!item.country) ? '' : item.country);
    return address;
  }

  getFullNamePart1(item): string {
    return ((item.street1) ? item.street1 : '') +
      ((item.street2) ? ' ' + item.street2 : '');
  }

  getFullNamePart2(item): string {
    return ((item.street3) ? ' ' + item.street3 : '') +
      ((item.street4) ? ' ' + item.street4 : '');
  }

}

export class Shipment extends Address {
  selectionOption: string;
  selectedDescription: string;
}

export class Debitor extends Address {
  debitorNumber: string;
  debitorType: string;
  debitorId: string;
  isDefault: boolean;
  isAssociated: boolean;
  isVodafoneUser: boolean;
  streetType: string;
  salutation: string;
  hideDebitorDetails: string;
}

export interface AddressDetails {
  defaultAddress?: any;
  selectedAddress?: any;
  addressSelectionType?: string;
  nextSelection?: EventEmitter<any>;
  editOrDeleteTemplateRef?: TemplateRef<any>;
  standardTemplateref?: TemplateRef<any>;
  fullAddressTemplateRef?: TemplateRef<any>;
  fullNameTemplateRef?: TemplateRef<any>;
  techFundTemplateRef?: TemplateRef<any>;
  debitorNumberTemp?: TemplateRef<any>;
}


