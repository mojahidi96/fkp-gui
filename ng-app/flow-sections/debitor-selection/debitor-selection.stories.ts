import {storiesOf, moduleMetadata} from '@storybook/angular';

import {NgModule} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TranslationModule} from 'angular-l10n';
import {NgxsModule} from '@ngxs/store';

import {DebitorSelectionModule} from './debitor-selection.module';

import {AppService} from '../../app/app.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TimeoutService} from '../../app/timeout/timeout.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

import * as DebitorSelectionComponentAst from 'ast!./debitor-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@NgModule({
  imports: [DebitorSelectionModule],
  exports: [DebitorSelectionModule]
})
class StoryDebitorSelectionModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'address-selection-bundle',
        'default-data-table'
      )
    );
  }
}

storiesOf('Templates|Flow Sections/Debitor Selection', module)
  .addParameters(generateDocumentation(DebitorSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        RouterModule.forRoot([], {onSameUrlNavigation: 'reload'}),
        HttpClientModule,
        NgxsModule.forRoot([]),
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StoryDebitorSelectionModule
      ],
      providers: [
        AppService,
        TimeoutService,
        TranslationsGuidsService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<debitor-selection addressSelectionType="DEBITOR"></debitor-selection>`
  }));
