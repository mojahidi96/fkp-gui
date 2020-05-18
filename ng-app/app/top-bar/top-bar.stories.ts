import {storiesOf, moduleMetadata} from '@storybook/angular';

import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TopBarModule} from './top-bar.module';
import {TopBarComponent} from './top-bar.component';
import {TopBarService} from './top-bar.service';
import {TimeoutService} from '../timeout/timeout.service';

import * as TopBarComponentAst from 'ast!./top-bar.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('Templates|TopBar', module)
  .addParameters(generateDocumentation(TopBarComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        RouterModule.forRoot([
          {path: 'iframe.html', component: TopBarComponent}
        ]),
        TopBarModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: ''},
        TopBarService,
        TimeoutService
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-top-bar></sncr-top-bar>`
  }));
