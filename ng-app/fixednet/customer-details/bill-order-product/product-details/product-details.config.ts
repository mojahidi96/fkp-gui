const typeMap = {
  'accesses': 'Accesses',
  'voice': 'Sprachdienst',
  'internet': 'Datendienst',
  'safetyPackages': 'Safety Packages',
  'extraNumbers': 'Extra Numbers',
  'directoryEntries': 'Directory Entries',
  'hardwareSet': 'Hardware Set',
  'officeNetSeats': 'Office Net Seats'
};

const accessCols = [
  {title: 'Access Id', field: 'id', show: true, sortable: true},
  {title: 'ccbId', field: 'ccbId', show: true, sortable: true},
  {title: 'Name', field: 'rootName', show: true, sortable: true},
  {title: 'Access Type', field: 'accessType', show: true, sortable: true}
];

const hardwareCols = [
  {title: 'Artikelnummer', field: 'articleNumber', show: true, sortable: true},
  {title: 'Artikelname', field: 'articleName', show: true, sortable: true},
  {title: 'Seriennummer', field: 'serialNumber', show: true, sortable: true},
  {title: 'Empfänger', field: 'address', show: true, sortable: true},
  {title: 'Lieferscheinnummer', field: 'deliveryNoteNumber', show: true, sortable: true},
  {title: 'Lieferdatum', field: 'deliveryDate', show: true, sortable: true, type: 'date'},
  {title: 'Logistikpartner', field: 'deliveryCompany', show: true, sortable: true}
];

const officeNetSeatsCols = [
  {title: 'Artikelnummer', field: 'articleNumber', show: true, sortable: true},
  {title: 'Artikelname', field: 'articleName', show: true, sortable: true},
  {title: 'Seriennummer', field: 'serialNumber', show: true, sortable: true},
  {title: 'Empfänger', field: 'address', show: true, sortable: true},
  {title: 'Lieferscheinnummer', field: 'deliveryNoteNumber', show: true, sortable: true},
  {title: 'Lieferdatum', field: 'deliveryDate', show: true, sortable: true, type: 'date'},
  {title: 'Logistikpartner', field: 'deliveryCompany', show: true, sortable: true}
];


export const ProductDetailsConfig = {
  typeMap: typeMap,
  productDetailUrl: '/fixedline/rest/fnshop/sec/productdetails',
  customerDetailUrl: '/fixedline/rest/fnshop/sec/customerdetails',
  accessCols: accessCols,
  hardwareCols: hardwareCols,
  officeNetSeatsCols: officeNetSeatsCols
};

