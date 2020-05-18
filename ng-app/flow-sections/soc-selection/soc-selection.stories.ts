import {storiesOf, moduleMetadata} from '@storybook/angular';

import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {SocSelectionModule} from './soc-selection.module';

import {AppService} from '../../app/app.service';
import {PageScrollService} from 'ngx-page-scroll';
import {SncrPlannedChangesService} from '../../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {SocSelectionService} from './soc-selection.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

import * as SocSelectionComponentAst from 'ast!./soc-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@NgModule({
  imports: [SocSelectionModule],
  exports: [SocSelectionModule]
})
class StorySocSelectionModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('common', 'vvl-flow')
    );
  }
}

storiesOf('Templates|Flow Sections/Soc Selection', module)
  .addParameters(generateDocumentation(SocSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StorySocSelectionModule
      ],
      providers: [
        AppService,
        PageScrollService,
        SncrPlannedChangesService,
        SocSelectionService,
        TranslationsGuidsService
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<soc-selection></soc-selection>`
  }));
