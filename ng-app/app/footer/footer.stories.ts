import {storiesOf, moduleMetadata} from '@storybook/angular';

import {HttpClientModule} from '@angular/common/http';

import {FooterModule} from './footer.module';
import {FooterService} from './footer.service';

import * as FooterComponentAst from 'ast!./footer.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('Templates|Footer', module)
  .addParameters(generateDocumentation(FooterComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [HttpClientModule, FooterModule],
      providers: [FooterService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-footer></sncr-footer>`
  }));
