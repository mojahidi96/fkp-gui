export class LandingPageConfig {
  static readonly advancedSearchFields: any = {
    'orderNo': {
      'field': '1',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
    },
    'customerName': {
      'field': '2',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
    },
    'orderStatus': {
      'field': '3',
      'type': 'text',
      'defaultValue': 'choose',
      'ignore': false
    },
    'orderCreated': {
      'field': '5',
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
    'productName': {
      'field': '12',
      'type': 'text',
      'defaultValue': 'choose',
      'ignore': false
    },
    'shopName': {
      'field': '16',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
    },
    'customerNo': {
      'field': '17',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
    },
    'customerHierarchyNo': {
      'field': '18',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
    },
    'void': {
      'field': '19',
      'type': 'text',
      'defaultValue': '',
      'ignore': false
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
    }
  };
}
