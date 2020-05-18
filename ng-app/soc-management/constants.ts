export class CONSTANTS {

  backParamsByOrderType = {
    'HANDY_TARIFF': 'soc',
    'HANDY_AND_TARIFF': 'soc',
    'SIM_ONLY': 'simsoc',
    'SIM_SUBSIDY': 'simsoc',
    'SIM_AND_DELAYED_SUBSIDY': 'simsoc',
    'SIM_CREDIT': 'simsoc',
    'SIM_AND_CREDIT_VOUCHER': 'simsoc',
    'SUBS_HANDY_ONLY': 'prolo_soc',
    'SUBS_HANDY_AND_TARIFF': 'prolo_soc',
    'REDEEM_DELAYED_SUBSIDY': 'redeem_socselection'
  };

  activationOrderType = [
    'HANDY_TARIFF',
    'HANDY_AND_TARIFF',
    'SIM_ONLY',
    'SIM_SUBSIDY',
    'SIM_AND_DELAYED_SUBSIDY',
    'SIM_CREDIT',
    'SIM_AND_CREDIT_VOUCHER'
  ];

  nextActionByOrderType = {
    'HANDY_TARIFF': 'subscription',
    'HANDY_AND_TARIFF': 'subscription',
    'SIM_ONLY': 'subscription',
    'SIM_SUBSIDY': 'subscription',
    'SIM_AND_DELAYED_SUBSIDY': 'subscription',
    'SIM_CREDIT': 'subscription',
    'SIM_AND_CREDIT_VOUCHER': 'subscription',
    'SUBS_HANDY_ONLY': 'Prolongation_CheckoutSummary',
    'SUBS_HANDY_AND_TARIFF': 'Prolongation_CheckoutSummary',
    'REDEEM_DELAYED_SUBSIDY': 'redeemProcessSoc'
  };

  allTariffOptions = 'Alle verfügbaren Tarifoptionen';
  bookedTariffOptions = 'Bereits gebuchte Tarifoptionen';
  bookedOtherOptions = 'Gebuchte Tarifoptionen';

  socColValue = 44;
  ultraColValue = 38;

  staticGermanVal = '0,00€';

  popOverCustOrderNumber = 'REVIEW-POPOVER_CUSTOMER_ORDER_NUMBER';

  popOverCustIntNote = 'REVIEW-POPOVER_CUSTOMER_INITIAL_NUMBER';

  popOverVoid = 'REVIEW-POPOVER_CUSTOMER_VOID';

  subscriberCol = 2;
  banCol = 1;

  vatPercentVal = 17.74;

  vatPercentage = 19;

  defaultFilter = 'Alle verfügbaren Tarifoptionen';

  dtoType = 'maintainSocDTO';

  orderFlowType = 'MA_MAINTAIN_SOC';

  actType = {
    'next': 'Nächster Rechnungszyklus',
    'today': 'Heute',
    'custom': 'Nächstmöglicher Zeitpunkt'
  };

  technicalErrorText = `<b>Vorübergehende technische Störung</b><p></p>` +
    `Aufgrund einer Systemstörung steht Ihnen die gewünschte Internetseite zurzeit leider nicht zur Verfügung.` +
    ` Bitte versuchen Sie es später noch einmal.<p></p>Viele Grüße, Ihr Vodafone Team`;

  ORDERTYPE_MA_CHANGE_SUB_NAME_ADD = 'MA_CHANGE_SUB_NAME_ADD';
  ORDERTYPE_MA_CHANGE_BAN_NAME_ADD = 'MA_CHANGE_BAN_NAME_ADD';
  ORDERTYPE_ACTIVATE_SUBSCRIBER = 'ACTIVATE_SUBSCRIBER';
  ORDERTYPE_MA_SUBSCRIBER_PW = 'MA_SUBSCRIBER_PW';
  ORDERTYPE_MA_BANK_INFO = 'MA_BANK_INFO';
  subscriber_udate_info = 'Änderung der Teilnehmerdaten: ';
  change_password = 'Änderung der internen Kennziffer und/oder des Passworts: ';
  ban_udate_info = 'Änderung der Kundennummerdaten: ';
  payment_info = 'Änderung der Zahlungsinformationen: ';


  lazyLoadUrlSubsDetails = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36c';
  lazyLoadUrlSubsManager = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36b';
  lazyLoadUrlSubsReview = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36d';
  lazyLoadUrlSubsUploadReview = '/buyflow/rest/table/custom/6fa053d8-63d8-58fe-e053-1405100a920b';

  getProperties() {
    let mapList = new Map;
    mapList.set('add.label.pre', 'Sie buchen diese Tarifoption für ');
    mapList.set('add.label.post', ' Teilnehmer.');
    mapList.set('remove.label.pre', 'Sie kündigen diese Tarifoption für ');
    mapList.set('remove.label.post', ' Teilnehmer.');
    mapList.set('subscriber.section.label', 'Bitte wählen Sie die Teilnehmer für die Verwaltung der Tarifoptionen aus.');
    mapList.set('subscriber.next.button', 'Weiter zu den Tarifoptionen');
    // dynamic group icons based on Soc Configuration
    mapList.set('bold', 'boldIcon');
    mapList.set('call.contacts', 'calls-contactsIcon');
    mapList.set('connectivity', 'connectivityIcon');
    mapList.set('customers', 'customersIcon');
    mapList.set('data', 'dataIcon');
    mapList.set('info.circle', 'info-circleIcon');
    mapList.set('international.minutes', 'international-minutes');
    mapList.set('landline.or.call', 'landline-or-call');
    mapList.set('mail.new', 'mail-newIcon');
    mapList.set('mobile', 'mobileIcon');
    mapList.set('privacy', 'privacyIcon');
    mapList.set('roaming', 'roamingIcon');
    mapList.set('security', 'securityIcon');
    mapList.set('warning', 'landline-callIcon');
    mapList.set('show', 'landline-callIcon');

    // Master-slave soc descriptions
    mapList.set('master.label.pre', 'SOC_SELECTION-MASTER_LABEL_PREFIX');
    mapList.set('master.label.suf', 'SOC_SELECTION-MASTER_LABEL_SUFIX');
    mapList.set('master.description', 'SOC_SELECTION-MASTER_DESCRIPTION');

    return mapList;
  }

  constructor() {

  }

}
