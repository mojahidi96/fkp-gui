import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, number, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {SelectModule} from './select.module';

import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as SelectComponentAst from 'ast!./select.component';
import {generateDocumentation} from '../../../../storybook/utils/api';

storiesOf('SNCR Components|Select', module)
  .addParameters(generateDocumentation(SelectComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SelectModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `
      <sncr-select [label]="label" [required]="required" [size]="size">
        <option *ngFor="let option of options" [ngValue]="option">{{ option }}</option>
      </sncr-select>
    `,
    props: {
      label: text('Label', 'Country'),
      options: [
        'China',
        'Germany',
        'India',
        'Ireland',
        'Sweden',
        'United States of America'
      ],
      required: boolean('Required', true),
      size: number('Size', undefined)
    }
  }));
