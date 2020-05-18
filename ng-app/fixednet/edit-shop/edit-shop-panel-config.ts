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
  {title: 'Service-Schein Nummer', field: 'productCommitmentNo', show: true, sortable: true},
  {title: 'Produkt Code', field: 'productCode', show: true, sortable: true},
  {title: 'Produkt Name', field: 'productName', show: true, sortable: true},
  {title: 'Preis Code', field: 'pricingStructureCode', show: true, sortable: true},
  {title: 'Preis Code Name', field: 'pricingStructureName', show: true, sortable: true}
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
    'buttonTitle': 'Shop anpassen',
    'getUrl': '/portal/rest/shop/sec/fn/shopsetup',
    'saveUrl': '/portal/rest/shop/sec/fn/save/shopsetup'
  },
  {
    'id': '1',
    'title': 'Kundennummern',
    'getUrl': '/portal/rest/shop/sec/fn/customers',
    'saveUrl': '/portal/rest/shop/sec/fn/save/customers',
    'rows': [],
    'columns': customerCols,
    'selected': [],
    'tab': false,
    'buttonTitle': 'Shop anpassen',
    'sortField': 'fnRootCustomerNumber',
    'autoAssign': false,
    'autoAssignReadonly': false,
    'autoAssignLabel': 'Auto Assign Kundennummern'
  },
  {
    'id': '2',
    'title': 'Rechnungskonten',
    'getUrl': '/portal/rest/shop/sec/fn/billingaccs',
    'saveUrl': '/portal/rest/shop/sec/fn/save/billingaccs',
    'rows': [],
    'columns': billingCols,
    'selected': [],
    'tab': false,
    'buttonTitle': 'Shop anpassen',
    'sortField': 'customerNo',
    'autoAssign': false,
    'autoAssignReadonly': false,
    'autoAssignLabel': 'Auto Assign Rechnungskonten'
  },
  {
    'id': '3',
    'title': 'Service-Scheine und Produkte',
    'selected': [],
    'tab': true,
    'tabs': [
      {
        'id': '0',
        'title': 'Service-Scheine',
        'getUrl': '/portal/rest/shop/sec/fn/products',
        'saveUrl': '/portal/rest/shop/sec/fn/save/products',
        'rows': [],
        'columns': productCols,
        'selected': [],
        'buttonTitle': 'Shop anpassen',
        'sortField': 'productCommitmentNo'
      },
      {
        'id': '1',
        'title': 'Verkaufsprodukte',
        'getUrl': '/portal/rest/shop/sec/fn/salesproducts',
        'saveUrl': '/portal/rest/shop/sec/fn/save/salesproducts',
        'rows': [],
        'columns': salesProductCols,
        'selected': [],
        'buttonTitle': 'Shop anpassen',
        'sortField': 'salesProductName'
      }]
  }
];

