

const installProductCols = [
  {title: 'Paket-Konstellation', field: 'productType', show: true, sortable: true},
  {title: 'Paket-Tarif', field: 'productTariff', show: true, sortable: true},
  {title: 'Hauptrufnummer', field: 'mainPhoneNumber', show: true, sortable: true}
];



const cartItem = {
  productBundle: {
    productName: '',
    productDescription: '',
    productBandwidth: '',
    salesProductId: '',
    salesProdBandWidth: '',
    salesProdBandWidthId: ''
  },
  location: {
    city: '',
    cName: '',
    houseNumber: '',
    street: '',
    postCode: ''
  },
  detail: []
};

const detailCartItem = {
  cartPanels: null,
  panelFields: []
};

const addressErrorMesages = {
  ChooseFromSuggestedAddresses: 'Bitte wählen Sie aus folgenden Adressen aus. Wenn keine dieser Adresse passt, ' +
  'ändern Sie bitte Ihre Eingabedaten.',
  TooManySuggestedAddresses: 'Es wurden mehr als 10 Treffer emittelt. Bitte ändern Sie Ihre Eingabedaten.',
  NoSuggestedAddresses: 'Es konnte keine passende Adresse ermittelt werden. Bitte ändern Sie Ihre Eingabedaten.'
};


export const ProductLocationConfig = {
  installProductCols: installProductCols,
  /*addressUrl: '/fixedline/rest/postoffice/001913902661/addresses',*/
  addressUrl: '/fixedline/rest/postoffice/',
  /*productUrl: '/fixedline/rest/customernode/001913902661/locations/installedproducts',*/
  productUrl: '/fixedline/rest/customernode/',
  locationUrl: '/fixedline/rest/customernode/',
  /*availableProductsUrl: '/fixedline/rest/customernode/001913902661/locations/availableproducts',*/
  availableProductsUrl: '/fixedline/rest/customernode/',
  cartItem: cartItem,
  detailCartItem: detailCartItem,
  addressErrorMesages: addressErrorMesages
};



