import {storiesOf, moduleMetadata} from '@storybook/angular';

import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {ArticleSelectionModule} from './article-selection.module';

import {AppService} from '../../app/app.service';
import {ArticleSelectionService} from './article-selection.service';
import {PageScrollService} from 'ngx-page-scroll';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

import * as ArticleSelectionComponentAst from 'ast!./article-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@NgModule({
  imports: [ArticleSelectionModule],
  exports: [ArticleSelectionModule]
})
class StoryArticleSelectionModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids('common', 'vvl-flow')
    );
  }
}

storiesOf('Templates|Flow Sections/Article Selection', module)
  .addParameters(generateDocumentation(ArticleSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StoryArticleSelectionModule
      ],
      providers: [
        AppService,
        ArticleSelectionService,
        PageScrollService,
        TranslationsGuidsService
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<article-selection></article-selection>`
  }));
