import {storiesOf, moduleMetadata} from '@storybook/angular';

import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {TranslationModule} from 'angular-l10n';
import {NgxsModule} from '@ngxs/store';

import {TariffgridSelectionModule} from './tariffgrid-selection.module';

import {AppService} from '../../app/app.service';
import {PageScrollService} from 'ngx-page-scroll';
import {RolesService} from '../../flow-maintainsoc/roles.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TariffSelectionService} from './tariff-selection.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

import * as TariffgridSelectionComponentAst from 'ast!./tariffgrid-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@NgModule({
  imports: [TariffgridSelectionModule],
  exports: [TariffgridSelectionModule]
})
class StoryTariffgridSelectionModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('common', 'vvl-flow')
    );
  }
}

storiesOf('Templates|Flow Sections/Tariff Grid Selection', module)
  .addParameters(generateDocumentation(TariffgridSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        NgxsModule.forRoot([]),
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StoryTariffgridSelectionModule
      ],
      providers: [
        AppService,
        PageScrollService,
        RolesService,
        TariffSelectionService,
        TranslationsGuidsService
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<tariffgrid-selection></tariffgrid-selection>`
  }));
