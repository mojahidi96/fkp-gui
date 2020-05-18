export class AddressConstants {

  public static salutationOptions = [
    {text: 'ADDRESS-SALUTATIONS_NO_SALUTATION', description: 'no salutation', value: 'Keine Anrede'},
    {text: 'ADDRESS-SALUTATIONS_COMPANY', description: 'company', value: 'Firma'}
  ];

  public static addressFormatOptions = [
    {text: 'ADDRESS-STREET_FORMAT', description: 'Regular address', value: 'Straße, Hausnummer'},
    {text: 'ADDRESS-POST_BOX_FORMAT', description: 'P.O Box', value: 'Postfach'}
  ];

  public static columns = {
    debitorColumns: [
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_CUSTOMER_NUMBER', field: 'debitorNumber', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_FULL_NAME', field: 'fullName', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_ADDRESS', field: 'fullAddress', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_TYPE', field: 'debitorType', show: true, sortable: true, filter: false, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_DEFAULT', field: 'standard', show: true, sortable: false, filter: false, type: 'text'},
      {title: '', field: 'editOrDelete', show: true, sortable: false, filter: false, type: 'text'}
    ],
    shipmentColumns: [
      {title: 'SHIPMENT_SELECTION-COLUMN_NAME_FULL_NAME', field: 'fullName', show: true, sortable: true, type: 'text'},
      {title: 'SHIPMENT_SELECTION-COLUMN_NAME_ADDRESS', field: 'fullAddress', show: true, sortable: true, type: 'text'},
      {title: 'SHIPMENT_SELECTION-COLUMN_NAME_DEFAULT', field: 'standard', show: true, sortable: false, filter: false, type: 'text'},
      {title: '', field: 'editOrDelete', show: true, sortable: false, filter: false, type: 'text'}
    ],
    sammelColumns: [
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_FULL_NAME', field: 'fullName', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_ADDRESS', field: 'fullAddress', show: true, sortable: true, type: 'text'},
      {title: '', field: 'editOrDelete', show: true, sortable: false, filter: false, type: 'text'}
    ],
    omDebitorColumns: [
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_CUSTOMER_NUMBER', field: 'debitorNumber', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_FULL_NAME', field: 'fullName', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_ADDRESS', field: 'fullAddress', show: true, sortable: true, type: 'text'},
      {title: 'DEBITOR_SELECTION-COLUMN_NAME_TYPE', field: 'debitorType', show: true, sortable: true, filter: false, type: 'text'},
    ],
  };

  public static shipmentKeyType  = {
    'L': 'SHIPMENT_SELECTION-INFO_OPTION_DESC_L',
    'B': 'SHIPMENT_SELECTION-INFO_OPTION_DESC_B',
    'D': 'SHIPMENT_SELECTION-INFO_OPTION_DESC_D'
  };
}

export enum AddressActions {
  SELECT = 'select',
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  CANCEL = 'cancel'
}

export enum ShipmentActions {
  SAVED = 'T',
  BAN_LEGAL = 'L',
  BAN_BILLING = 'B',
  DEBITOR = 'D'
}
