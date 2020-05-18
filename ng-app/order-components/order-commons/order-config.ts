export class OrderConfig {
  public static cols = {
    subCols: [
      {'title': 'Rufnummer', 'field': 'id', 'show': true, 'type': 'text'},
      {'title': 'Kundennummer', 'field': 'ban', 'show': true, 'type': 'text'},
      {'title': 'Geändertes Feld', 'field': 'fieldTitle', 'show': true, 'type': 'text'},
      {'title': 'Bisheriger Wert', 'field': 'oldValue', 'show': true, 'type': 'text'},
      {'title': 'Neuer Wert', 'field': 'newValue', 'show': true, 'type': 'text'}
    ],
    banCols: [
      {'title': 'Kundennummer', 'field': 'ban', 'show': true, 'type': 'text'},
      {'title': 'Geändertes Feld', 'field': 'fieldTitle', 'show': true, 'type': 'text'},
      {'title': 'Bisheriger Wert', 'field': 'oldValue', 'show': true, 'type': 'text'},
      {'title': 'Neuer Wert', 'field': 'newValue', 'show': true, 'type': 'text'}
    ],
    changeBillingCols: [
      {'title': 'Kundennummer', 'field': 'ban', 'show': true, 'type': 'text'},
      {'title': 'Rufnummer', 'field': 'msisdn', 'show': true, 'type': 'text'},
      {'title': 'Art der Verbindungsübersicht', 'field': 'callDetailType', 'show': true, 'type': 'text'},
      {'title': 'Verkürzte Zielrufnummer', 'field': 'digitMasked', 'show': true, 'type': 'text'}
    ],
    prolongSubCols: [
      {'title': 'Rufnummer', 'field': 'msisdn', 'show': true, 'type': 'text'},
      {'title': 'Bestellstatus', 'field': 'orderStatus', 'show': true, 'type': 'text'},
      {'title': 'Teilnehmer', 'field': 'subsAddress', 'show': true, 'type': 'text'},
      {'title': 'Tarifname', 'field': 'tariffName', 'show': true, 'type': 'text'},
      {'title': 'Tarifoptionen', 'field': 'tariffOption', 'show': true, 'type': 'text'},
      {'title': 'Free Text', 'field': 'freeText', 'show': true, 'type': 'text'}
    ],
    changeTariffCols: [
      {'title': 'TELEPHONE_NUMBER-TITLE', 'field': 'msisdn', 'show': true, 'type': 'text'},
      {'title': 'OH_ORDER_STATUS-TITLE', 'field': 'status', 'show': true, 'type': 'text'},
      {'title': 'OH_MEMBER-TITLE', 'field': 'address', 'show': true, 'type': 'text'},
      {'title': 'FREE_TEXT-TITLE', 'field': 'freeText', 'show': true, 'type': 'text'}
    ]
  };


  public static approvalOptions = [
    {text: 'Genehmigt', value: '5'},
    {text: 'Abgelehnt', value: '9'},
    {text: 'Genehmigung ausstehend', value: '8'}
  ];
  public static orderTypes = {
    'MA_CHANGE_BILLING_PARAM': 'Einzelverbindungsnachweis verwalten',
    'PROLONG_SUBSCRIBER': 'Vertragsverlängerung',
    'MA_CHANGE_TARIFF': 'Tarifwechsel',
    'ACTIVATE_SUBSCRIBER': 'Neukarte'
  };
  public static backButtonUrls = {
    'ORDER_SEARCH': '/buyflow/client/en_US/search?navigationValue=search_orders',
    'ORDER_HISTORY': '/buyflow/client/en_US/orderhistory?navigationValue=order_history',
    'ORDER_APPROVAL': 'mobile/orderapprovals'
  };
}
