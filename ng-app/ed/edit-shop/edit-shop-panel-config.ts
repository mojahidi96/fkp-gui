const customerCols = [
  {title: '', field: 'billError', show: true, bodyTemplate: '', filter: false, sortable: false},
  {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
  {title: 'Kundenname', field: 'customerName', show: true, sortable: true},
  {title: 'Shop', field: 'shopName', show: true, sortable: true},
  {title: 'übergeordnete Kundennummer', field: 'fnRootCustomerNumber', show: true, sortable: true},
  {title: 'Name', field: 'rootCustomerName', show: true, sortable: true}
];

const billingCols = [
  {title: 'Rechnungskonto', field: 'accountNo', show: true, sortable: true},
  {title: 'Name', field: 'accountName', show: true, sortable: true},
  {title: 'Adresse', field: 'accountAddress', show: true, sortable: true},
  {title: 'Kundennummer', field: 'customerNo', show: true, sortable: true}
];

const productCols = [
  {title: 'Produktbezeichnung', field: 'productName', show: true, sortable: true}
];

const salesProductCols = [
  {title: 'Verkaufsprodukt', field: 'salesProductName', show: true, sortable: true},
  {title: 'Tarif', field: 'tariffName', show: true, sortable: true},
  {title: 'Tarif Modell', field: 'tariffModel', show: true, sortable: true}
];

export const popupMsgs = {
  'customerToOtherShopMsg': 'Ihre Auswahl enthält Kundennummern, die bereits einem anderen Shop zugeordnet sind. Möchten Sie fortfahren ?',
  'customerWithNoBilling': 'No Rechnungskonto for customer ID have been selected.'
};

export const EditShopPanelConfig = [
  {
    'id': 'setup-1',
    'title': 'Setup ->Allgemein',
    'tab': false,
    'buttonTitle': 'Weiter',
    'getUrl': '/ed/rest/edshop/shopsetup',
    'saveUrl': '/ed/rest/edshop/sec/save/shopsetup',
    'buttonType': 'strong',
  },
  {
    'id': '1',
    'title': 'Kundennummern',
    'getUrl': '/ed/rest/edshop/customers',
    'saveUrl': '/ed/rest/edshop/sec/save/customers',
    'rows': [],
    'columns': customerCols,
    'selected': [],
    'tab': false,
    'buttonTitle': 'Weiter',
    'sortField': 'fnRootCustomerNumber',
    'buttonType': 'strong',
  },
  {
    'id': '2',
    'title': 'Rechnungskonten',
    'getUrl': '/ed/rest/edshop/billingaccnumber',
    'saveUrl': '/ed/rest/edshop/sec/save/billingaccnumber',
    'rows': [],
    'columns': billingCols,
    'selected': [],
    'tab': false,
    'buttonTitle': 'Weiter',
    'sortField': 'customerNo',
    'buttonType': 'strong',
  },
  {
    'id': '3',
    'title': 'Produkte',
    'getUrl': '/ed/rest/edshop/products',
    'saveUrl': '/ed/rest/edshop/sec/save/products',
    'rows': [],
    'columns': productCols,
    'selected': [],
    'tab': false,
    'buttonTitle': 'Shop anpassen',
    'sortField' : 'productName',
    'buttonType': 'primary',
  }
];