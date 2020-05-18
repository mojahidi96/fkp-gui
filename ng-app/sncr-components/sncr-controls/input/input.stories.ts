import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, number, select, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {InputModule} from './input.module';

import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as InputComponentAst from 'ast!./input.component';
import {generateDocumentation} from '../../../../storybook/utils/api';

storiesOf('SNCR Components|Input', module)
  .addParameters(generateDocumentation(InputComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        InputModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-input [type]="type" [label]="label" [placeholder]="placeholder" 
        [maxLength]="maxLength" [autocomplete]="autocomplete" [infoIcon]="infoIcon"></sncr-input>`,
    props: {
      type: select('Type', ['text'], 'text'),
      label: text('Label', 'Full Name'),
      placeholder: text('Placeholder', undefined),
      maxLength: number('Max Length', undefined),
      autocomplete: boolean('Auto Complete', false),
      infoIcon: text('Info Icon', 'Please enter your full name.')
    }
  }));
