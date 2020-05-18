import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {SncrCheckboxModule} from './sncr-checkbox.module';

import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';

import * as SncrCheckboxComponentAst from 'ast!./sncr-checkbox.component';
import {generateDocumentation} from '../../../../storybook/utils/api';
import {CheckGroupModule} from '../check-group/check-group.module';

storiesOf('SNCR Components|Checkbox', module)
  .addParameters(generateDocumentation(SncrCheckboxComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        CheckGroupModule,
        SncrCheckboxModule
      ],
      providers: [ValidationMessagesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-checkbox [label]="label" [(ngModel)]="value"></sncr-checkbox>`,
    props: {
      label: text('Label', 'Get a coffee'),
      value: boolean('Value', false)
    }
  }))
  .add('Multiple Checkboxes', () => ({
    template: `
      <sncr-checkbox label="Add a drink" [(ngModel)]="drink"></sncr-checkbox>
      <sncr-checkbox label="Use coupon" [(ngModel)]="coupon"></sncr-checkbox>
    `,
    props: {
      drink: true,
      coupon: false
    }
  }))
  .add('Inline', () => ({
    template: `
     <sncr-check-group [inline]="true">
        <sncr-checkbox label="Add a drink" [(ngModel)]="drink"></sncr-checkbox>
        <sncr-checkbox label="Use coupon" [(ngModel)]="coupon"></sncr-checkbox>
     </sncr-check-group>
    `,
    props: {
      drink: true,
      coupon: false,
      inline: true
    }
  }));
