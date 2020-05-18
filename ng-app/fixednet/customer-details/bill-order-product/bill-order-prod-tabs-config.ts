const productCols = [
  {title: 'Standort', field: 'locationAddress', show: true, sortable: true},
  {title: 'Paket-Konstellation', field: 'productType', show: true, sortable: true},
  {title: 'Paket-Tarif', field: 'salesPacketName', show: true, sortable: true},
  {title: 'Hauptrufnummer', field: 'mainAccessNo', show: true, sortable: true}
];

const orderCols = [
  {title: 'Bestellnummer', field: 'barCodeId', show: true, sortable: true},
  {title: 'Standort', field: 'localAddress', show: true, sortable: true},
  {title: 'Auftragstyp', field: 'orderType', show: true, sortable: true},
  {title: 'Produkttyp', field: 'productBundleType', show: true, sortable: true},
  {title: 'Auftragstatus', field: 'orderStatus', show: true, sortable: true},
];

export const BillOrderProdTabsConfig = [
  {
    'id': '1',
    'title': 'Aufträge',
    'getUrl': '/fixedline/rest/fnshop/sec/orders',
    'saveUrl': '/portal/rest/shop/sec/fn/save/billingaccs',
    'rows': [],
    'columns': orderCols,
    'selected': [],
    'buttonTitle': 'Save Billing Accounts',
    'sortField': 'barCodeId',
    'storedRows': [],
    'disabled': true
  },
  {
    'id': '2',
    'title': 'Produkte',
    'getUrl': '/fixedline/rest/fnshop/sec/products',
    'saveUrl': '/portal/rest/shop/sec/fn/save/billingaccs',
    'rows': [],
    'columns': productCols,
    'selected': [],
    'buttonTitle': 'Save Billing Accounts',
    'sortField': 'locationAddress',
    'storedRows': [],
    'disabled': true
  }
];

