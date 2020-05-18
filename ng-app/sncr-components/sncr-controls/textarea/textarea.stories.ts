import {storiesOf, moduleMetadata} from '@storybook/angular';
import {number, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {TextareaModule} from './textarea.module';

import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as TextareaComponentAst from 'ast!./textarea.component';
import {generateDocumentation} from '../../../../storybook/utils/api';

storiesOf('SNCR Components|Textarea', module)
  .addParameters(generateDocumentation(TextareaComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        TextareaModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-textarea [cols]="cols" [rows]="rows" [maxlength]="maxlength" [placeholder]="placeholder"></sncr-textarea>`,
    props: {
      cols: number('Cols', 10),
      rows: number('Rows', 2),
      maxlength: number('Max Length', 100),
      placeholder: text('Placeholder', '')
    }
  }));
