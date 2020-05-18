export class BanSubConfig {

  public static FL_TYPE_BAN = '1';
  public static FL_TYPE_SUB = '2';
  public static FL_TYPE_ACT_SUB = '3';
  public static readonly_for_singleEdit = {'2': ['1', '2'], '1': ['1', '7', '71'], '3': ['1', '2']};
  public static IBAN = '12';
  public static BIC = '13';
  public static SIM_SERIAL_NOS = ['7', '29', '30'];

  public static SIM_OPTION_TYPES = {
    ACT_TYPE: 'Activation',
    UC_TYPE: 'Ultracard'
  };

  public static nameFormatOptions = [
    {text: 'MANAGE_DETAILS-NAME_FORMAT-PERSON', description: 'personal', value: 'Person'},
    {text: 'MANAGE_DETAILS-NAME_FORMAT-COMPANY', description: 'buisiness', value: 'Firma'}
  ];

  public static salutationOptions = [
    {text: 'MANAGE_DETAILS-SALUTATIONS-NO_SALUTATION', description: 'no salutation', value: 'Keine Anrede'},
    {text: 'MANAGE_DETAILS-SALUTATIONS-COMPANY', description: 'company', value: 'Firma'},
    {text: 'MANAGE_DETAILS-SALUTATIONS-MRS', description: 'mrs', value: 'Frau'},
    {text: 'MANAGE_DETAILS-SALUTATIONS-MR', description: 'sir', value: 'Herr'},
  ];

  public static titleOptions = [
    {text: 'MANAGE_DETAILS-PERSON_TITLES-DR', description: 'Dr.', value: 'Dr.'},
    {text: 'MANAGE_DETAILS-PERSON_TITLES-PROF', description: 'Prof', value: 'Prof.'}
  ];

  public static addressFormatOptions = [
    {text: 'MANAGE_DETAILS-ADDRESS-STATE', description: 'Regular address', value: 'Straße, Hausnummer'},
    {text: 'MANAGE_DETAILS-ADDRESS-POBOX', description: 'P.O Box', value: 'Postfach'}
  ];

  public static countryOptions = [
    {text: 'Deutschland', description: 'germany', value: 'D'}
  ];

  public static payFieldsErrorObj = {
    '12': {invalidIban: true},
    '13': {invalidBic: true}
  };

  public static duplicateSerialNoErrorsObj = {
    '7' : {duplicateSerialNo: true},
    '29' : {duplicateSerialNo: true},
    '30' : {duplicateSerialNo: true}
  };

  public static business = 'Firma';
  public static personal = 'Person';
  public static defaultCountry = 'Deutschland';
  public static defaultSalutation = 'keine Anrede';
  public static PoBox = 'Postfach';
  public static Regular = 'Straße, Hausnummer';
  public static DIRECT = 'Bankeinzug';
  public static CASH = 'Rechnung';

  public static fieldControlNames = {
    '1': {
      nameFormat: '70',
      salutation: '62',
      title: '64',
      firstName: '66',
      name1: '26',
      name2: '27',
      name3: '28',
      addressFormat: '68',
      street: '29',
      houseNo: '30',
      postalCode: '33',
      city: '32',
      poBox: 'billPoBox',
      country: '60',
      nameContact: '34',
      fax: '35',
      phone: '36',
      email: '37',
      paymentMethod: '7',
      iban: '12',
      bic: '13',
      bankCode: '8',
      bankAccountNo: '10',
      bankAccOwnership: '11',
      password: 'pwd',
      internalCustId: 'internalCustId',
      ban: '1',
      subsNo: 'subsNo',
      legalNameAddress: '71'
    },
    '2': {
      nameFormat: '47',
      salutation: '43',
      title: '44',
      firstName: '45',
      name1: '9',
      name2: '10',
      name3: '11',
      addressFormat: '46',
      street: '12',
      houseNo: '13',
      postalCode: '17',
      city: '16',
      poBox: '14',
      country: '42',
      nameContact: '18',
      fax: '19',
      phone: '20',
      email: '48',
      password: '53',
      passwordResetInd: '54',
      smsInd: '55',
      internalCustId: '28',
      // paymentMethod: 'paymentMethod',
      bkAccOwnership: 'bkAccOwnership',
      iban: 'iban',
      bic: 'bic',
      ban: '1',
      subsNo: '2'
    },
    '3': {
      nameFormat: '47',
      salutation: '43',
      title: '44',
      firstName: '45',
      name1: '9',
      name2: '10',
      name3: '11',
      addressFormat: '46',
      street: '12',
      houseNo: '13',
      postalCode: '17',
      city: '16',
      poBox: '14',
      country: '42',
      nameContact: '18',
      fax: '19',
      phone: '20',
      email: '48',
      password: '53',
      passwordResetInd: '54',
      smsInd: '55',
      internalCustId: '28',
      ban: '1',
      subsNo: '2',
      ultracardSimType1: '32',
      ultracardSimType2: '34',
      ultracardSimSerialNo1: '29',
      ultracardSimSerialNo2: '30',
      simType: '8',
      simSerialNo: '7',
      dep: '61',
      msisdn: '99'
    }
  };
  public static fieldWidth = {
    '1': {
      11: '244px',
      12: '212px',
      13: '117px',
      26: '230px',
      27: '230px',
      28: '230px',
      29: '230px',
      30: '83px',
      32: '230px',
      33: '83px',
      34: '300px',
      35: '130px',
      36: '130px',
      37: '230px',
      60: '167px',
      62: '146px',
      64: '146px',
      66: '230px',
      70: '146px'
    },
    '2': {
      9: '230px',
      10: '230px',
      11: '230px',
      12: '230px',
      13: '83px',
      14: '83px',
      16: '230px',
      17: '83px',
      18: '300px',
      19: '130px',
      20: '130px',
      28: '137px',
      42: '167px',
      43: '146px',
      44: '146px',
      45: '230px',
      46: '230px',
      47: '146px',
      48: '230px',
      53: '160px'
    },
    '3': {
      7: '200px',
      8: '146px',
      9: '230px',
      10: '230px',
      11: '230px',
      12: '230px',
      13: '83px',
      14: '83px',
      16: '230px',
      17: '83px',
      18: '300px',
      19: '130px',
      20: '130px',
      28: '137px',
      29: '200px',
      30: '200px',
      32: '170px',
      34: '170px',
      42: '167px',
      43: '146px',
      44: '146px',
      45: '230px',
      46: '230px',
      47: '146px',
      48: '230px',
      53: '160px',
      60: '83px',
      99: '150px'
    }
  };

  // used for Bulk edit
  public static translations = {
    '1': {
      ban: 'HEADER_BAN_CUSTOMER_NUMBER',
      nameFormat: 'HEADER_BAN_NAME_FORMAT',
      salutation: 'HEADER_BAN_SALUTATION',
      title: 'HEADER_BAN_TITLE',
      firstName: 'HEADER_BAN_FIRST_NAME',
      name1: 'HEADER_BAN_NAME1',
      name2: 'HEADER_BAN_NAME2',
      name3: 'HEADER_BAN_NAME3',
      addressFormat: 'HEADER_BAN_ADDRESS_TYPE',
      street: 'HEADER_BAN_STREET',
      houseNo: 'HEADER_BAN_HOUSE_NO',
      postalCode: 'HEADER_BAN_POSTCODE',
      city: 'HEADER_BAN_CITY',
      country: 'HEADER_BAN_LAND',
      nameContact: 'HEADER_BAN_CONTACT_PERSON',
      fax: 'HEADER_BAN_FAX_NUMBER',
      phone: 'HEADER_BAN_TELEPHONE_NO',
      email: 'HEADER_BAN_EMAIL_ADDRS',
      paymentType: 'HEADER_BAN_PAYMENT',
      bankCode: 'HEADER_BAN_BANK_CODE',
      bankAccNo: 'HEADER_BAN_ACCOUNT_NO',
      accountHolder: 'HEADER_BAN_ACCOUNT_OWNER',
      legalNameAddress: 'HEADER_BAN_COMPANY_ADDRS',
      iban: 'HEADER_BAN_GOING',
      bic: 'HEADER_BAN_BIC',
      headers: {
        mainHeader: 'HEADER_BAN_INFORMATTION',
        singleSelHeader: 'HEADER_BAN_MANAGE_NO',
        basicInfo: 'HEADER_BAN_BILLING_DETAILS',
        addressInfo: 'HEADER_BAN_ADDRESS',
        contactInfo: 'HEADER_BAN_CONTACT',
        paymentInfo: 'HEADER_BAN_PAYMENT_INFO'
      }
    },
    '2': {
      nameFormat: 'HEADER_NAME_FORMAT',
      salutation: 'MANAGE_DETAILS-SALUTATION',
      title: 'HEADER_NAME_TITLE',
      firstName: 'HEADER_FIRST_NAME',
      name1: 'HEADER_LAST_NAME_1',
      name2: 'HEADER_LAST_NAME_2',
      name3: 'HEADER_LAST_NAME_3',
      addressFormat: 'HEADER_ADDRESS_TYPE',
      street: 'HEADER_STREET',
      houseNo: 'HEADER_HOUSE_NO',
      postalCode: 'HEADER_ZIP',
      city: 'HEADER_CITY',
      poBox: 'HEADER_PO_BOX',
      country: 'HEADER_COUNTRY_NAME',
      nameContact: 'HEADER_DISTRICT',
      fax: 'HEADER_FAX_NO',
      phone: 'HEADER_PHONE',
      email: 'HEADER_CONTACT_EMAIL',
      internalCustId: 'HEADER_IDENTIFIER_FOR_CUST',
      password: 'HEADER_PASSWORD',
      ban: 'HEADER_BAN',
      subsNo: 'HEADER_SUBSCRIBER_NO',
      headers: {
        mainHeader: 'HEADER_MAIN_HEADER',
        singleSelHeader: 'HEADER_SINGLE_SELECT_HEADER',
        basicInfo: 'HEADER_BASIC_INFO',
        addressInfo: 'HEADER_SUBS_NAME_ADDRESS',
        contactInfo: 'HEADER_CONTACT',
        paymentInfo: 'HEADER_PAYMENT_INFO',
        password: 'HEADER_PASSWORD'
      },
      passwordResetInd: 'HEADER_PASSWORD_RESET_IND',
      smsInd: 'HEADER_SMS_IND'
    },
    '3': {
      nameFormat: 'HEADER_NAME_FORMAT',
      salutation: 'MANAGE_DETAILS-SALUTATION',
      title: 'HEADER_NAME_TITLE',
      msisdn: 'HEADER_MSISDN',
      firstName: 'HEADER_FIRST_NAME',
      name1: 'HEADER_LAST_NAME_1',
      name2: 'HEADER_LAST_NAME_2',
      name3: 'HEADER_LAST_NAME_3',
      addressFormat: 'HEADER_ADDRESS_TYPE',
      street: 'HEADER_STREET',
      houseNo: 'HEADER_HOUSE_NO',
      postalCode: 'HEADER_ZIP',
      city: 'HEADER_CITY',
      poBox: 'HEADER_PO_BOX',
      country: 'HEADER_COUNTRY_NAME',
      nameContact: 'HEADER_DISTRICT',
      fax: 'HEADER_FAX_NO',
      phone: 'HEADER_PHONE',
      email: 'HEADER_CONTACT_EMAIL',
      internalCustId: 'HEADER_IDENTIFIER_FOR_CUST',
      password: 'HEADER_PASSWORD',
      ban: 'HEADER_BAN',
      subsNo: 'HEADER_SUBSCRIBER_NO',
      headers: {
        mainHeader: 'HEADER_MAIN_HEADER',
        singleSelHeader: 'HEADER_SINGLE_SELECT_HEADER',
        basicInfo: 'HEADER_BASIC_INFO',
        addressInfo: 'HEADER_SUBS_NAME_ADDRESS',
        contactInfo: 'HEADER_CONTACT',
        paymentInfo: 'HEADER_PAYMENT_INFO',
        password: 'HEADER_PASSWORD'
      },
      passwordResetInd: 'HEADER_PASSWORD_RESET_IND',
      smsInd: 'HEADER_SMS_IND',
      simSerialNo: 'HEADER_SIM_SERIAL_NO',
      simType: 'HEADER_SIM_TYPE',
      ultracardSimType1: 'HEADER_ACT_ULTRACARD_SIM_TYPE_1',
      ultracardSimType2: 'HEADER_ACT_ULTRACARD_SIM_TYPE_2',
      ultracardSimSerialNo1: 'HEADER_ACT_ULTRACARD_SIM_SERIAL_NO_1',
      ultracardSimSerialNo2: 'HEADER_ACT_ULTRACARD_SIM_SERIAL_NO_2',
      dep: 'HEADER_DEP'
    }
  };


  public static configIds = {
    '1': {
      configId: '5c60e182-4a75-511c-e053-1405100af36g',
      reviewConfigId: '5c60e182-4a75-511c-e053-1405100af36h'
    },
    '2': {
      configId: '5c60e182-4a75-511c-e053-1405100af36b',
      reviewConfigId: '5c60e182-4a75-511c-e053-1405100af36d'
    },
    '3': {
      configId: '98cc3fa1-0a5d-628e-e053-1e07100ac6ec',
      reviewConfigId: '5c60e182-4a75-511c-e053-1405100af36d'
    }
  };

  // used for Bulk edit
  public static fieldTitles = {
    '1': {
      11: 'HEADER_BAN_ACCOUNT_OWNER',
      12: 'HEADER_BAN_GOING',
      13: 'HEADER_BAN_BIC',
      10: 'HEADER_BAN_CUSTOMER_NUMBER',
      8: 'HEADER_BAN_BANK_CODE',
      9: 'HEADER_BAN_BANKNAME',
      7: 'HEADER_BAN_PAYMENT',
      66: 'HEADER_BAN_FIRST_NAME',
      26: 'HEADER_BAN_NAME1',
      27: 'HEADER_BAN_NAME2',
      28: 'HEADER_BAN_NAME3',
      29: 'HEADER_BAN_STREET',
      30: 'HEADER_BAN_HOUSE_NO',
      60: 'HEADER_BAN_LAND',
      33: 'HEADER_BAN_POSTCODE',
      32: 'HEADER_BAN_CITY',
      34: 'HEADER_BAN_CONTACT_PERSON',
      36: 'HEADER_BAN_TELEPHONE_NO',
      35: 'HEADER_BAN_FAX_NUMBER',
      37: 'HEADER_BAN_EMAIL_ADDRS',
      62: 'HEADER_BAN_SALUTATION',
      70: 'HEADER_BAN_NAME_FORMAT',
      64: 'HEADER_BAN_TITLE',
      31: 'HEADER_BAN_COUNTRY_CODE',
      68: 'HEADER_BAN_ADDRESS_TYPE'
    },
    '2': {
      1: 'HEADER_BAN',
      2: 'HEADER_SUBSCRIBER_NO',
      46: 'HEADER_ADDRESS_TYPE',
      42: 'HEADER_COUNTRY_NAME',
      43: 'HEADER_SALUTATION',
      44: 'HEADER_NAME_TITLE',
      9: 'HEADER_LAST_NAME_1',
      10: 'HEADER_LAST_NAME_2',
      11: 'HEADER_LAST_NAME_3',
      45: 'HEADER_FIRST_NAME',
      12: 'HEADER_STREET',
      13: 'HEADER_HOUSE_NO',
      14: 'HEADER_PO_BOX',
      17: 'HEADER_ZIP',
      16: 'HEADER_CITY',
      41: 'HEADER_NUMBER_DIGITS_MASK_CALL_DETAIL',
      28: 'HEADER_IDENTIFIER_FOR_CUST',
      18: 'HEADER_DISTRICT',
      19: 'HEADER_FAX_NO',
      20: 'HEADER_PHONE',
      47: 'HEADER_NAME_FORMAT',
      53: 'HEADER_NEW_PASSWORD',
      54: 'HEADER_PASSWORD_RESET',
      55: 'HEADER_SMS_IND',
      48: 'HEADER_EMAIL_ADDRESS'
    },
    '3': {
      1: 'HEADER_BAN',
      2: 'HEADER_SUBSCRIBER_NO',
      46: 'HEADER_ADDRESS_TYPE',
      42: 'HEADER_COUNTRY_NAME',
      43: 'HEADER_SALUTATION',
      44: 'HEADER_NAME_TITLE',
      9: 'HEADER_LAST_NAME_1',
      10: 'HEADER_LAST_NAME_2',
      11: 'HEADER_LAST_NAME_3',
      45: 'HEADER_FIRST_NAME',
      12: 'HEADER_STREET',
      13: 'HEADER_HOUSE_NO',
      14: 'HEADER_PO_BOX',
      17: 'HEADER_ZIP',
      16: 'HEADER_CITY',
      41: 'HEADER_NUMBER_DIGITS_MASK_CALL_DETAIL',
      28: 'HEADER_IDENTIFIER_FOR_CUST',
      18: 'HEADER_DISTRICT',
      19: 'HEADER_FAX_NO',
      20: 'HEADER_PHONE',
      47: 'HEADER_NAME_FORMAT',
      53: 'HEADER_NEW_PASSWORD',
      54: 'HEADER_PASSWORD_RESET',
      55: 'HEADER_SMS_IND',
      48: 'HEADER_EMAIL_ADDRESS',
      99: 'HEADER_MSISDN'
    }
  };

  public static formControlCopies = {
    // title or firstName
    '1': ['64', '66'],
    // street, houseno, pobox, title & firstName, password, password reset, sms senden
    '2': ['12', '13', '14', '44', '45', '53', '54', '55'],
    '3': ['12', '13', '14', '44', '45', '53', '54', '55'],
  };

  public static hideCols = {
    'NEW_SIM': ['1', '29', '30', '7', '2'],
    'EXISTING_SIM': ['1', '32', '34', '8', '2']
  };

  public static wifiDisableCols = ['29', '30', '32', '34'];

  public static formControlUnique = {
    3: ['7', '29', '30']
  };
}

