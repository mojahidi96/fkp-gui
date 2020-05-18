import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean} from '@storybook/addon-knobs';

import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {TranslationModule} from 'angular-l10n';

import {SncrDatatableModule} from './sncr-datatable.module';

import * as DatatableComponentAst from 'ast!./sncr-datatable.component';
import {generateDocumentation} from '../../../storybook/utils/api';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {AppService} from '../../app/app.service';
import {NgModule} from '@angular/core';
import {TranslationsGuidsService} from '../sncr-commons/translations-guids.service';
import {SncrDatatableService} from './sncr-datatable.service';
import {InMemorySncrDatatableService} from './specs/in-memory-sncr-datatable.service';
import {Column} from './specs/features/base';

@NgModule({
  imports: [SncrDatatableModule],
  exports: [SncrDatatableModule]
})
class StorySncrDatatableModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('default-data-table')
    );
  }
}

function* counterWithPrefix(prefix: string) {
  let i = 1;
  while (true) {
    yield `${prefix}${i++}`;
  }
}

const datatableService = new InMemorySncrDatatableService();

storiesOf('SNCR Components|Datatable', module)
  .addParameters(generateDocumentation(DatatableComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        RouterModule.forRoot([], {onSameUrlNavigation: 'reload'}),
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StorySncrDatatableModule
      ],
      providers: [
        AppService,
        TranslationsGuidsService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: SncrDatatableService, useValue: datatableService}
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value" [columnSelection]="columnSelection" 
[resultCount]="resultCount" [exportToCsv]="exportToCsv"></sncr-datatable>`,
    props: {
      cols: [
        {
          field: 'msisdn',
          type: 'text',
          title: 'MSISDN',
          show: true
        },
        {
          field: 'contractDate',
          type: 'date',
          title: 'Contract Date',
          show: true
        },
        {
          field: 'isCanceled',
          type: 'boolean',
          title: 'Is canceled',
          show: true
        },
        {
          field: 'numberOfTariffOptions',
          type: 'number',
          title: 'Number of tariff options',
          show: true
        }
      ],
      value: [
        {
          msisdn: '15234578967',
          contractDate: 1453507200000,
          isCanceled: false,
          numberOfTariffOptions: 23
        },
        {
          msisdn: '15242358902',
          contractDate: 1405123200000,
          isCanceled: true,
          numberOfTariffOptions: 6
        },
        {
          msisdn: '15247119078',
          contractDate: 1544745600000,
          isCanceled: false,
          numberOfTariffOptions: 18
        },
        {
          msisdn: '15221364589',
          contractDate: 1542931200000,
          isCanceled: false,
          numberOfTariffOptions: 18
        }
      ],
      columnSelection: boolean('Column Selection', true),
      exportToCsv: boolean('Export to CSV', true),
      resultCount: boolean('Result Count', true)
    }
  }))
  .add('No Results', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value"></sncr-datatable>`,
    props: {
      cols: [
        {
          field: 'fullName',
          type: 'text',
          title: 'Full Name',
          show: true
        }
      ],
      value: []
    }
  }))
  .add('Many Results', () => {
    const iterGivenNames = counterWithPrefix('Given Name ');
    const iterSurnames = counterWithPrefix('Surname ');

    const value = [];
    for (let i = 0; i < 100000; i++) {
      value.push({
        givenName: iterGivenNames.next().value,
        surname: iterSurnames.next().value
      });
    }

    return {
      template: `<sncr-datatable [cols]="cols" [value]="value"></sncr-datatable>`,
      props: {
        cols: [
          {
            field: 'givenName',
            type: 'text',
            title: 'Given Name',
            show: true,
            filter: false
          },
          {
            field: 'surname',
            type: 'text',
            title: 'Surname',
            show: true,
            filter: false
          }
        ],
        value
      }
    };
  })
  .add('With Filters', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value"></sncr-datatable>`,
    props: {
      cols: [
        {
          field: 'msisdn',
          type: 'text',
          title: 'MSISDN',
          show: true
        },
        {
          field: 'contractDate',
          type: 'date',
          title: 'Contract Date',
          show: true
        },
        {
          field: 'isCanceled',
          type: 'boolean',
          title: 'Is canceled',
          show: true
        },
        {
          field: 'numberOfTariffOptions',
          type: 'number',
          title: 'Number of tariff options',
          show: true
        }
      ],
      value: [
        {
          msisdn: '15234578967',
          contractDate: 1453507200000,
          isCanceled: false,
          numberOfTariffOptions: 23
        },
        {
          msisdn: '15242358902',
          contractDate: 1405123200000,
          isCanceled: true,
          numberOfTariffOptions: 6
        },
        {
          msisdn: '15247119078',
          contractDate: 1544745600000,
          isCanceled: false,
          numberOfTariffOptions: 18
        },
        {
          msisdn: '15221364589',
          contractDate: 1542931200000,
          isCanceled: false,
          numberOfTariffOptions: 18
        }
      ]
    }
  }))
  .add('Without Filters', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value" [filter]="false"></sncr-datatable>`,
    props: {
      cols: [
        {
          field: 'msisdn',
          type: 'text',
          title: 'MSISDN',
          show: true
        },
        {
          field: 'contractDate',
          type: 'date',
          title: 'Contract Date',
          show: true
        },
        {
          field: 'isCanceled',
          type: 'boolean',
          title: 'Is canceled',
          show: true
        },
        {
          field: 'numberOfTariffOptions',
          type: 'number',
          title: 'Number of tariff options',
          show: true
        }
      ],
      value: [
        {
          msisdn: '15234578967',
          contractDate: 1453507200000,
          isCanceled: false,
          numberOfTariffOptions: 23
        },
        {
          msisdn: '15242358902',
          contractDate: 1405123200000,
          isCanceled: true,
          numberOfTariffOptions: 6
        },
        {
          msisdn: '15247119078',
          contractDate: 1544745600000,
          isCanceled: false,
          numberOfTariffOptions: 18
        },
        {
          msisdn: '15221364589',
          contractDate: 1542931200000,
          isCanceled: false,
          numberOfTariffOptions: 18
        }
      ]
    }
  }))
  .add('With Single Selection', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value" [(selection)]="selected" [selectionMode]="'radio'"></sncr-datatable>`,
    props: {
      selected: [],
      cols: [
        {
          field: 'msisdn',
          type: 'text',
          title: 'MSISDN',
          show: true
        },
        {
          field: 'contractDate',
          type: 'date',
          title: 'Contract Date',
          show: true
        },
        {
          field: 'isCanceled',
          type: 'boolean',
          title: 'Is canceled',
          show: true
        },
        {
          field: 'numberOfTariffOptions',
          type: 'number',
          title: 'Number of tariff options',
          show: true
        }
      ],
      value: [
        {
          msisdn: '15234578967',
          contractDate: 1453507200000,
          isCanceled: false,
          numberOfTariffOptions: 23
        },
        {
          msisdn: '15242358902',
          contractDate: 1405123200000,
          isCanceled: true,
          numberOfTariffOptions: 6
        },
        {
          msisdn: '15247119078',
          contractDate: 1544745600000,
          isCanceled: false,
          numberOfTariffOptions: 18
        },
        {
          msisdn: '15221364589',
          contractDate: 1542931200000,
          isCanceled: false,
          numberOfTariffOptions: 18
        }
      ]
    }
  }))
  .add('With Multi Selection', () => ({
    template: `<sncr-datatable [cols]="cols" [value]="value" [(selection)]="selected" [multiSelection]="true"></sncr-datatable>`,
    props: {
      selected: [],
      cols: [
        {
          field: 'msisdn',
          type: 'text',
          title: 'MSISDN',
          show: true
        },
        {
          field: 'contractDate',
          type: 'date',
          title: 'Contract Date',
          show: true
        },
        {
          field: 'isCanceled',
          type: 'boolean',
          title: 'Is canceled',
          show: true
        },
        {
          field: 'numberOfTariffOptions',
          type: 'number',
          title: 'Number of tariff options',
          show: true
        }
      ],
      value: [
        {
          msisdn: '15234578967',
          contractDate: 1453507200000,
          isCanceled: false,
          numberOfTariffOptions: 23
        },
        {
          msisdn: '15242358902',
          contractDate: 1405123200000,
          isCanceled: true,
          numberOfTariffOptions: 6
        },
        {
          msisdn: '15247119078',
          contractDate: 1544745600000,
          isCanceled: false,
          numberOfTariffOptions: 18
        },
        {
          msisdn: '15221364589',
          contractDate: 1542931200000,
          isCanceled: false,
          numberOfTariffOptions: 18
        }
      ]
    }
  }))
  .add('With View Options', () => {
    return {
      template: `<sncr-datatable [cols]="cols" [value]="value" [columnSelection]="true"></sncr-datatable>`,
      props: {
        cols: [
          {
            field: 'msisdn',
            type: 'text',
            title: 'MSISDN',
            show: true
          },
          {
            field: 'contractDate',
            type: 'date',
            title: 'Contract Date',
            show: true
          },
          {
            field: 'isCanceled',
            type: 'boolean',
            title: 'Is canceled',
            show: true
          },
          {
            field: 'numberOfTariffOptions',
            type: 'number',
            title: 'Number of tariff options',
            show: true
          }
        ],
        value: [
          {
            msisdn: '15234578967',
            contractDate: 1453507200000,
            isCanceled: false,
            numberOfTariffOptions: 23
          },
          {
            msisdn: '15242358902',
            contractDate: 1405123200000,
            isCanceled: true,
            numberOfTariffOptions: 6
          },
          {
            msisdn: '15247119078',
            contractDate: 1544745600000,
            isCanceled: false,
            numberOfTariffOptions: 18
          },
          {
            msisdn: '15221364589',
            contractDate: 1542931200000,
            isCanceled: false,
            numberOfTariffOptions: 18
          }
        ]
      }
    };
  })
  .add('With Lazy Load', () => {
    const columns = [
      {
        field: 'msisdn',
        title: 'MSISDN',
        isVisible: true,
        isFilterable: true,
        filter: undefined,
        isSortable: true,
        sorting: undefined,
        type: 'text'
      },
      {
        field: 'contractDate',
        title: 'Contract Date',
        isVisible: true,
        isFilterable: true,
        filter: undefined,
        isSortable: true,
        sorting: undefined,
        type: 'date'
      },
      {
        field: 'isCanceled',
        title: 'Is canceled',
        isVisible: true,
        isFilterable: false,
        filter: undefined,
        isSortable: true,
        sorting: undefined,
        type: 'boolean'
      },
      {
        field: 'numberOfTariffOptions',
        title: 'Number of tariff options',
        isVisible: true,
        isFilterable: true,
        filter: undefined,
        isSortable: true,
        sorting: undefined,
        type: 'number'
      }
    ];

    const rows = [
      {
        msisdn: '15234578967',
        contractDate: 1453507200000,
        isCanceled: false,
        numberOfTariffOptions: 23
      },
      {
        msisdn: '15242358902',
        contractDate: 1405123200000,
        isCanceled: true,
        numberOfTariffOptions: 6
      },
      {
        msisdn: '15247119078',
        contractDate: 1544745600000,
        isCanceled: false,
        numberOfTariffOptions: 18
      },
      {
        msisdn: '15221364589',
        contractDate: 1542931200000,
        isCanceled: false,
        numberOfTariffOptions: 18
      }
    ];

    datatableService.reset();
    datatableService.setColumns(columns as Column[]);
    datatableService.setRows(rows);

    return {
      template: `<sncr-datatable [cols]="cols" [lazy]="lazy" [lazyLoadUrl]="lazyLoadUrl" [columnSelection]="true"></sncr-datatable>`,
      props: {
        lazy: true,
        lazyLoadUrl: '/some/url',
        cols: columns
          .filter(c => c.type !== 'selection')
          .map(column => ({
            field: column.field,
            title: column.title,
            type: column.type,
            show: column.isVisible,
            sortable: column.isSortable,
            filter: column.isFilterable
          }))
      }
    };
  });
