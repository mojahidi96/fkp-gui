import {storiesOf, moduleMetadata} from '@storybook/angular';
import {text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {RadioModule} from './radio.module';

import {CheckGroupModule} from '../check-group/check-group.module';
import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as RadioComponentAst from 'ast!./radio.component';
import {generateDocumentation} from '../../../../storybook/utils/api';

storiesOf('SNCR Components|Radio', module)
  .addParameters(generateDocumentation(RadioComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        CheckGroupModule,
        RadioModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `
      <sncr-check-group [(ngModel)]="value">
        <sncr-radio *ngFor="let label of labels" [label]="label" [value]="label"></sncr-radio>
      </sncr-check-group>
    `,
    props: {
      labels: text('Labels (comma-separated)', 'Coffee, Tea').split(/,\s*/)
    }
  }))
  .add('Two Radios', () => ({
    template: `
      <sncr-check-group [(ngModel)]="value">
        <sncr-radio label="Coffee" value="coffee"></sncr-radio>
        <sncr-radio label="Tea" value="tea"></sncr-radio>
      </sncr-check-group>
    `,
    props: {
      value: 'coffee'
    }
  }))
  .add('Inline', () => ({
    template: `
      <sncr-check-group [(ngModel)]="value" [inline]="true">
        <sncr-radio label="Coffee" value="coffee"></sncr-radio>
        <sncr-radio label="Tea" value="tea"></sncr-radio>
      </sncr-check-group>
    `,
    props: {
      value: 'coffee',
      inline: true
    }
  }));
