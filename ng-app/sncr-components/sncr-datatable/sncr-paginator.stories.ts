import {storiesOf, moduleMetadata} from '@storybook/angular';
import {number} from '@storybook/addon-knobs';

import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslationModule} from 'angular-l10n';

import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../sncr-controls/validation-messages/sncr-validation-messages.service';

import {SncrPaginatorModule} from './sncr-paginator.module';

import * as PaginatorComponentAst from 'ast!./sncr-paginator.component';
import {generateDocumentation} from '../../../storybook/utils/api';
import {SncrDatatableService} from './sncr-datatable.service';
import {AppService} from '../../app/app.service';
import {TranslationsGuidsService} from '../sncr-commons/translations-guids.service';
import {FilterRestoreService} from '../sncr-commons/filter-restore.service';

@NgModule({
  imports: [SncrPaginatorModule],
  exports: [SncrPaginatorModule]
})
class StorySncrPaginatorModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('default-data-table')
    );
  }
}

class SncrDatatableServiceMock {
  static areDirtyFormsInvalid() {
    return false;
  }
}

storiesOf('SNCR Components|Paginator', module)
  .addParameters(generateDocumentation(PaginatorComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        RouterModule.forRoot([], {onSameUrlNavigation: 'reload'}),
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StorySncrPaginatorModule
      ],
      providers: [
        {
          provide: SncrDatatableService,
          useValue: new SncrDatatableServiceMock()
        },
        AppService,
        TranslationsGuidsService,
        ValidationMessagesService,
        FilterRestoreService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-paginator [rows]="rows" [rowsPerPageOptions]="rowsPerPageOptions" [totalRecords]="totalRecords"></sncr-paginator>`,
    props: {
      rows: number('Rows', 10),
      rowsPerPageOptions: [10, 20, 30, 40],
      totalRecords: number('Total Records', 100)
    }
  }))
  .add('Various variants', () => ({
    template: `<div>
      <sncr-paginator [rows]="1" [totalRecords]="1"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="2"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="3"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="4"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="5"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="6"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="7"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="8"></sncr-paginator>
      <sncr-paginator [rows]="1" [totalRecords]="80"></sncr-paginator>
    </div>`
  }));
