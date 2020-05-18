import {moduleMetadata, storiesOf} from '@storybook/angular';
import {boolean, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as DatepickerComponentAst from 'ast!./datepicker.component';
import {generateDocumentation} from '../../../../storybook/utils/api';
import {SncrControlsModule} from '../sncr-controls.module';

storiesOf('SNCR Components|Datepicker', module)
  .addParameters(generateDocumentation(DatepickerComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SncrControlsModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-datepicker [(ngModel)]="date" [label]="label" [required]="required"></sncr-datepicker>`,
    props: {
      label: text('Label', 'Start Date'),
      required: boolean('Required', false),
      date: {
        day: 27,
        month: 2,
        year: 2019
      }
    }
  }))
  .add('With Placeholder', () => ({
    template: `<sncr-datepicker [(ngModel)]="date" [label]="label" [placeholder]="placeholder"></sncr-datepicker>`,
    props: {
      label: 'Start Date',
      date: undefined,
      placeholder: 'When do you want to start?'
    }
  }));
