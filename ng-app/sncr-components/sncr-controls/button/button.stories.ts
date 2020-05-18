import {storiesOf, moduleMetadata} from '@storybook/angular';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';

import {ButtonModule} from './button.module';

import * as ButtonComponentAst from 'ast!./button.component';
import {generateDocumentation} from '../../../../storybook/utils/api';

storiesOf('SNCR Components|Button', module)
  .addParameters(generateDocumentation(ButtonComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [ButtonModule]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-button [type]="type" [text]="text" [disabled]="disabled" 
    [href]="href" [loading]="loading" (click)="onClick()"></sncr-button>`,
    props: {
      onClick: action('button-click'),
      type: select('Type', ['primary', 'secondary', 'strong'], 'primary'),
      text: text('Text', 'Hello Storybook'),
      disabled: boolean('Disabled', false),
      loading: boolean('Loading', false),
      href: text('Href', '')
    }
  }))
  .add('Primary Button', () => ({
    template: `<sncr-button text="Place Order"></sncr-button>`
  }))
  .add('Secondary Button', () => ({
    template: `<sncr-button text="Click me!" type="secondary"></sncr-button>`
  }))
  .add('Strong Button', () => ({
    template: `<sncr-button text="Click me!" type="strong"></sncr-button>`
  }))
  .add('Loading State', () => ({
    template: `<sncr-button text="Placing Order" type="primary" [loading]="true"></sncr-button>`
  }));
