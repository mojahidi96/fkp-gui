export class LandingPageConfig {
  static readonly advancedSearchFields: any = {
      'bandwidth': {
          'field': '1',
          'type': 'text',
          'labelText': 'BANDWIDTH',
          'ignore': false,
          'defaultValue': 'choose'
      },
      'customerAccountNumber': {
          'field': '4',
          'type': 'text',
          'labelText': 'CUSTOMER_ACCOUNT_NUMBER',
          'ignore': false,
          'defaultValue': ''
      },
      'customerOrderDetails': {
          'field': '5',
          'type': 'text',
          'labelText': 'ED_CUSTOMER_ORDER_DETAILS',
          'ignore': false,
          'defaultValue': '',
          'comparator': 'INC'
      },
      'loc1': {
          'field': '6',
          'type': 'text',
          'labelText': 'LOCATION_1',
          'ignore': false,
          'defaultValue': '',
          'comparator': 'INC'
      },
      'loc1Area': {
          'field': '7',
          'type': 'text',
          'labelText': 'LOCATION_1_AREA',
          'ignore': false,
          'defaultValue': ''
      },
      'loc1BU': {
          'field': '8',
          'type': 'text',
          'labelText': 'LOCATION_1_BU',
          'ignore': false,
          'defaultValue': ''
      },
      'loc1CompanyName': {
          'field': '9',
          'type': 'text',
          'labelText': 'LOCATION_1_COMPANY_NAME',
          'ignore': false,
          'defaultValue': ''
      },
      'loc1Network': {
          'field': '10',
          'type': 'text',
          'labelText': 'LOCATION_1_NETWORK',
          'ignore': false,
          'defaultValue': ''
      },
      'loc2': {
          'field': '11',
          'type': 'text',
          'labelText': 'LOCATION_2',
          'ignore': false,
          'defaultValue': '',
          'comparator': 'INC'
      },
      'loc2Area': {
          'field': '12',
          'type': 'text',
          'labelText': 'LOCATION_2_AREA',
          'ignore': false,
          'defaultValue': ''
      },
      'loc2BU': {
          'field': '13',
          'type': 'text',
          'labelText': 'LOCATION_2_BU',
          'ignore': false,
          'defaultValue': ''
      },
      'loc2CompanyName': {
          'field': '14',
          'type': 'text',
          'labelText': 'LOCATION_2_COMPANY_NAME',
          'ignore': false,
          'defaultValue': ''
      },
      'loc2Network': {
          'field': '15',
          'type': 'text',
          'labelText': 'LOCATION_2_NETWORK',
          'ignore': false,
          'defaultValue': ''
      },
      'orderNo': {
          'field': '16',
          'type': 'text',
          'labelText': 'ED_ORDER_NUMBER',
          'ignore': false,
          'defaultValue': ''
      },
      'orderType': {
          'field': '17',
          'type': 'text',
          'labelText': 'ORDER_TYPE',
          'ignore': false,
          'defaultValue': 'choose'
      },
      'product': {
          'field': '18',
          'type': 'text',
          'labelText': 'PRODUCT',
          'ignore': false,
          'defaultValue': 'choose'
      },
      'projectName': {
          'field': '19',
          'type': 'text',
          'labelText': 'PROJECT_NAME',
          'ignore': false,
          'defaultValue': ''
      },
      'serviceLevel': {
          'field': '20',
          'type': 'text',
          'labelText': 'SERVICE_LEVEL',
          'ignore': false,
          'defaultValue': 'choose'
      },
      'serviceNumber': {
          'field': '21',
          'type': 'text',
          'labelText': 'SERVICE_NUMBER',
          'ignore': false,
          'defaultValue': ''
      },
      'status': {
          'field': '22',
          'type': 'text',
          'labelText': 'ED_STATUS',
          'ignore': false,
          'defaultValue': 'choose'
      },
      'vfReferenceNumber': {
          'field': '25',
          'type': 'text',
          'labelText': 'VF_REF_ORDER_NUMBER',
          'ignore': false,
          'defaultValue': ''
      },
      'orderCreated': {
          'field': '3',
          'type': 'date',
          'defaultValue': '',
          'ignore': false,
          'compoundFields': {
              '1': {
                  'durationDays': {
                      'defaultVal': 30,
                      'comparator': 'GTE'
                  }
              },
              '2': {
                  'fromDate': {
                      'defaultVal': '',
                      'comparator': 'GTE'
                  },
                  'toDate': {
                      'defaultVal': '',
                      'comparator': 'LTE'
                  }
              }
          }
      },
      'durationDays': {
          'field': 'durationDays',
          'type': 'text',
          'defaultValue': '',
          'ignore': true
      },
      'fromDate': {
          'field': 'fromDate',
          'type': 'date',
          'defaultValue': '',
          'ignore': true
      },
      'toDate': {
          'field': 'toDate',
          'type': 'date',
          'defaultValue': '',
          'ignore': true
      },
      'shopName': {
          'field': '55',
          'type': 'text',
          'labelText': 'SHOP_NAME',
          'ignore': false,
          'defaultValue': '',
          'comparator': 'INC'
      }
  };
}
