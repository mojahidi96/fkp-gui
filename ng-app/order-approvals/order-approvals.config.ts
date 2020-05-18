
const actoptions = [
  {text: 'Genehmigt', value: '5'},
  {text: 'Abgelehnt', value: '9'},
  {text: 'Genehmigung ausstehend', value: '8'}
];

export const OrderApproverConfig = {
  mobile: {
    type: 'mobile',
    actOptions: [] = actoptions,
    landingPageUrl: '/buyflow/client/en_US/default_page',
    orderDetailPageUrl: '/portal/client/approverorderdetail?transactionId=',
    orderApprovalPageUrl: '/portal/app/#/mobile/approveorder/'
  },
  fixednet: {
    type: 'fixednet',
    actOptions: [] = actoptions,
    landingPageUrl: '/fixednet/home',
    orderDetailPageUrl: '/fixednet/orderapprovals/orderdetails'
  }
};