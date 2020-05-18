import {Injectable} from '@angular/core';

@Injectable()
export class TranslationsGuidsService {

  private readonly guids = {
    'sub-update-info': '6550b532-28bb-747b-e053-1505100a8fdc',
    'ban-update-info': '6550d990-ebec-6099-e053-2076a8c03bae',
    'data-report-page': '69160c0b-961c-04c1-e053-1405100acb85',
    'change-bill-param-info': '6932f268-3f97-2671-e053-1405100a32ed',
    'fixednet': '6b37fc8a-7482-24f8-e053-1505100a7ac9',
    'vvl-flow': '6853c1d9-a9ae-425d-e053-1505100a82d5',
    'fixednet-customer-details': '6dd28402-3799-2ca8-e053-1405100a47f4',
    'fixednet-order-history': '6efd35c6-ee04-1892-e053-1405100a8031',
    'order-approvals-page': '6f37c6ab-ad78-2ce0-e053-1405100a9096',
    'default-data-table': '6f11ad0e-37d5-7545-e053-1405100a8dd5',
    'default-column-headers': '6fb1c5df-3b9f-39bb-e053-1405100ab43e',
    'fixednet-order-manager': '6fca1407-8c0a-6aa8-e053-1505100acb6d',
    'common': '70a159b6-117c-7683-e053-1505100a7000',
    'shopping-cart': '70b7b639-a864-5bf3-e053-1405100aec97',
    'maintain-soc': '7313822b-e758-156b-e053-1405100a04cb',
    'order-details-common': '71c1144a-a75f-4c72-e053-1405100ac666',
    'save-shopping-cart': '741b8245-8790-3437-e053-1505100a040a',
    'address-selection-bundle': '76da0a49-1bf3-5635-e053-2176a8c03f9a',
    'ed-order-manager': '797036d3-117d-686c-e053-1505100a6791',
    'soc-manager': '813bed44-674e-5c77-e053-1e07100a148b',
    'ed-shop': '87f8aca8-d7bf-5a8d-e053-1f07100a23e5',
    'order-confirm-page-bundle': '89a2a356-2c6e-6332-e053-1f07100a4baa',
    'selection-panel': '8cdc64bc-58e1-47a9-e053-1e07100a56c6',
    'tariff-panel': '8ced770c-319f-7c5e-e053-1e07100a2549',
    'order-review-panel': '8ced770c-31a0-7c5e-e053-1e07100a2549',
    'order-confirmation-panel': '8ced770c-31a1-7c5e-e053-1e07100a2549',
    'ct-flow': '8d4de6e1-74e3-6279-e053-1e07100a949a',
    'hardware-panel': '8db4ebe8-2f1b-3aa1-e053-1e07100a6c11',
    'soc-panel': '8db4ebe8-2f1c-3aa1-e053-1e07100a6c11',
    'debitor-panel': '8db4ebe8-2f1d-3aa1-e053-1e07100a6c11',
    'shipment-panel': '8db4ebe8-2f20-3aa1-e053-1e07100a6c11',
    'fixednet-shop': '8f0e0654-05d3-39be-e053-1e07100a4035',
    'activation-flow': '8f82f11a-e765-5a63-e053-1e07100acbac',
    'sncr-file-drop': '99ce3793-77f1-4f67-e053-1e07100a9188',
    'esim-flow': '9d5bfc08-fa80-76f1-e053-1e07100aea6a',
    'esim-manager': 'a0077cc9-ba7f-469f-e053-1e07100a85ed',
    'esim-download': 'a2c60ce6-dfa5-14ea-e053-1e07100a3652',
    'xinv-flow': 'a2c60ce6-dfa5-14ea-e053-1e07100a3654'
  };

  private readonly translationEnabled = [
    '/mobile/subscriberUpdateInfo',
    '/mobile/vvlflow',
    '/mobile/approveorder',
    '/mobile/orderdetail',
    '/mobile/ctflow',
    '/mobile/actflow',
    '/mobile/esimflow',
    '/mobile/esim-download',
    '/mobile/xinvflow'
  ];

  getGuids(...guid: string[]): string[] {
    return guid.reduce((prev, current) => {
      prev.push(this.guids[current]);
      return prev;
    }, []);
  }

  isTranslationEnabled(url: string) {
    return this.translationEnabled.some(t => url.includes(t));
  }
}
