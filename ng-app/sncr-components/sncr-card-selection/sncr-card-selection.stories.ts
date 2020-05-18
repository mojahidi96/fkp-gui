import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, select, text} from '@storybook/addon-knobs';

import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';

import {SncrCardSelectionModule} from './sncr-card-selection.module';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';

import * as SncrCardSelectionComponentAst from 'ast!./sncr-card-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

const iconMapping = () => {
  let map = new Map<string, string>();

  map.set('3g', 'g3Icon');
  map.set('4g-plus', 'g4PlusIcon');
  map.set('4g', 'g4Icon');
  map.set('bold', 'boldIcon');
  map.set('call.contacts', 'calls-contactsIcon');
  map.set('confidential', 'confidentialIcon');
  map.set('connectivity', 'connectivityIcon');
  map.set('customers-or-users', 'customersIcon');
  map.set('data', 'dataIcon');
  map.set('delivery', 'deliveryIcon');
  map.set('fixed-line', 'fixed-lineIcon');
  map.set('info.circle', 'info-circleIcon');
  map.set('international.minutes', 'international-minutes');
  map.set('landline.or.call', 'landline-or-call');
  map.set('location', 'locationIcon');
  map.set('mail.new', 'mail-newIcon');
  map.set('minutes-sms', 'minutes-smsIcon');
  map.set('mobile', 'mobileIcon');
  map.set('number-portability', 'number-portabilityIcon');
  map.set('privacy', 'privacyIcon');
  map.set('roaming', 'roamingIcon');
  map.set('screen-size', 'screen-sizeIcon');
  map.set('security', 'securityIcon');
  map.set('sim', 'simIcon');
  map.set('sim-swap', 'sim-swapIcon');
  map.set('storage', 'storageIcon');
  map.set('tablet', 'tabletIcon');
  map.set('unified-communication', 'unified-communicationIcon');
  map.set('virus-protection', 'virus-protectionIcon');
  map.set('wifi', 'wifiIcon');

  return map;
};

storiesOf('SNCR Components|Card Selection', module)
  .addParameters(generateDocumentation(SncrCardSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SncrCardSelectionModule
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-card-selection [filter]="filter" [icon]="icon" [properties]="properties" [titleText]="titleText" [hasDescriptions]="hasDescriptions" [showDescriptions]="showDescriptions" [showText]="showText" [hideText]="hideText"></sncr-card-selection>`,
    props: {
      filter: text('Filter', ''),
      icon: select(
        'Icon',
        Array.from(iconMapping().keys()),
        Array.from(iconMapping().keys())[0]
      ),
      properties: iconMapping(),
      titleText: text('Title Text', 'Group Name'),
      hasDescriptions: boolean('Has Descriptions', true),
      showDescriptions: boolean('Show Descriptions', true),
      showText: text('Show Text', 'Show description'),
      hideText: text('Hide Text', 'Hide description')
    }
  }));
