import {storiesOf, moduleMetadata} from '@storybook/angular';
import {select} from '@storybook/addon-knobs';

import {SncrLoaderModule} from './sncr-loader.module';

import * as SncrLoaderComponentAst from 'ast!./sncr-loader.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('SNCR Components|Loader', module)
  .addParameters(generateDocumentation(SncrLoaderComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [SncrLoaderModule]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-loader [class]="class"></sncr-loader>`,
    props: {
      class: select('Class', ['custom-inline', 'dark'], 'dark')
    }
  }))
  .add('Full Width', () => ({
    template: `<sncr-loader class="dark"></sncr-loader>`
  }))
  .add('Fixed With', () => ({
    template: `<sncr-loader class="custom-inline"></sncr-loader>`
  }));
